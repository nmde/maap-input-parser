import fs from 'fs/promises';
import path from 'path';
import peggy from 'peggy';
import { MAAPInpParser } from '../src/types';
import wrapper from '../src/wrapper';
import { readTestData } from './util';

let maapInpParser: MAAPInpParser;
beforeAll(async () => {
  maapInpParser = wrapper(
    peggy.generate(
      (await fs.readFile(path.join('src', 'maapInpParser.pegjs'))).toString(),
      {
        output: 'parser',
      },
    ),
  );
});

describe('maapInpParser', () => {
  test('sensitivity statements', async () => {
    const program = maapInpParser.parse(await readTestData('sensitivity.INP'))
      .output.value;
    expect(program[0]).toStrictEqual({
      type: 'sensitivity',
      value: 'ON',
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

describe('safeMode', () => {
  test('safe mode parser', async () => {
    const safeMode = await readTestData('safeMode.INP');
    // Safe mode off
    expect(() => {
      maapInpParser.parse(safeMode, {
        safeMode: false,
      });
    }).toThrow();
    // Safe mode on
    const safeParsed = maapInpParser.parse(safeMode, {
      safeMode: true,
    });
    expect(safeParsed.errors.length).toBe(2);
    expect(safeParsed.output.value[0]).toStrictEqual({
      type: 'initiators',
      value: [
        {
          type: 'identifier',
          value: 'A VALID INITIATOR',
        },
        {
          type: 'identifier',
          value: 'ANOTHER VALID INITIATOR',
        },
      ],
    });
    expect(safeParsed.output.value[1]).toStrictEqual({
      type: 'identifier',
      value: 'PLOTFIL',
    });
  });
});
