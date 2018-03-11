import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';

import { ToastService } from '../core';

const api = '/api';

/**
 * Base REST-like DataService in reactive style for entity of type T
 */
export abstract class ReactiveDataService<T extends { id: number | string }> {
  protected entityResource: string;
  protected collectionResource: string;

  // cached entities
  private entities: T[];
  private entitiesSubject = new BehaviorSubject<T[]>([]);

  /** Observable of cached entities */
  protected entities$ = this.entitiesSubject.asObservable();

  protected errorsSubject = new Subject<string>();

  /** Observable of error messages */
  errors$ = this.errorsSubject.asObservable();

  protected loadingSubject = new BehaviorSubject(false);

  /** Observable of flag indicating when the service is loading data from the server */
  loading$ = this.loadingSubject.asObservable();

  constructor(
    protected entityName: string,
    protected http: HttpClient,
    protected toastService: ToastService,
    protected entityNamePlural?: string
  ) {
    this.entityNamePlural = entityNamePlural || entityName + 's';
    this.entityResource = this.entityName.toLowerCase();
    this.collectionResource = this.entityNamePlural.toLowerCase();
  }

  getAll() {
    this.loadingSubject.next(true);
    this.http
      .get<T[]>(`${api}/${this.collectionResource}`)
      .subscribe(entities => {
        this.next(entities);
        this.loadingSubject.next(false);
        this.log(`${this.entityNamePlural} retrieved.`, 'GET');
      }, this.handleError('Retrieval', 'GET'));
  }

  delete(id: number | string) {
    // delete optimistically
    this.next(this.entities.filter(e => e.id !== id));

    this.http.delete(`${api}/${this.entityResource}/${id}`).subscribe(() => {
      this.log(`${this.entityName} with id=${id} deleted.`, 'DELETE');
    }, this.handleError('Delete', 'DELETE'));
  }

  add(entity: T) {
    this.http
      .post<T>(`${api}/${this.entityResource}/`, entity)
      .subscribe(addedEntity => {
        this.next(this.entities.concat(addedEntity));
        this.log(`${this.entityName} added.`, 'POST');
      }, this.handleError('Add', 'POST'));
  }

  update(entity: T) {
    const id = entity.id;
    this.http
      .put<T>(`${api}/${this.entityResource}/${id}`, entity)
      .subscribe(updatedEntity => {
        this.next(
          this.entities.map(e => (e.id === id ? updatedEntity || entity : e))
        );
        this.log(`${this.entityName} updated.`, 'PUT');
      }, this.handleError('Update', 'PUT'));
  }

  protected handleError(operation: string, method: string) {
    return function errorHandler(res: HttpErrorResponse) {
      console.error(res);
      const eMsg = res.message || '';
      const msg = `${this.entityNamePlural} ${operation} Error${
        eMsg ? ': ' + eMsg : ''
      }`;
      this.log(msg, method);
      this.errorsSubject.next(msg);
      this.loadingSubject.next(false);
    }.bind(this);
  }

  protected log(message: string, method: string) {
    this.toastService.openSnackBar(message, method);
  }

  /** Set the cached entities and emit on the entities$ observable */
  protected next(entities: T[]) {
    this.entities = entities;
    this.entitiesSubject.next(entities);
  }
}
