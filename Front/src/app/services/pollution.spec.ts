import { TestBed } from '@angular/core/testing';
import { Pollution } from './pollution';

describe('Pollution', () => {
  let service: Pollution;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pollution);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
