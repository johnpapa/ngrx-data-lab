import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Hero, ToastService, ReactiveDataService } from '../core';

@Injectable()
export class HeroService extends ReactiveDataService<Hero> {
  constructor(http: HttpClient, toastService: ToastService) {
    super('Hero', http, toastService, 'heroes');
  }

  heroes$ = this.entities$;
}
