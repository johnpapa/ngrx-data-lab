/*
 * Test the component by mocking its injected ngrx-data VillainService
 *
 * You have a choice of testing the component class alone or the component-and-its-template.
 * The latter requires importing more stuff and a bit more setup.
 */

// region imports
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first, skip } from 'rxjs/operators';

import { Villain } from '../../core';
import { VillainsComponent } from './villains.component';
import { VillainService } from '../villain.service';

// Used only to test class/template interaction
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { VillainListComponent } from '../villain-list/villain-list.component';
import { VillainDetailComponent } from '../villain-detail/villain-detail.component';

// endregion imports

describe('VillainsComponent (mock VillainService)', () => {
  describe('class-only', () => {
    it('can create component', () => {
      const { component } = villainsComponentSetupAsService();
      expect(component).toBeDefined();
    });

    it('has empty array of villains$ before ngOnInit', () => {
      const { component } = villainsComponentSetupAsService();
      component.villains$.subscribe(results => expect(results).toEqual([]));
    });

    it('has initial array of villains$ after ngOnInit', () => {
      const { component, initialVillains } = villainsComponentSetupAsService();
      component.villains$
        .pipe(skip(1))
        .subscribe(results => expect(results).toEqual(initialVillains));
      component.ngOnInit();
    });

    it('should call service.add(villain) when add(villain) called', () => {
      const {
        component,
        testVillainService
      } = villainsComponentSetupAsService();
      const villain = { id: undefined, name: 'test', saying: 'test saying' };
      component.add(villain);
      expect(testVillainService.add).toHaveBeenCalledWith(villain);
    });

    it('should call service.delete(id) when delete(villain) called', () => {
      const {
        component,
        testVillainService
      } = villainsComponentSetupAsService();
      const villain = { id: 42, name: 'test', saying: 'test saying' };
      component.delete(villain);
      expect(testVillainService.delete).toHaveBeenCalledWith(42);
    });

    it('should call service.update(villain) when update(villain) called', () => {
      const {
        component,
        testVillainService
      } = villainsComponentSetupAsService();
      const villain = { id: 42, name: 'test', saying: 'test saying' };
      component.update(villain);
      expect(testVillainService.update).toHaveBeenCalledWith(villain);
    });

    it('should set selected to an object when enableAddMode() called', () => {
      const { component } = villainsComponentSetupAsService();
      component.enableAddMode();
      expect(component.selected).toBeDefined();
    });

    it('should set selected null when close() called', () => {
      const { component } = villainsComponentSetupAsService();
      component.selected = { id: 42, name: 'test', saying: 'test saying' };
      component.close();
      expect(component.selected).toBeNull();
    });

    it('should set selected null when unselect() called', () => {
      const { component } = villainsComponentSetupAsService();
      component.selected = { id: 42, name: 'test', saying: 'test saying' };
      component.unselect();
      expect(component.selected).toBeNull();
    });

    it('should set selected to villain when select(villain) called', () => {
      const { component } = villainsComponentSetupAsService();
      const villain = { id: 42, name: 'test', saying: 'test saying' };
      component.select(villain);
      expect(component.selected).toBe(villain);
    });
  });

  describe('class+template', () => {
    describe('component', () => {
      it('can create component', () => {
        const { component } = villainsComponentSetup();
        expect(component).toBeDefined();
      });
    });

    describe('listComponent', () => {
      it(
        'should initialize list component',
        fakeAsync(() => {
          const {
            listComponent,
            initialVillains
          } = villainListComponentSetup();
          expect(listComponent).toBeDefined();
          expect(listComponent.villains).toBe(initialVillains);
        })
      );

      it(
        'should call service.delete(villain) after listComponent.delete(villain)',
        fakeAsync(() => {
          const {
            fixture,
            listComponent,
            initialVillains,
            testVillainService,
            testVillainsSubject
          } = villainListComponentSetup();
          const testVillain = listComponent.villains[0];
          testVillainService.delete.and.callFake(() => {
            testVillainsSubject.next(
              initialVillains.filter(v => v.id !== testVillain.id)
            );
          });
          listComponent.deleteVillain(testVillain);
          tick();
          fixture.detectChanges();
          expect(testVillainService.delete).toHaveBeenCalledWith(
            testVillain.id
          );
          expect(listComponent.villains.length).toBe(
            initialVillains.length - 1,
            'removed deleted'
          );
        })
      );

      it(
        'should set listComponent.selected after listComponent.select(villain)',
        fakeAsync(() => {
          // Calling listComponent.select() goes up to container and back down.
          const {
            fixture,
            listComponent,
            listEl
          } = villainListComponentSetup();
          const testVillain = listComponent.villains[0];
          // find first villain element in the list
          // Note: must click element to see behavior.
          // Merely, calling listComponent.select() because can't detectChanges() won't work.
          const villainEl = listEl.query(By.css('.selectable-item'));
          villainEl.triggerEventHandler('click', null);
          fixture.detectChanges();
          expect(listComponent.selectedVillain).toBe(testVillain);
        })
      );
    });

    describe('detailComponent (selected)', () => {
      it(
        'should open for selected villain',
        fakeAsync(() => {
          const { detailEl } = openDetailForSelected();
          expect(detailEl).toBeDefined('Opened detail');
        })
      );

      it(
        'should close when click cancel',
        fakeAsync(() => {
          const { detailEl, fixture } = openDetailForSelected();

          const cancelButton = detailEl.query(By.css('button[type=button'));
          cancelButton.triggerEventHandler('click', null);
          fixture.detectChanges();
          const detailEl2 = fixture.debugElement.query(
            By.directive(VillainDetailComponent)
          );
          expect(detailEl2).toBeNull('detail gone after cancel');
        })
      );

      it(
        'should save update by clicking save',
        fakeAsync(() => {
          const {
            detailEl,
            fixture,
            testVillainService
          } = openDetailForSelected();

          const detailComponent: VillainDetailComponent =
            detailEl.componentInstance;

          const inputBox: HTMLInputElement = detailEl.query(
            By.css('input[formControlName=name')
          ).nativeElement;
          inputBox.value = 'new name';
          // Must dispatch the input box's `input` event so Angular hears it.
          inputBox.dispatchEvent(new Event('input'));
          fixture.detectChanges();

          const saveButton: HTMLButtonElement = detailEl.query(
            By.css('button[type=submit')
          ).nativeElement;
          saveButton.click();
          fixture.detectChanges();

          // Changed value does not propagate to list because spy does nothing in this test
          expect(testVillainService.update).toHaveBeenCalled();
        })
      );

      function openDetailForSelected() {
        const { fixture, testVillainService } = villainListComponentSetup();
        const villainEl = fixture.debugElement.query(
          By.css('.selectable-item')
        );
        villainEl.triggerEventHandler('click', null);
        fixture.detectChanges();

        const detailEl = fixture.debugElement.query(
          By.directive(VillainDetailComponent)
        );
        return { detailEl, fixture, testVillainService };
      }
    });

    describe('detailComponent (add)', () => {
      it(
        'should open for added villain',
        fakeAsync(() => {
          const { detailEl } = openDetailForNew();
          expect(detailEl).toBeDefined('Opened detail');
        })
      );

      it(
        'should close when click cancel',
        fakeAsync(() => {
          const { detailEl, fixture } = openDetailForNew();

          const cancelButton = detailEl.query(By.css('button[type=button'));
          cancelButton.triggerEventHandler('click', null);
          fixture.detectChanges();
          const detailEl2 = fixture.debugElement.query(
            By.directive(VillainDetailComponent)
          );
          expect(detailEl2).toBeNull('detail gone after cancel');
        })
      );

      it(
        'should save new entity by clicking save',
        fakeAsync(() => {
          const { detailEl, fixture, testVillainService } = openDetailForNew();

          const detailComponent: VillainDetailComponent =
            detailEl.componentInstance;

          const inputBox: HTMLInputElement = detailEl.query(
            By.css('input[formControlName=name')
          ).nativeElement;
          inputBox.value = 'new name';
          // Must dispatch the input box's `input` event so Angular hears it.
          inputBox.dispatchEvent(new Event('input'));
          fixture.detectChanges();

          const saveButton: HTMLButtonElement = detailEl.query(
            By.css('button[type=submit')
          ).nativeElement;
          saveButton.click();
          fixture.detectChanges();

          // Changed value does not propagate to list because spy does nothing in this test
          expect(testVillainService.add).toHaveBeenCalled();
        })
      );

      function openDetailForNew() {
        const { fixture, testVillainService } = villainListComponentSetup();
        // We "know" it's the 2nd control panel button (brittle test)
        const addButton = fixture.debugElement.queryAll(
          By.css('.control-panel button')
        )[1];
        addButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        const detailEl = fixture.debugElement.query(
          By.directive(VillainDetailComponent)
        );
        return { detailEl, fixture, testVillainService };
      }
    });
  });
});

