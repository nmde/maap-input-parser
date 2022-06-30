import fs from 'fs/promises';
import path from 'path';
import peggy from 'peggy';
import * as t from '../src/types';
import wrapper from '../src/wrapper';
import { readTestData } from './util';

let maapInpParser: t.MAAPInpParser;
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

describe('expressions', () => {
  test('is expression', async () => {
    const program = maapInpParser.parse(await readTestData('is.INP')).output
      .value;
    expect(program[0]).toStrictEqual({
      target: {
        type: 'identifier',
        value: 'VARNAME',
      },
      type: 'is_expression',
      value: {
        type: 'identifier',
        value: 'Value',
      },
    });
    expect(program[1]).toStrictEqual({
      target: {
        type: 'identifier',
        value: 'START TIME',
      },
      type: 'is_expression',
      value: {
        type: 'number',
        units: undefined,
        value: 0,
      },
    });
    expect(program[2]).toStrictEqual({
      target: {
        type: 'identifier',
        value: 'END TIME',
      },
      type: 'is_expression',
      value: {
        type: 'number',
        units: undefined,
        value: 144000,
      },
    });
    expect(program[3]).toStrictEqual({
      target: {
        type: 'identifier',
        value: 'PRINT INTERVAL',
      },
      type: 'is_expression',
      value: {
        type: 'number',
        units: undefined,
        value: 5000,
      },
    });
  });
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
      fileType: 'PARAMETER FILE',
      type: 'file',
      value: 'parameter_file.PAR',
    });
    expect(program[1]).toStrictEqual({
      fileType: 'PARAMETER FILE',
      type: 'file',
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
      fileType: 'INCLUDE',
      type: 'file',
      value: 'file.inc',
    });
    expect(program[1]).toStrictEqual({
      fileType: 'INCLUDE',
      type: 'file',
      value: '1234',
    });
    expect(program[2]).toStrictEqual({
      type: 'identifier',
      value: 'INCLUDE',
    });
  });
  test('block statements', async () => {
    const program = maapInpParser.parse(await readTestData('block.INP')).output
      .value;
    expect(program[0]).toStrictEqual({
      blockType: 'PARAMETER CHANGE',
      type: 'block',
      value: [
        {
          target: {
            arguments: [
              {
                type: 'number',
                units: undefined,
                value: 1,
              },
            ],
            type: 'call_expression',
            value: {
              type: 'identifier',
              value: 'VarName',
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
      blockType: 'PARAMETER CHANGE',
      type: 'block',
      value: [],
    });
    expect(program[2]).toStrictEqual({
      blockType: 'PARAMETER CHANGE',
      type: 'block',
      value: [
        {
          blockType: 'IF',
          test: {
            target: {
              arguments: [
                {
                  type: 'number',
                  units: undefined,
                  value: 1,
                },
              ],
              type: 'call_expression',
              value: {
                type: 'identifier',
                value: 'VarName',
              },
            },
            type: 'is_expression',
            value: {
              type: 'number',
              units: undefined,
              value: 1,
            },
          },
          type: 'conditional_block',
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
    expect(program[3]).toStrictEqual({
      blockType: 'INITIATORS',
      type: 'block',
      value: [
        {
          target: {
            arguments: [
              {
                type: 'number',
                units: undefined,
                value: 1,
              },
            ],
            type: 'call_expression',
            value: {
              type: 'identifier',
              value: 'VarName',
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
    expect(program[4]).toStrictEqual({
      blockType: 'INITIATORS',
      type: 'block',
      value: [],
    });
    expect(program[5]).toStrictEqual({
      blockType: 'INITIATORS',
      type: 'block',
      value: [
        {
          blockType: 'IF',
          test: {
            target: {
              arguments: [
                {
                  type: 'number',
                  units: undefined,
                  value: 1,
                },
              ],
              type: 'call_expression',
              value: {
                type: 'identifier',
                value: 'VarName',
              },
            },
            type: 'is_expression',
            value: {
              type: 'number',
              units: undefined,
              value: 1,
            },
          },
          type: 'conditional_block',
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
  test('conditional block statements', async () => {
    const program = maapInpParser.parse(
      await readTestData('conditionalBlock.INP'),
    ).output.value;
    expect(program[0]).toStrictEqual({
      blockType: 'WHEN',
      test: {
        target: {
          type: 'identifier',
          value: 'VARIABLE',
        },
        type: 'is_expression',
        value: {
          type: 'boolean',
          value: true,
        },
      },
      type: 'conditional_block',
      value: [
        {
          target: {
            type: 'identifier',
            value: 'VARNAME',
          },
          type: 'assignment',
          value: {
            type: 'number',
            units: undefined,
            value: 1000,
          },
        },
      ],
    });
    expect(program[1]).toStrictEqual({
      blockType: 'WHEN',
      test: {
        target: {
          type: 'identifier',
          value: 'VARIABLE',
        },
        type: 'is_expression',
        value: {
          type: 'boolean',
          value: true,
        },
      },
      type: 'conditional_block',
      value: [],
    });
    expect(program[2]).toStrictEqual({
      blockType: 'IF',
      test: {
        target: {
          type: 'identifier',
          value: 'VARIABLE',
        },
        type: 'is_expression',
        value: {
          type: 'boolean',
          value: true,
        },
      },
      type: 'conditional_block',
      value: [
        {
          target: {
            type: 'identifier',
            value: 'VARNAME',
          },
          type: 'assignment',
          value: {
            type: 'number',
            units: undefined,
            value: 1000,
          },
        },
      ],
    });
    expect(program[3]).toStrictEqual({
      blockType: 'IF',
      test: {
        target: {
          type: 'identifier',
          value: 'VARIABLE',
        },
        type: 'is_expression',
        value: {
          type: 'boolean',
          value: true,
        },
      },
      type: 'conditional_block',
      value: [],
    });
  });
  test('alias statements', async () => {
    const program = maapInpParser.parse(await readTestData('alias.INP')).output
      .value;
    expect(program[0]).toStrictEqual({
      type: 'alias',
      value: [
        {
          target: {
            type: 'identifier',
            value: 'VARNAME',
          },
          type: 'as_expression',
          value: {
            type: 'identifier',
            value: 'Value',
          },
        },
      ],
    });
    expect(program[1]).toStrictEqual({
      type: 'alias',
      value: [],
    });
  });
  test('plotfil statements', async () => {
    const program = maapInpParser.parse(await readTestData('plotfil.INP'))
      .output.value;
    expect(program[0]).toStrictEqual({
      n: 3,
      type: 'plotfil',
      value: [
        [
          {
            type: 'identifier',
            value: 'A',
          },
          {
            type: 'identifier',
            value: 'B',
          },
          {
            type: 'identifier',
            value: 'C',
          },
        ],
        [
          {
            type: 'identifier',
            value: 'D',
          },
          {
            type: 'identifier',
            value: 'E',
          },
          {
            type: 'boolean',
            value: false,
          },
        ],
        [
          {
            type: 'identifier',
            value: 'G',
          },
          {
            type: 'identifier',
            value: 'H',
          },
          {
            arguments: [
              {
                type: 'identifier',
                value: 'J',
              },
            ],
            type: 'call_expression',
            value: {
              type: 'identifier',
              value: 'I',
            },
          },
        ],
      ],
    });
  });
  test('userevt statements', async () => {
    const program = maapInpParser.parse(await readTestData('userevt.INP'))
      .output.value;
    expect(program[0].type).toBe('user_evt');
    const userEvt = program[0] as t.UserEvtStatement;
    expect(userEvt.value[0]).toStrictEqual({
      flag: {
        type: 'boolean',
        value: true,
      },
      index: 100,
      type: 'parameter',
      value: 'Parameter Name',
    });
    expect(userEvt.value[1]).toStrictEqual({
      flag: [],
      index: 102,
      type: 'parameter',
      value: 'Parameter 2',
    });
    expect(userEvt.value[2]).toStrictEqual({
      index: 1,
      type: 'action',
      value: [
        {
          flag: [],
          index: 103,
          type: 'parameter',
          value: 'Parameter 3',
        },
        {
          index: 2,
          type: 'action',
          value: [],
        },
      ],
    });
    expect(userEvt.value[3]).toStrictEqual({
      blockType: 'IF',
      test: {
        target: {
          type: 'identifier',
          value: 'VALUE',
        },
        type: 'is_expression',
        value: {
          type: 'boolean',
          value: true,
        },
      },
      type: 'conditional_block',
      value: [],
    });
  });
  test('function statements', async () => {
    const program = maapInpParser.parse(await readTestData('function.INP'))
      .output.value;
    expect(program[0]).toStrictEqual({
      name: {
        type: 'identifier',
        value: 'name',
      },
      type: 'function',
      value: {
        type: 'expression',
        value: {
          left: {
            type: 'number',
            units: undefined,
            value: 1,
          },
          op: '+',
          right: {
            type: 'number',
            units: undefined,
            value: 1,
          },
        },
      },
    });
  });
  test('set timer statements', async () => {
    const program = maapInpParser.parse(await readTestData('timer.INP')).output
      .value;
    expect(program[0]).toStrictEqual({
      type: 'set_timer',
      value: {
        type: 'timer',
        value: 1,
      },
    });
  });
  test('lookup variable statements', async () => {
    const program = maapInpParser.parse(await readTestData('lookup.INP')).output
      .value;
    expect(program[0]).toStrictEqual({
      name: {
        type: 'identifier',
        value: 'VariableName',
      },
      type: 'lookup_variable',
      value: [
        'You can type anything in here for now',
        'It just gets separated by row',
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
      arguments: [],
      type: 'call_expression',
      value: {
        type: 'identifier',
        value: 'Function',
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
      blockType: 'INITIATORS',
      type: 'block',
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
