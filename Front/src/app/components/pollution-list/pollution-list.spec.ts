import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollutionListComponent } from './pollution-list';

describe('PollutionList', () => {
  let component: PollutionListComponent;
  let fixture: ComponentFixture<PollutionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PollutionListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
