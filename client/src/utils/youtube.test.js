import { youTubeId } from './youtube';

describe('youTubeId', () => {
  test('parses watch URLs', () => {
    expect(youTubeId('https://www.youtube.com/watch?v=YoHD9XEInc0')).toBe('YoHD9XEInc0');
  });
  test('parses youtu.be short URLs', () => {
    expect(youTubeId('https://youtu.be/EXeTwQWrcwY')).toBe('EXeTwQWrcwY');
  });
  test('parses embed URLs', () => {
    expect(youTubeId('https://www.youtube.com/embed/zSWdZVtXT7E')).toBe('zSWdZVtXT7E');
  });
  test('returns null for non-YouTube input', () => {
    expect(youTubeId('https://example.com/video')).toBeNull();
    expect(youTubeId('')).toBeNull();
    expect(youTubeId(undefined)).toBeNull();
  });
});
