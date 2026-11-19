import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PollutionDetailComponent } from './pollution-detail';
import { PollutionService } from '../../services/pollution';
import { Pollution } from '../../models/pollution.model';

describe('PollutionDetailComponent', () => {
  let component: PollutionDetailComponent;
  let fixture: ComponentFixture<PollutionDetailComponent>;

  const mockPollution: Pollution = {
    id: 1,
    titre: 'Déchet chimique',
    type: 'Chimique',
    description: 'Pollution observée près du canal.',
    dateObservation: '2026-10-21',
    lieu: 'Strasbourg',
    latitude: 48.5734,
    longitude: 7.7521,
    photoUrl: null,
    dangerosite: 85
  };

  let pollutionServiceMock: {
    getPollutionById: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    pollutionServiceMock = {
      getPollutionById: vi.fn().mockReturnValue(of(mockPollution))
    };

    await TestBed.configureTestingModule({
      imports: [PollutionDetailComponent],
      providers: [
        provideRouter([]),
        { provide: PollutionService, useValue: pollutionServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PollutionDetailComponent);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create and convert string id input to number', () => {
    expect(component).toBeTruthy();
    expect(component.id()).toBe(1);
    expect(pollutionServiceMock.getPollutionById).toHaveBeenCalledWith(1);
  });

  it('should display pollution details and danger level in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Déchet chimique');
    expect(compiled.textContent).toContain('Strasbourg');
    expect(compiled.textContent).toContain('85 / 100 (Dangereuse)');
  });
});
