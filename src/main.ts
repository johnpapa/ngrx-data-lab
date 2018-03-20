import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AppDevModule } from './app/app-dev.module';

import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  // .bootstrapModule(AppModule)
  .bootstrapModule(AppDevModule)
  .catch(err => console.log(err));
