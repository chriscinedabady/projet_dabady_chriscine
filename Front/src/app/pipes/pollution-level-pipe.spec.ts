import { PollutionLevelPipe } from './pollution-level-pipe';

describe('PollutionLevelPipe', () => {
  let pipe: PollutionLevelPipe;

  beforeEach(() => {
    pipe = new PollutionLevelPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "Faible" for values between 0 and 20', () => {
    expect(pipe.transform(0)).toBe('Faible');
    expect(pipe.transform(10)).toBe('Faible');
    expect(pipe.transform(20)).toBe('Faible');
  });

  it('should return "Modérée" for values between 21 and 50', () => {
    expect(pipe.transform(21)).toBe('Modérée');
    expect(pipe.transform(35)).toBe('Modérée');
    expect(pipe.transform(50)).toBe('Modérée');
  });

  it('should return "Élevée" for values between 51 and 80', () => {
    expect(pipe.transform(51)).toBe('Élevée');
    expect(pipe.transform(70)).toBe('Élevée');
    expect(pipe.transform(80)).toBe('Élevée');
  });

  it('should return "Dangereuse" for values above 80', () => {
    expect(pipe.transform(81)).toBe('Dangereuse');
    expect(pipe.transform(95)).toBe('Dangereuse');
    expect(pipe.transform(100)).toBe('Dangereuse');
  });
});
