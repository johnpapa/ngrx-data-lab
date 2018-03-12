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
  /** Name of the HTTP resource for an operation concerning a single entity */
  protected entityResource: string;
  /** Name of the HTTP resource for an operation concerning multiple entities of the collection */
  protected collectionResource: string;

  // cached entities
  private entities: T[];
  private entitiesSubject = new BehaviorSubject<T[]>([]);

  /** Observable of cached entities */
  public entities$ = this.entitiesSubject.asObservable();

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

  /**
   * Get all entities of the type and load them into the entities$ observable.
   * Turns loading$ flag on and off
   */
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

  /**
   * Remove the entity with this id from the entities$ immediately,
   * then send delete request to the server.
   * @param id of the entity to delete
   */
  delete(id: number | string) {
    // delete optimistically
    this.next(this.entities.filter(e => e.id !== id));

    this.http.delete(`${api}/${this.entityResource}/${id}`).subscribe(() => {
      this.log(`${this.entityName} with id=${id} deleted.`, 'DELETE');
    }, this.handleError('Delete', 'DELETE'));
  }

  /**
   * Send "add" request to the server.
   * When it succeeds, add to the end of the entities$
   * @param entity to Add, with or without `id`.
   * If no `id` value, server should generate the `id` value
   */
  add(entity: T) {
    this.http
      .post<T>(`${api}/${this.entityResource}/`, entity)
      .subscribe(addedEntity => {
        this.next(this.entities.concat(addedEntity));
        this.log(`${this.entityName} added.`, 'POST');
      }, this.handleError('Add', 'POST'));
  }

  /**
   * Send "update" request to the server.
   * When it succeeds, replace the corresponding entity in entities$
   * with the entity returned by the server (if it returns one) or
   * with the updateEntity sent to the server
   * @param entity
   */
  update(entity: T) {
    this.http
      .put<T>(`${api}/${this.entityResource}/${entity.id}`, entity)
      .subscribe(updatedEntity => {
        this.next(
          this.entities.map(
            e => (e.id === entity.id ? updatedEntity || entity : e)
          )
        );
        this.log(`${this.entityName} updated.`, 'PUT');
      }, this.handleError('Update', 'PUT'));
  }

  /**
   * Prepare an error handler for failed HTTP requests.
   * That handler extracts the error message and logs it.
   * It also adds the message to the errors$ observable to which the caller
   * may listen and react.
   * @param operation The name/description of the operation that failed
   * @param method The HTTP method for the failed HTTP request
   */
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

  /**
   * Log a message. This implementation calls the ToastService
   * @param message The message to display
   * @param method The method/operation that was involved
   */
  protected log(message: string, method: string) {
    this.toastService.openSnackBar(message, method);
  }

  /** Set the cached entities and emit on the entities$ observable */
  protected next(entities: T[]) {
    this.entities = entities;
    this.entitiesSubject.next(entities);
  }
}
