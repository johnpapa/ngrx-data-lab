import { NgModule } from '@angular/core';
import { NgrxDataModule } from 'ngrx-data';
import { pluralNames, entityMetadata } from './entity-metadata';

@NgModule({
  imports: [
    NgrxDataModule.forRoot({
      entityMetadata: entityMetadata,
      pluralNames: pluralNames
    })
  ]
})
export class EntityStoreModule {}
