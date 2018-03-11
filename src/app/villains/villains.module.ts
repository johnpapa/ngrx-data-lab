import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VillainsRoutingModule } from './villains-routing.module';
import { VillainDetailComponent } from './villain-detail/villain-detail.component';
import { VillainsComponent } from './villains/villains.component';
import { VillainListComponent } from './villain-list/villain-list.component';

import { VillainReactiveDetailComponent } from './villain-detail/villain-detail-reactive.component';
import { VillainReactiveListComponent } from './villain-list/villain-list-reactive.component';
import { VillainsReactiveComponent } from './villains/villains-reactive.component';
import { VillainReactiveService } from './villain-reactive.service';

import { VillainService } from './villain.service';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule, VillainsRoutingModule],
  exports: [VillainsComponent, VillainDetailComponent],
  declarations: [
    VillainsComponent, VillainsReactiveComponent,
    VillainDetailComponent, VillainReactiveDetailComponent,
    VillainListComponent, VillainReactiveListComponent
  ],
  providers: [VillainService, VillainReactiveService]
})
export class VillainsModule {}
