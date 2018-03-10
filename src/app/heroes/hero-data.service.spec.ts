import { TestBed, inject } from '@angular/core/testing';

import { HeroDataService } from './hero-data.service';

describe('HeroDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeroDataService]
    });
  });

  it('should be created', inject([HeroDataService], (service: HeroDataService) => {
    expect(service).toBeTruthy();
  }));
});
