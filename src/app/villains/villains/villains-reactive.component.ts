import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { MasterDetailCommands, Villain } from '../../core';
import { VillainReactiveService } from '../villain-reactive.service';

@Component({
  selector: 'app-reactive-villains',
  templateUrl: './villains-reactive.component.html',
  styleUrls: ['./villains.component.scss']
})
export class VillainsReactiveComponent
  implements MasterDetailCommands<Villain>, OnInit {
  selected: Villain;
  commands = this;

  villains$: Observable<Villain[]>;
  loading$: Observable<boolean>;

  constructor(private villainService: VillainReactiveService) {
    this.villains$ = villainService.villains$;
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
  }

  add(villain: Villain) {
    this.villainService.add(villain);
  }

  delete(villain: Villain) {
    this.villainService.delete(villain.id);
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
