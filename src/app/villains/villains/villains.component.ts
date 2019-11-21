import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Villain } from '../../core';
import { VillainService } from '../villain.service';

@Component({
  selector: 'app-villains',
  templateUrl: './villains.component.html',
  styleUrls: ['./villains.component.scss']
})
export class VillainsComponent implements OnInit {
  loading$: Observable<boolean>;
  selected: Villain;
  villains$: Observable<Villain[]>;

  constructor(private villainService: VillainService) {
    this.villains$ = villainService.entities$;
    this.loading$ = villainService.loading$;
  }

  ngOnInit() {
    this.getVillains();
  }

  add(villain: Villain) {
    this.villainService.add(villain);
  }

  close() {
    this.selected = null;
  }

  delete(villain: Villain) {
    this.villainService.delete(villain.id);
    this.close();
  }

  enableAddMode() {
    this.selected = <any>{};
  }

  getVillains() {
    this.villainService.getAll();
    this.close();
  }

  select(villain: Villain) {
    this.selected = villain;
  }

  toggleSuper(villain: Villain) {
    this.villainService.setIsSuper(villain.id, !villain.isSuper);
  }

  update(villain: Villain) {
    this.villainService.update(villain);
  }
}
