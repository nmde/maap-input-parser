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
  test('call expression', async () => {
    const program = maapInpParser.parse(await readTestData('call.INP')).output;
    expect(program.value[0]).toStrictEqual({
      arguments: [],
      type: 'call_expression',
      value: {
        type: 'identifier',
        value: 'Name',
      },
    });
    expect(program.value[1]).toStrictEqual({
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
        value: 'Name',
      },
    });
    expect(program.value[2]).toStrictEqual({
      arguments: [
        {
          type: 'number',
          units: undefined,
          value: 1,
        },
        {
          type: 'number',
          units: undefined,
          value: 2,
        },
        {
          type: 'number',
          units: undefined,
          value: 3,
        },
      ],
      type: 'call_expression',
      value: {
        type: 'identifier',
        value: 'Name',
      },
    });
    expect(program.value[3]).toStrictEqual({
      arguments: [
        {
          arguments: [
            {
              arguments: [
                {
                  arguments: [],
                  type: 'call_expression',
                  value: {
                    type: 'identifier',
                    value: 'Function',
                  },
                },
              ],
              type: 'call_expression',
              value: {
                type: 'identifier',
                value: 'A',
              },
            },
          ],
          type: 'call_expression',
          value: {
            type: 'identifier',
            value: 'Of',
          },
        },
      ],
      type: 'call_expression',
      value: {
        type: 'identifier',
        value: 'Name',
      },
    });
    expect(maapInpParser.toString(program)).toBe('Name()\nName(1)\nName(1,2,3)\nName(Of(A(Function())))');
  });
  test('is expression', async () => {
    const program = maapInpParser.parse(await readTestData('is.INP')).output;
    expect(program.value[0]).toStrictEqual({
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
    expect(program.value[1]).toStrictEqual({
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
    expect(program.value[2]).toStrictEqual({
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
    expect(program.value[3]).toStrictEqual({
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
    expect(maapInpParser.toString(program)).toBe('VARNAME IS Value\nSTART TIME IS 0\nEND TIME IS 144000\nPRINT INTERVAL IS 5000');
  });
});

describe('statements', () => {
  test('sensitivity statements', async () => {
    const program = maapInpParser.parse(await readTestData('sensitivity.INP'))
      .output;
    expect(program.value[0]).toStrictEqual({
      type: 'sensitivity',
      value: 'ON',
    });
    expect(program.value[1]).toStrictEqual({
      type: 'sensitivity',
      value: 'OFF',
    });
    expect(program.value[2]).toStrictEqual({
      type: 'identifier',
      value: 'SENSITIVITY',
    });
    expect(maapInpParser.toString(program)).toBe('SENSITIVITY ON\nSENSITIVITY OFF\nSENSITIVITY');
  });
  test('title statements', async () => {
    const program = maapInpParser.parse(await readTestData('title.INP')).output;
    expect(program.value[0]).toStrictEqual({
      type: 'title',
      value: 'Valid Title',
    });
    expect(program.value[1]).toStrictEqual({
      type: 'title',
      value: `A title that
extends onto
multiple lines`,
    });
    expect(program.value[2]).toStrictEqual({
      type: 'title',
      value: null,
    });
    expect(maapInpParser.toString(program)).toBe('TITLE\nValid Title\nEND\nTITLE\nA title that\nextends onto\nmultiple lines\nEND\nTITLE\n\nEND');
  });
  test('parameter file statements', async () => {
    const program = maapInpParser.parse(await readTestData('file.INP'))
      .output;
    expect(program.value[0]).toStrictEqual({
      fileType: 'PARAMETER FILE',
      type: 'file',
      value: 'parameter_file.PAR',
    });
    expect(program.value[1]).toStrictEqual({
      fileType: 'PARAMETER FILE',
      type: 'file',
      value: '1',
    });
    expect(program.value[2]).toStrictEqual({
      type: 'identifier',
      value: 'PARAMETER FILE',
    });
    expect(program.value[3]).toStrictEqual({
      fileType: 'INCLUDE',
      type: 'file',
      value: 'file.inc',
    });
    expect(program.value[4]).toStrictEqual({
      fileType: 'INCLUDE',
      type: 'file',
      value: '1234',
    });
    expect(program.value[5]).toStrictEqual({
      type: 'identifier',
      value: 'INCLUDE',
    });
    expect(maapInpParser.toString(program)).toBe('PARAMETER FILE parameter_file.PAR\nPARAMETER FILE 1\nPARAMETER FILE\nINCLUDE file.inc\nINCLUDE 1234\nINCLUDE');
  });
  test('block statements', async () => {
    const program = maapInpParser.parse(await readTestData('block.INP')).output;
    expect(program.value[0]).toStrictEqual({
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
    expect(program.value[1]).toStrictEqual({
      blockType: 'PARAMETER CHANGE',
      type: 'block',
      value: [],
    });
    expect(program.value[2]).toStrictEqual({
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
    expect(program.value[3]).toStrictEqual({
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
    expect(program.value[4]).toStrictEqual({
      blockType: 'INITIATORS',
      type: 'block',
      value: [],
    });
    expect(program.value[5]).toStrictEqual({
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
    expect(maapInpParser.toString(program)).toBe(`PARAMETER CHANGE
VarName(1) = 1
END
PARAMETER CHANGE

END
PARAMETER CHANGE
IF VarName(1) IS 1
SET TIMER #1
END
END
INITIATORS
VarName(1) = 1
END
INITIATORS

END
INITIATORS
IF VarName(1) IS 1
SET TIMER #1
END
END`);
  });
  test('conditional block statements', async () => {
    const program = maapInpParser.parse(
      await readTestData('conditionalBlock.INP'),
    ).output;
    expect(program.value[0]).toStrictEqual({
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
    expect(program.value[1]).toStrictEqual({
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
    expect(program.value[2]).toStrictEqual({
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
    expect(program.value[3]).toStrictEqual({
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
    expect(maapInpParser.toString(program)).toBe(`WHEN VARIABLE IS T
VARNAME = 1000
END
WHEN VARIABLE IS T

END
IF VARIABLE IS T
VARNAME = 1000
END
IF VARIABLE IS T

END`);
  });
  test('alias statements', async () => {
    const program = maapInpParser.parse(await readTestData('alias.INP')).output;
    expect(program.value[0]).toStrictEqual({
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
    expect(program.value[1]).toStrictEqual({
      type: 'alias',
      value: [],
    });
    expect(maapInpParser.toString(program)).toBe(`ALIAS
VARNAME AS Value
END
ALIAS

END`);
  });
  test('plotfil statements', async () => {
    const program = maapInpParser.parse(await readTestData('plotfil.INP'))
      .output;
    expect(program.value[0]).toStrictEqual({
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
    expect(maapInpParser.toString(program)).toBe(`PLOTFIL 3
A,B,C
D,E,F
G,H,I(J)
END`);
  });
  test('userevt statements', async () => {
    const program = maapInpParser.parse(await readTestData('userevt.INP'))
      .output;
    expect(program.value[0].type).toBe('user_evt');
    const userEvt = program.value[0] as t.UserEvtStatement;
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
      flag: undefined,
      index: 102,
      type: 'parameter',
      value: 'Parameter 2',
    });
    expect(userEvt.value[2]).toStrictEqual({
      index: 1,
      type: 'action',
      value: [
        {
          flag: undefined,
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
    expect(maapInpParser.toString(program)).toBe(`USEREVT
100 T Parameter Name
102 Parameter 2
ACTION #1
103 Parameter 3
ACTION #2

END
END
IF VALUE IS T

END
END`);
  });
  test('function statements', async () => {
    const program = maapInpParser.parse(await readTestData('function.INP'))
      .output;
    expect(program.value[0]).toStrictEqual({
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
    expect(maapInpParser.toString(program)).toBe('FUNCTION name = 1 + 1');
  });
  test('set timer statements', async () => {
    const program = maapInpParser.parse(await readTestData('timer.INP')).output;
    expect(program.value[0]).toStrictEqual({
      type: 'set_timer',
      value: {
        type: 'timer',
        value: 1,
      },
    });
    expect(maapInpParser.toString(program)).toBe('SET TIMER #1');
  });
  test('lookup variable statements', async () => {
    const program = maapInpParser.parse(await readTestData('lookup.INP')).output;
    expect(program.value[0]).toStrictEqual({
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
    expect(maapInpParser.toString(program)).toBe(`LOOKUP VARIABLE VariableName
You can type anything in here for now
It just gets separated by row
END`);
  });
});

describe('program blocks', () => {
  test('source elements', async () => {
    const program = maapInpParser.parse(
      await readTestData('sourceElements.INP'),
    ).output;
    expect(program.value[0]).toStrictEqual({
      type: 'sensitivity',
      value: 'ON',
    });
    expect(program.value[1]).toStrictEqual({
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
    expect(program.value[2]).toStrictEqual({
      arguments: [],
      type: 'call_expression',
      value: {
        type: 'identifier',
        value: 'Function',
      },
    });
    expect(program.value[3]).toStrictEqual({
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
    expect(maapInpParser.toString(program)).toBe(`SENSITIVITY ON
Identifier = 1 HR
Function()
Identifier AS Value`);
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
