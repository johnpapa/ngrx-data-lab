import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero, ToastService } from '../core';

const api = '/api';

@Injectable()
export class HeroService {
  constructor(private http: HttpClient, private toastService: ToastService) {}

  getAll() {
    return this.http
      .get<Array<Hero>>(`${api}/heroes`)
      .pipe(
        map(heroes => heroes),
        tap(() => this.toastService.openSnackBar('Heroes retrieved successfully!', 'GET')),
        catchError(this.handleError)
      );
  }

  private handleError(res: HttpErrorResponse) {
    console.error(res.error);
    return Observable.throw(res.error || 'Server error');
  }

  delete(id: number) {
    return this.http
      .delete(`${api}/hero/${id}`)
      .pipe(tap(() => this.toastService.openSnackBar(`Hero ${id} deleted`, 'DELETE')));
  }

  add(hero: Hero) {
    return this.http
      .post<Hero>(`${api}/hero/`, hero)
      .pipe(tap(() => this.toastService.openSnackBar(`Hero ${hero.name} added`, 'POST')));
  }

  update(hero: Hero) {
    return this.http
      .put<Hero>(`${api}/hero/${hero.id}`, hero)
      .pipe(tap(() => this.toastService.openSnackBar(`Hero ${hero.name} updated`, 'PUT')));
  }
}
