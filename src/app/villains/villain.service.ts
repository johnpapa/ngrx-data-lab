import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

import { Villain, ToastService } from '../core';

const api = '/api';

@Injectable()
export class VillainService {
  constructor(private http: HttpClient, private toastService: ToastService) {}

  getAll() {
    return this.http
      .get<Array<Villain>>(`${api}/villains`)
      .pipe(
        map(villains => villains),
        tap(() => this.toastService.openSnackBar('Villains retrieved successfully!', 'GET')),
        catchError(this.handleError)
      );
  }

  private handleError(res: HttpErrorResponse) {
    console.error(res.error);
    return Observable.throw(res.error || 'Server error');
  }

  delete(id: number) {
    return this.http
      .delete(`${api}/villain/${id}`)
      .pipe(tap(() => this.toastService.openSnackBar(`Villain ${id} deleted`, 'DELETE')));
  }

  add(villain: Villain) {
    return this.http
      .post<Villain>(`${api}/villain/`, villain)
      .pipe(tap(() => this.toastService.openSnackBar(`Villain ${villain.name} added`, 'POST')));
  }

  update(villain: Villain) {
    return this.http
      .put<Villain>(`${api}/villain/${villain.id}`, villain)
      .pipe(tap(() => this.toastService.openSnackBar(`Villain ${villain.name} updated`, 'PUT')));
  }
}
