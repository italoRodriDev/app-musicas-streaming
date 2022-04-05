import { TestBed } from '@angular/core/testing';

import { SetFirebaseService } from './set-firebase.service';

describe('SetFirebaseService', () => {
  let service: SetFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
