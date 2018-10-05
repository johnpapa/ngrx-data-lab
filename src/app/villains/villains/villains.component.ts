import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Villain } from '../../core';
import { VillainService } from '../villain.service';

@Component({
  selector: 'app-villains',
  templateUrl: './villains.component.html',
  styleUrls: ['./villains.component.scss']
})
export class VillainsComponent implements OnInit {
  addingVillain = false;
  selectedVillain: Villain;
  villains: Villain[];
  loading: boolean;

  constructor(private villainService: VillainService) {}

  ngOnInit() {
    this.getVillains();
  }

  clear() {
    this.addingVillain = false;
    this.selectedVillain = null;
  }

  deleteVillain(villain: Villain) {
    this.loading = true;
    this.unselect();
    this.villainService
      .deleteVillain(villain)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => (this.villains = this.villains.filter(h => h.id !== villain.id))
      );
  }

  enableAddMode() {
    this.addingVillain = true;
    this.selectedVillain = null;
  }

  getVillains() {
    this.loading = true;
    this.villainService
      .getVillains()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(villains => (this.villains = villains));
    this.unselect();
  }

  onSelect(villain: Villain) {
    this.addingVillain = false;
    this.selectedVillain = villain;
  }

  update(villain: Villain) {
    this.loading = true;
    this.villainService
      .updateVillain(villain)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () =>
          (this.villains = this.villains.map(
            h => (h.id === villain.id ? villain : h)
          ))
      );
  }

  add(villain: Villain) {
    this.loading = true;
    this.villainService
      .addVillain(villain)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        addedvillain => (this.villains = this.villains.concat(addedvillain))
      );
  }

  unselect() {
    this.addingVillain = false;
    this.selectedVillain = null;
  }
}
