import { TestBed } from '@angular/core/testing';

import { GetFirebaseService } from './get-firebase.service';

describe('GetFirebaseService', () => {
  let service: GetFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
