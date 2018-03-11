import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Villain, ToastService, ReactiveDataService } from '../core';

@Injectable()
export class VillainReactiveService extends ReactiveDataService<Villain> {
  constructor(http: HttpClient, toastService: ToastService) {
    super('Villain', http, toastService);
  }

  villains$ = this.entities$;
}
