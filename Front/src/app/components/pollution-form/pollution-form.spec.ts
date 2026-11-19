import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { datePasseeOuAujourdhui, httpUrlValidator, PollutionForm } from './pollution-form';
import { PollutionService } from '../../services/pollution';
import { Pollution } from '../../models/pollution.model';

describe('PollutionForm', () => {
  let component: PollutionForm;
  let fixture: ComponentFixture<PollutionForm>;
  let router: Router;

  const mockPollution: Pollution = {
    id: 5,
    titre: 'Dépôt sauvage forêt',
    type: 'Dépôt sauvage',
    description: 'Pneus abandonnés',
    dateObservation: '2026-10-10',
    lieu: 'Bordeaux',
    latitude: 44.8378,
    longitude: -0.5792,
    photoUrl: 'https://example.com/photo.jpg',
    dangerosite: 60
  };

  let pollutionServiceMock: {
    getPollutionById: ReturnType<typeof vi.fn>;
    addPollution: ReturnType<typeof vi.fn>;
    updatePollution: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    pollutionServiceMock = {
      getPollutionById: vi.fn().mockReturnValue(of(mockPollution)),
      addPollution: vi.fn().mockReturnValue(of(mockPollution)),
      updatePollution: vi.fn().mockReturnValue(of(mockPollution))
    };

    await TestBed.configureTestingModule({
      imports: [PollutionForm],
      providers: [
        provideRouter([]),
        { provide: PollutionService, useValue: pollutionServiceMock }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(PollutionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create in creation mode by default', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode()).toBe(false);
    expect(component.pollutionForm.valid).toBe(false);
  });

  it('should validate future dates with datePasseeOuAujourdhui', () => {
    const futureControl = new FormControl('2099-12-31');
    const pastControl = new FormControl('2025-01-01');

    expect(datePasseeOuAujourdhui(futureControl)).toEqual({ dateFutur: true });
    expect(datePasseeOuAujourdhui(pastControl)).toBeNull();
  });

  it('should validate URLs with httpUrlValidator', () => {
    expect(httpUrlValidator(new FormControl(''))).toBeNull();
    expect(httpUrlValidator(new FormControl('https://example.com/img.png'))).toBeNull();
    expect(httpUrlValidator(new FormControl('ftp://example.com/img.png'))).toEqual({ invalidUrl: true });
    expect(httpUrlValidator(new FormControl('not-a-url'))).toEqual({ invalidUrl: true });
  });

  it('should call addPollution and navigate on valid submit in creation mode', () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    const navSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.pollutionForm.setValue({
      titre: 'Dépôt sauvage forêt',
      type: 'Dépôt sauvage',
      description: 'Pneus abandonnés',
      dateObservation: '2026-10-10',
      lieu: 'Bordeaux',
      latitude: 44.8378,
      longitude: -0.5792,
      photoUrl: 'https://example.com/photo.jpg',
      dangerosite: 60
    });

    component.onSubmit();

    expect(pollutionServiceMock.addPollution).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/pollutions']);
  });

  it('should load existing pollution and call updatePollution in edit mode', async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    const navSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentRef.setInput('id', '5');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.isEditMode()).toBe(true);
    expect(pollutionServiceMock.getPollutionById).toHaveBeenCalledWith(5);
    expect(component.pollutionForm.getRawValue().titre).toBe('Dépôt sauvage forêt');

    component.onSubmit();

    expect(pollutionServiceMock.updatePollution).toHaveBeenCalledWith(
      5,
      expect.objectContaining({ titre: 'Dépôt sauvage forêt', dangerosite: 60 })
    );
    expect(navSpy).toHaveBeenCalledWith(['/pollutions']);
  });
});
