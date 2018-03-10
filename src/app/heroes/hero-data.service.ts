import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Hero } from './hero';

@Injectable()
export class HeroDataService {
  constructor(private httpClient: HttpClient) {}

  getHeroes() {
    return this.httpClient.get<Hero[]>('./heroes.json');
  }
}
