import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Villain } from '../../core';
import { VillainReactiveService } from '../villain-reactive.service';

@Component({
  selector: 'app-reactive-villains',
  templateUrl: './villains-reactive.component.html',
  styleUrls: ['./villains.component.scss']
})
export class VillainsReactiveComponent implements OnInit {
  selectedVillain: Villain;

  villains$: Observable<Villain[]>;
  loading$: Observable<boolean>;

  constructor(private villainService: VillainReactiveService) {
    this.villains$ = villainService.villains$;
    this.loading$ = villainService.loading$;
  }

  ngOnInit() {
    this.getVillains();
  }

  clear() {
    this.selectedVillain = null;
  }

  enableAddMode() {
    this.selectedVillain = <any> {};
  }

  getVillains() {
    this.villainService.getAll();
  }

  add(villain: Villain) {
    this.villainService.add(villain);
  }

  deleteVillain(villain: Villain) {
    this.villainService.delete(villain.id);
  }

  update(villain: Villain) {
    this.villainService.update(villain);
  }

  onSelect(villain: Villain) {
    this.selectedVillain = villain;
  }

  unselect() {
    this.selectedVillain = null;
  }
}
