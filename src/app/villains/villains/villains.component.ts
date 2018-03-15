import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MasterDetailCommands, Villain } from '../../core';
import { VillainService } from '../villain.service';

@Component({
  selector: 'app-villains',
  templateUrl: './villains.component.html',
  styleUrls: ['./villains.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VillainsComponent
  implements MasterDetailCommands<Villain>, OnInit {
  selected: Villain;
  commands = this;

  villains$: Observable<Villain[]>;
  loading$: Observable<boolean>;

  constructor(private villainService: VillainService) {
    this.villains$ = villainService.entities$;
    this.loading$ = villainService.loading$;
  }

  ngOnInit() {
    this.getVillains();
  }

  close() {
    this.selected = null;
  }

  enableAddMode() {
    this.selected = <any>{};
  }

  getVillains() {
    this.villainService.getAll();
    this.close();
  }

  add(villain: Villain) {
    this.villainService.add(villain);
  }

  delete(villain: Villain) {
    this.villainService.delete(villain.id);
    this.close();
  }

  update(villain: Villain) {
    this.villainService.update(villain);
  }

  select(villain: Villain) {
    this.selected = villain;
  }

  unselect() {
    this.selected = null;
  }
}
