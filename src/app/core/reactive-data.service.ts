/**
 * EntityState represents collection in cache.
 * Advanced RxJS techniques
 */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {
  concatMap,
  combineLatest,
  distinctUntilChanged,
  map,
  scan,
  shareReplay,
  take,
  tap
} from 'rxjs/operators';

import { ToastService } from '../core';

const api = '/api';

/** State of a cached entity type */
export interface EntityState<T> {
  loading: boolean;
  entities: T[];
  error: string;
}

/**
 * Base REST-like DataService in reactive style for entity of type T
 */
export abstract class ReactiveDataService<T extends { id: number | string }> {
  /** Name of the HTTP resource for an operation concerning a single entity */
  protected entityResource: string;

  /** Name of the HTTP resource for an operation concerning multiple entities of the collection */
  protected collectionResource: string;

  /** Source of entity state changes */
  private entitiesSubject = new Subject<Partial<EntityState<T>>>();

  /** Observable of the entire collection's cached state */
  entityState$ = this.entitiesSubject.pipe(
    // Update the state with a modified copy
    scan(
      (oldState, newState) => {
        // copy new state over a copy of the old state
        return { ...oldState, ...newState };
      },
      // Initial cache state
      {
        loading: false,
        entities: [],
        error: ''
      }
    ),
    // cached observable
    shareReplay(1)
  );

  // #region selectors

  /** Observable of cached entities */
  entities$ = this.entityState$.pipe(map(state => state.entities));

  /** Observable of flag indicating when the service is loading data from the server */
  loading$ = this.entityState$.pipe(
    map(state => state.loading),
    distinctUntilChanged()
  );

  /** Observable of error messages */
  errors$ = this.entityState$.pipe(
    map(state => state.error),
    distinctUntilChanged()
  );

  // #endregion selectors

  constructor(
    protected entityName: string,
    protected http: HttpClient,
    protected toastService: ToastService,
    protected entityNamePlural?: string
  ) {
    this.entityNamePlural = entityNamePlural || entityName + 's';
    this.entityResource = this.entityName.toLowerCase();
    this.collectionResource = this.entityNamePlural.toLowerCase();

    // Subscribe so the cache lasts the life of this service instance
    this.entityState$.subscribe();
  }

  /**
   * Get all entities of the type and load them into the entities$ observable.
   * Turns loading$ flag on and off
   */
  getAll() {
    this.updateState({ loading: true });

    this.http
      .get<T[]>(`${api}/${this.collectionResource}`)
      .subscribe(entities => {
        this.updateState({ entities, loading: false });
        this.log(`${this.entityNamePlural} retrieved.`, 'GET');
      }, this.handleError('Retrieval', 'GET'));
  }

  /**
   * Remove the entity with this id from the entities$ immediately,
   * then send delete request to the server.
   * @param id of the entity to delete
   */
  delete(id: number | string) {
    this.entities$
      .pipe(
        // delete optimistically
        take(1),
        tap(entities =>
          this.updateState({
            // new entities collection, minus the entity with the delete id
            entities: entities.filter(e => e.id !== id)
          })
        ),
        // then tell the server to delete
        concatMap(() => this.http.delete(`${api}/${this.entityResource}/${id}`))
      )
      .subscribe(
        () => this.log(`${this.entityName} with id=${id} deleted.`, 'DELETE'),
        this.handleError('Delete', 'DELETE')
      );
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
      .pipe(combineLatest(this.entities$), take(1))
      .subscribe(([addedEntity, entities]) => {
        this.updateState({
          // new entities collection, with added entity on the end
          entities: entities.concat(addedEntity)
        });
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
      .pipe(combineLatest(this.entities$), take(1))
      .subscribe(([updatedEntity, entities]) => {
        this.updateState({
          // new entities collection, copied from old, with updated entity replaced
          entities: entities.map(
            e => (e.id === entity.id ? updatedEntity || entity : e)
          )
        });
        this.log(`${this.entityName} updated.`, 'PUT');
      }, this.handleError('Update', 'PUT'));
  }

  // #region helpers

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
      const error = `${this.entityNamePlural} ${operation} Error${
        eMsg ? ': ' + eMsg : ''
      }`;
      this.log(error, method);
      this.updateState({ error, loading: false });
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

  /** Update the collection state; selectors update too */
  protected updateState(newState: Partial<EntityState<T>>) {
    this.entitiesSubject.next(newState);
  }

  // #endregion helpers
}
