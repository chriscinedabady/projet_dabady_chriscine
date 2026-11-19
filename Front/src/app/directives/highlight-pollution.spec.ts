import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HighlightPollution } from './highlight-pollution';

@Component({
  imports: [HighlightPollution],
  template: '<div [appHighlightPollution]="level()"></div>'
})
class TestHostComponent {
  level = signal<number | string>(10);
}

describe('HighlightPollution', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
  });

  it('should apply green background for low pollution (<= 20)', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(div.style.backgroundColor).toBe('rgb(212, 237, 218)'); // #d4edda
  });

  it('should update background color reactively when input changes', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const host = fixture.componentInstance;
    const div = fixture.nativeElement.querySelector('div') as HTMLElement;

    host.level.set(45);
    fixture.detectChanges();
    expect(div.style.backgroundColor).toBe('rgb(255, 243, 205)'); // #fff3cd (Modérée)

    host.level.set(75);
    fixture.detectChanges();
    expect(div.style.backgroundColor).toBe('rgb(255, 229, 208)'); // #ffe5d0 (Élevée)

    host.level.set(90);
    fixture.detectChanges();
    expect(div.style.backgroundColor).toBe('rgb(248, 215, 218)'); // #f8d7da (Dangereuse)
  });

  it('should also accept textual level names', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const host = fixture.componentInstance;
    const div = fixture.nativeElement.querySelector('div') as HTMLElement;

    host.level.set('Dangereuse');
    fixture.detectChanges();
    expect(div.style.backgroundColor).toBe('rgb(248, 215, 218)');
  });
});
