import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PollutionListComponent } from './pollution-list';
import { PollutionService } from '../../services/pollution';
import { Pollution } from '../../models/pollution.model';

describe('PollutionListComponent', () => {
  let component: PollutionListComponent;
  let fixture: ComponentFixture<PollutionListComponent>;

  const mockPollutions: Pollution[] = [
    {
      id: 1,
      titre: 'Bouteilles plastiques',
      type: 'Plastique',
      description: 'Déchets sur la plage',
      dateObservation: '2026-03-30',
      lieu: 'Marseille',
      latitude: 43.2965,
      longitude: 5.3698,
      photoUrl: null,
      dangerosite: 30
    },
    {
      id: 2,
      titre: 'Rejet chimique',
      type: 'Chimique',
      description: 'Liquide suspect',
      dateObservation: '2026-10-21',
      lieu: 'Strasbourg',
      latitude: 48.5734,
      longitude: 7.7521,
      photoUrl: null,
      dangerosite: 85
    }
  ];

  let pollutionServiceMock: {
    getPollutions: ReturnType<typeof vi.fn>;
    deletePollution: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    pollutionServiceMock = {
      getPollutions: vi.fn().mockReturnValue(of(mockPollutions)),
      deletePollution: vi.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      imports: [PollutionListComponent],
      providers: [
        provideRouter([]),
        { provide: PollutionService, useValue: pollutionServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PollutionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and load pollutions on init', () => {
    expect(component).toBeTruthy();
    expect(pollutionServiceMock.getPollutions).toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
    expect(component.filteredPollutions().length).toBe(2);
  });

  it('should filter pollutions by searchTerm and selectedType', () => {
    component.searchTerm.set('strasbourg');
    expect(component.filteredPollutions().length).toBe(1);
    expect(component.filteredPollutions()[0].titre).toBe('Rejet chimique');

    component.searchTerm.set('');
    component.selectedType.set('Plastique');
    expect(component.filteredPollutions().length).toBe(1);
    expect(component.filteredPollutions()[0].lieu).toBe('Marseille');
  });

  it('should remove pollution from list when deletion is confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.onDelete(1);

    expect(pollutionServiceMock.deletePollution).toHaveBeenCalledWith(1);
    expect(component.filteredPollutions().length).toBe(1);
    expect(component.filteredPollutions()[0].id).toBe(2);
  });

  it('should set errorMessage when loading fails', () => {
    pollutionServiceMock.getPollutions.mockReturnValue(
      throwError(() => new Error('Network error'))
    );

    const errorFixture = TestBed.createComponent(PollutionListComponent);
    const errorComp = errorFixture.componentInstance;
    errorFixture.detectChanges();

    expect(errorComp.isLoading()).toBe(false);
    expect(errorComp.errorMessage()).toBe('Impossible de charger les données de pollution.');
  });
});
