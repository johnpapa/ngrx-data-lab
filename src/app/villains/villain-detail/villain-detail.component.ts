import {
  Component,
  Input,
  ElementRef,
  OnChanges,
  Output,
  ViewChild,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MasterDetailCommands, Villain } from '../../core';

@Component({
  selector: 'app-villain-detail',
  templateUrl: './villain-detail.component.html',
  styleUrls: ['./villain-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VillainDetailComponent implements OnChanges {
  @Input() villain: Villain;
  @Input() commands: MasterDetailCommands<Villain>;

  @ViewChild('name') nameElement: ElementRef;

  addMode = false;
  form = this.fb.group({
    id: [],
    name: ['', Validators.required],
    saying: ['']
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    this.setFocus();
    if (this.villain && this.villain.id) {
      this.form.patchValue(this.villain);
      this.addMode = false;
    } else {
      this.form.reset();
      this.addMode = true;
    }
  }

  addVillain(form: FormGroup) {
    const { value, valid, touched } = form;
    if (touched && valid) {
      this.commands.add({ ...this.villain, ...value });
    }
    this.close();
  }

  close() {
    this.commands.close();
  }

  saveVillain(form: FormGroup) {
    if (this.addMode) {
      this.addVillain(form);
    } else {
      this.updateVillain(form);
    }
  }

  setFocus() {
    this.nameElement.nativeElement.focus();
  }

  updateVillain(form: FormGroup) {
    const { value, valid, touched } = form;
    this.commands.update({ ...this.villain, ...value });
    this.close();
  }
}
