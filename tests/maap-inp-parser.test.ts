const fs = require('fs/promises');
const path = require('path');
const peggy = require('peggy');
const { readTestData } = require('./util');

let maapInpParser;
beforeAll(async () => {
  maapInpParser = peggy.generate(
    (await fs.readFile(path.join('src', 'maapInpParser.pegjs'))).toString(),
    {
      output: 'parser',
    },
  );
});

describe('maapInpParser', () => {
  test('sensitivity statements', async () => {
    const program = maapInpParser.parse(
      await readTestData('sensitivity.INP'),
    ).value;
    expect(program[0]).toStrictEqual({
      type: 'sensitivity',
      value: 'ON'
    });
    expect(program[1]).toStrictEqual({
      type: 'sensitivity',
      value: 'OFF',
    });
    expect(program[2]).toStrictEqual({
      type: 'identifier',
      value: 'SENSITIVITY',
    });
  });
});
