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
  // Turn safe mode off to make sure tests fail when expected
  maapInpParser.options.safeMode = false;
});

describe('statements', () => {
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
  test('title statements', async () => {
    const program = maapInpParser.parse(await readTestData('title.INP')).output
      .value;
    expect(program[0]).toStrictEqual({
      type: 'title',
      value: 'Valid Title',
    });
    expect(program[1]).toStrictEqual({
      type: 'title',
      value: `A title that
extends onto
multiple lines`,
    });
    expect(program[2]).toStrictEqual({
      type: 'title',
      value: null,
    });
  });
  test('parameter file statements', async () => {
    const program = maapInpParser.parse(await readTestData('parameterFile.INP'))
      .output.value;
    expect(program[0]).toStrictEqual({
      type: 'parameter_file',
      value: 'parameter_file.PAR',
    });
    expect(program[1]).toStrictEqual({
      type: 'parameter_file',
      value: '1',
    });
    expect(program[2]).toStrictEqual({
      type: 'identifier',
      value: 'PARAMETER FILE',
    });
  });
  test('include statements', async () => {
    const program = maapInpParser.parse(await readTestData('include.INP'))
      .output.value;
    expect(program[0]).toStrictEqual({
      type: 'include',
      value: 'file.inc',
    });
    expect(program[1]).toStrictEqual({
      type: 'include',
      value: '1234',
    });
    expect(program[2]).toStrictEqual({
      type: 'identifier',
      value: 'INCLUDE',
    });
  });
  test('parameter change statements', async () => {
    const program = maapInpParser.parse(
      await readTestData('parameterChange.INP'),
    ).output.value;
    expect(program[0]).toStrictEqual({
      type: 'parameter_change',
      value: [
        {
          target: {
            type: 'call_expression',
            value: {
              arguments: [
                {
                  type: 'number',
                  units: undefined,
                  value: 1,
                },
              ],
              name: {
                type: 'identifier',
                value: 'VarName',
              },
            },
          },
          type: 'assignment',
          value: {
            type: 'number',
            units: undefined,
            value: 1,
          },
        },
      ],
    });
    expect(program[1]).toStrictEqual({
      type: 'parameter_change',
      value: [],
    });
    expect(program[2]).toStrictEqual({
      type: 'parameter_change',
      value: [
        {
          test: {
            type: 'is_expression',
            value: {
              target: {
                type: 'call_expression',
                value: {
                  arguments: [
                    {
                      type: 'number',
                      units: undefined,
                      value: 1,
                    },
                  ],
                  name: {
                    type: 'identifier',
                    value: 'VarName',
                  },
                },
              },
              value: {
                type: 'number',
                units: undefined,
                value: 1,
              },
            },
          },
          type: 'if',
          value: [
            {
              type: 'set_timer',
              value: {
                type: 'timer',
                value: 1,
              },
            },
          ],
        },
      ],
    });
  });
});

describe('program blocks', () => {
  test('source elements', async () => {
    const program = maapInpParser.parse(
      await readTestData('sourceElements.INP'),
    ).output.value;
    expect(program[0]).toStrictEqual({
      type: 'sensitivity',
      value: 'ON',
    });
    expect(program[1]).toStrictEqual({
      target: {
        type: 'identifier',
        value: 'Identifier',
      },
      type: 'assignment',
      value: {
        type: 'number',
        units: 'HR',
        value: 1,
      },
    });
    expect(program[2]).toStrictEqual({
      type: 'call_expression',
      value: {
        arguments: null,
        name: {
          type: 'identifier',
          value: 'Function',
        },
      },
    });
    expect(program[3]).toStrictEqual({
      target: {
        type: 'identifier',
        value: 'Identifier',
      },
      type: 'as_expression',
      value: {
        type: 'identifier',
        value: 'Value',
      },
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