// region helpers
function keyPress(key: string, element: HTMLElement) {
  const evt = new KeyboardEvent('keydown', { key: 'x' });
  element.dispatchEvent(evt);
}

function villainsComponentCoreSetup() {
  const initialVillains = [
    { id: 1, name: 'A', saying: 'A says' },
    { id: 3, name: 'B', saying: 'B says' },
    { id: 2, name: 'C', saying: 'C says' }
  ];
  const testVillainsSubject = new BehaviorSubject<Villain[]>([]);
  const testVillainService = jasmine.createSpyObj('VillainService', [
    'getAll',
    'add',
    'delete',
    'update'
  ]);

  testVillainService.getAll.and.callFake(() => {
    // One tick, then deliver
    setTimeout(() => testVillainsSubject.next(initialVillains));
  });

  testVillainService.entities$ = testVillainsSubject.asObservable();

  TestBed.configureTestingModule({
    providers: [
      VillainsComponent, // When testing class-only
      { provide: VillainService, useValue: testVillainService }
    ]
  });

  return { initialVillains, testVillainService, testVillainsSubject };
}

function villainsComponentSetupAsService() {
  const vars = villainsComponentCoreSetup();
  const component: VillainsComponent = TestBed.get(VillainsComponent);
  return { ...vars, component };
}

// Call this when testing class/template interaction
// Not needed when testing class-only
function villainsComponentSetup() {
  TestBed.configureTestingModule({
    imports: [ReactiveFormsModule],
    declarations: [
      VillainsComponent,
      VillainListComponent,
      VillainDetailComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // ignore Angular Material elements
  });
  const vars = villainsComponentCoreSetup();
  const fixture = TestBed.createComponent(VillainsComponent);
  const component = fixture.componentInstance;
  return { ...vars, fixture, component };
}

function villainListComponentSetup() {
  const vars = villainsComponentSetup();
  vars.fixture.detectChanges(); // ngOnInit()
  tick(); // gets data
  vars.fixture.detectChanges(); // binding
  const listEl = vars.fixture.debugElement.query(
    By.directive(VillainListComponent)
  );
  const listComponent: VillainListComponent =
    listEl && listEl.componentInstance;
  return { ...vars, listEl, listComponent };
}
// endregion helpers
