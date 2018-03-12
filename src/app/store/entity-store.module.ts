import { NgModule } from '@angular/core';
import { DefaultDataServiceConfig, NgrxDataModule } from 'ngrx-data';
import { pluralNames, entityMetadata } from './entity-metadata';

const defaultDataServiceConfig: DefaultDataServiceConfig = {};

@NgModule({
  imports: [
    NgrxDataModule.forRoot({
      entityMetadata: entityMetadata,
      pluralNames: pluralNames
    })
  ],
  providers: [
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig }
  ]
})
export class EntityStoreModule {}
