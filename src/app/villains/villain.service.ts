import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory
} from '@ngrx/data';

import { setSuperVillain } from '../store/villains/villain-actions';
import { Villain } from '../core';

@Injectable({ providedIn: 'root' })
export class VillainService extends EntityCollectionServiceBase<Villain> {
  constructor(factory: EntityCollectionServiceElementsFactory) {
    super('Villain', factory);
  }

  /** Dispatch to effect that sets the villain's isSuper property. */
  setIsSuper(id: number, isSuper: boolean) {
    this.dispatch(setSuperVillain({ id, isSuper }));
  }
}
