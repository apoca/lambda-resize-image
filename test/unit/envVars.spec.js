import checker from '../utils/envVarChecker';

describe('Utility library envVarsChecker', () => {
  test('The helper exists', () => {
    expect(checker).toBeTruthy();
  });

  test('Asks for both BUCKET and URL environment variables', () => {
    const input = {};
    const result = checker(input);
    expect(result).toEqual(['BUCKET', 'URL']);
  });

  test('Asks for a missing BUCKET environment variables', () => {
    const input = {
      URL: 'https://localhost:3000',
    };
    const result = checker(input);
    expect(result).toEqual(['BUCKET']);
  });

  test('Asks for a missing URL environment variables', () => {
    const input = {
      BUCKET: 'my-bucket-here',
    };
    const result = checker(input);
    expect(result).toEqual(['URL']);
  });
});
