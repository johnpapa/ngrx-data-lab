import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VillainsComponent } from './villains/villains.component';
import { VillainsReactiveComponent } from './villains/villains-reactive.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: VillainsComponent },
  { path: 'reactive', pathMatch: 'full', component: VillainsReactiveComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VillainsRoutingModule {}
