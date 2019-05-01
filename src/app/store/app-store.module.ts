import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgrxDataModule } from 'ngrx-data';
import { environment } from '../../environments/environment';
import { entityConfig } from './entity-metadata';
import { NgrxDataToastService } from '../ngrx-data-toast.service';

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
    NgrxDataModule.forRoot(entityConfig)
  ]
})
export class AppStoreModule {
  constructor(toastService: NgrxDataToastService) {}
}
