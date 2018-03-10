import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { Hero } from '../../core';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  addingHero = false;
  selectedHero: Hero;

  heroes: Hero[];
  loading: boolean;

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getHeroes();
  }

  clear() {
    this.addingHero = false;
    this.selectedHero = null;
  }

  deleteHero(hero: Hero) {
    this.loading = true;
    this.unselect();
    this.heroService
      .deleteHero(hero)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => (this.heroes = this.heroes.filter(h => h.id !== hero.id)));
  }

  enableAddMode() {
    this.addingHero = true;
    this.selectedHero = null;
  }

  getHeroes() {
    this.loading = true;
    this.heroService
      .getHeroes()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(heroes => (this.heroes = heroes));
    this.unselect();
  }

  onSelect(hero: Hero) {
    this.addingHero = false;
    this.selectedHero = hero;
  }

  update(hero: Hero) {
    this.loading = true;
    this.heroService
      .updateHero(hero)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => (this.heroes = this.heroes.map(h => (h.id === hero.id ? hero : h))));
  }

  add(hero: Hero) {
    this.loading = true;
    this.heroService
      .addHero(hero)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(addedHero => (this.heroes = this.heroes.concat(addedHero)));
  }

  unselect() {
    this.addingHero = false;
    this.selectedHero = null;
  }
}
