import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { entityConfig } from './entity-metadata';
import { EntityDataModule } from '@ngrx/data';
import { NgrxDataToastService } from './ngrx-data-toast.service';

import { VillainEffects } from './villains/villain-effects';

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    EffectsModule.forRoot([VillainEffects]),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
    EntityDataModule.forRoot(entityConfig)
  ]
})
export class AppStoreModule {
  constructor(toastService: NgrxDataToastService) {}
}
