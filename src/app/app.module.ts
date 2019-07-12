import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CoreModule } from './core';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'heroes' },
  {
    path: 'heroes',
    loadChildren: () =>
      import('app/heroes/heroes.module').then(m => m.HeroesModule)
  },
  {
    path: 'villains',
    loadChildren: () =>
      import('app/villains/villains.module').then(m => m.VillainsModule)
  }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
