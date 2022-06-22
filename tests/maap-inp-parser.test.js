const maapInpParser = require('../dist/maap-inp-parser');
const { readTestData } = require('./util');

// First objective is just to get all the files to parse.
// Checking the output objects will be added once all the examples parse succesfully.
describe('maapInpParser', () => {
  test('b1_0000', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('b1_0000.inp'),
    );
    expect(value).toBeDefined();
  });

  test('b2_0000', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('b2_0000.inp'),
    );
    expect(value).toBeDefined();
  });

  test('b3_0000', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('b3_0000.inp'),
    );
    expect(value).toBeDefined();
  });

  test('b4_0000', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('b4_0000.inp'),
    );
    expect(value).toBeDefined();
  });

  test('p1_0000', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('p1_0000.inp'),
    );
    expect(value).toBeDefined();
  });

  test('p2_0000', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('p2_0000.inp'),
    );
    expect(value).toBeDefined();
  });

  test('p3_0000', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('p3_0000.inp'),
    );
    expect(value).toBeDefined();
  });

  test('p4_0000', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('p4_0000.inp'),
    );
    expect(value).toBeDefined();
  });

  test('SG_TIMD', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('SG_TIMD.inp'),
    );
    expect(value).toBeDefined();
  });

  test('pzr1a.INP', async () => {
    const { value } = maapInpParser.parse(await readTestData('pzr1a.inp'));
    expect(value).toBeDefined();
  });

  test('CRA1AI', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('CRA1AI.inp'),
    );
    expect(value).toBeDefined();
  });
});
