import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollutionDetailComponent } from './pollution-detail';

describe('PollutionDetail', () => {
  let component: PollutionDetailComponent;
  let fixture: ComponentFixture<PollutionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PollutionDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
