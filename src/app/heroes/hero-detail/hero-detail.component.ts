import {
  Component,
  Input,
  ElementRef,
  OnChanges,
  ViewChild,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Hero, MasterDetailCommands } from '../../core';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroDetailComponent implements OnChanges {
  @Input() hero: Hero;
  @Input() commands: MasterDetailCommands<Hero>;

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
    if (this.hero && this.hero.id) {
      this.form.patchValue(this.hero);
      this.addMode = false;
    } else {
      this.form.reset();
      this.addMode = true;
    }
  }

  addHero(form: FormGroup) {
    const { value, valid, touched } = form;
    if (touched && valid) {
      this.commands.add({ ...this.hero, ...value });
    }
    this.close();
  }

  close() {
    this.commands.close();
  }

  saveHero(form: FormGroup) {
    if (this.addMode) {
      this.addHero(form);
    } else {
      this.updateHero(form);
    }
  }

  setFocus() {
    this.nameElement.nativeElement.focus();
  }

  updateHero(form: FormGroup) {
    const { value, valid, touched } = form;
    this.commands.update({ ...this.hero, ...value });
    this.close();
  }
}
