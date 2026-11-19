import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PollutionService } from './pollution';
import { Pollution } from '../models/pollution.model';
import { environment } from '../../environments/environment';

describe('PollutionService', () => {
  let service: PollutionService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/pollutions`;

  const mockPollution: Pollution = {
    id: 1,
    titre: 'Déchets plastiques',
    type: 'Plastique',
    description: 'Bouteilles sur la berge',
    dateObservation: '2026-10-15',
    lieu: 'Strasbourg',
    latitude: 48.5734,
    longitude: 7.7521,
    photoUrl: null,
    dangerosite: 40
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(PollutionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all pollutions (GET)', () => {
    service.getPollutions().subscribe((pollutions) => {
      expect(pollutions.length).toBe(1);
      expect(pollutions[0]).toEqual(mockPollution);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockPollution]);
  });

  it('should fetch a pollution by id (GET /:id)', () => {
    service.getPollutionById(1).subscribe((pollution) => {
      expect(pollution).toEqual(mockPollution);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPollution);
  });

  it('should create a new pollution (POST)', () => {
    const { id: _, ...payload } = mockPollution;

    service.addPollution(payload).subscribe((created) => {
      expect(created).toEqual(mockPollution);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockPollution);
  });

  it('should update an existing pollution (PUT /:id)', () => {
    const { id: _, ...payload } = mockPollution;

    service.updatePollution(1, payload).subscribe((updated) => {
      expect(updated).toEqual(mockPollution);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mockPollution);
  });

  it('should delete a pollution (DELETE /:id)', () => {
    service.deletePollution(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
