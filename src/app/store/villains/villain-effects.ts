// Custom API Actions
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EntityActionFactory, EntityOp } from '@ngrx/data';

import { EMPTY } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { setSuperVillain, SetSuperVillainProps } from './villain-actions';

const setSuperVillainUrl = '/api/set-super-villain';

@Injectable()
/**
 * Handle SetSuperVillain action pessimistically by calling corresponding update API
 * and updating villain in store if API call succeeds.
 */
export class VillainEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  /**
   * Call set-is-super Villain API on the server and then update villain in cache.
   */
  setSuperVillain$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setSuperVillain),
      concatMap(props => this.setSuperVillainImpl(props))
    )
  );

  /**
   * Call setSuperVillain API
   * @param props setSuperVillain action properties
   * @returns Observable of EntityAction
   */
  private setSuperVillainImpl(props: SetSuperVillainProps) {
    const { id, isSuper, correlationId, tag = 'SetSuperVillain' } = props;
    return this.http.post(setSuperVillainUrl, { id, isSuper }).pipe(
      // Action didn't update cache before this call (pessimistic)
      // so return EntityAction that updates villain in cache.
      map(() =>
        new EntityActionFactory().create(
          'Villain',
          EntityOp.SAVE_UPDATE_ONE_SUCCESS,
          { id, changes: { id, isSuper } },
          { correlationId, tag, isOptimistic: false }
        )
      ),
      catchError(() => EMPTY) // API call failed; do nothing silently
    );
  }
}
