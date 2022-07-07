/* eslint-disable sort-keys */
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
  // Turn of location (so I don't have to rewrite the expect outputs)
  maapInpParser.options.emitLocation = false;
});

describe('literals', () => {
  test('boolean literal', async () => {
    const program = maapInpParser.parse(
      await readTestData('boolean.INP'),
    ).output;
    expect(program.value[0]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 37,
          line: 4,
          column: 1,
        },
        end: {
          offset: 41,
          line: 4,
          column: 5,
        },
      },
      type: 'boolean',
      value: true,
    });
    expect(program.value[1]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 42,
          line: 5,
          column: 1,
        },
        end: {
          offset: 47,
          line: 5,
          column: 6,
        },
      },
      type: 'boolean',
      value: false,
    });
    expect(program.value[2]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 61,
          line: 8,
          column: 1,
        },
        end: {
          offset: 62,
          line: 8,
          column: 2,
        },
      },
      type: 'boolean',
      value: true,
    });
    expect(program.value[3]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 63,
          line: 9,
          column: 1,
        },
        end: {
          offset: 64,
          line: 9,
          column: 2,
        },
      },
      type: 'boolean',
      value: false,
    });
  });

  test('numerical literal', async () => {
    const program = maapInpParser.parse(
      await readTestData('numeric.INP'),
    ).output;
    expect(program.value[0]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 45,
          line: 4,
          column: 1,
        },
        end: {
          offset: 46,
          line: 4,
          column: 2,
        },
      },
      type: 'number',
      units: undefined,
      value: 1,
    });
    expect(program.value[1]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 58,
          line: 7,
          column: 1,
        },
        end: {
          offset: 61,
          line: 7,
          column: 4,
        },
      },
      type: 'number',
      units: undefined,
      value: 2,
    });
    expect(program.value[2]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 62,
          line: 8,
          column: 1,
        },
        end: {
          offset: 64,
          line: 8,
          column: 3,
        },
      },
      type: 'number',
      units: undefined,
      value: 3,
    });
    expect(program.value[3]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 79,
          line: 11,
          column: 1,
        },
        end: {
          offset: 82,
          line: 11,
          column: 4,
        },
      },
      type: 'number',
      units: undefined,
      value: 4,
    });
    expect(program.value[4]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 83,
          line: 12,
          column: 1,
        },
        end: {
          offset: 87,
          line: 12,
          column: 5,
        },
      },
      type: 'number',
      units: undefined,
      value: 0.005,
    });
  });
});

describe('expressions', () => {
  test('call expression', async () => {
    const program = maapInpParser.parse(await readTestData('call.INP')).output;
    expect(program.value[0]).toStrictEqual({
      arguments: [],
      location: {
        source: undefined,
        start: {
          offset: 45,
          line: 4,
          column: 1,
        },
        end: {
          offset: 51,
          line: 4,
          column: 7,
        },
      },
      type: 'call_expression',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 45,
            line: 4,
            column: 1,
          },
          end: {
            offset: 49,
            line: 4,
            column: 5,
          },
        },
        type: 'identifier',
        value: 'Name',
      },
    });
    expect(program.value[1]).toStrictEqual({
      arguments: [
        {
          location: {
            source: undefined,
            start: {
              offset: 73,
              line: 7,
              column: 6,
            },
            end: {
              offset: 74,
              line: 7,
              column: 7,
            },
          },
          type: 'number',
          units: undefined,
          value: 1,
        },
      ],
      location: {
        source: undefined,
        start: {
          offset: 68,
          line: 7,
          column: 1,
        },
        end: {
          offset: 75,
          line: 7,
          column: 8,
        },
      },
      type: 'call_expression',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 68,
            line: 7,
            column: 1,
          },
          end: {
            offset: 72,
            line: 7,
            column: 5,
          },
        },
        type: 'identifier',
        value: 'Name',
      },
    });
    expect(program.value[2]).toStrictEqual({
      arguments: [
        {
          location: {
            source: undefined,
            start: {
              offset: 99,
              line: 10,
              column: 6,
            },
            end: {
              offset: 100,
              line: 10,
              column: 7,
            },
          },
          type: 'number',
          units: undefined,
          value: 1,
        },
        {
          location: {
            source: undefined,
            start: {
              offset: 101,
              line: 10,
              column: 8,
            },
            end: {
              offset: 102,
              line: 10,
              column: 9,
            },
          },
          type: 'number',
          units: undefined,
          value: 2,
        },
        {
          location: {
            source: undefined,
            start: {
              offset: 103,
              line: 10,
              column: 10,
            },
            end: {
              offset: 104,
              line: 10,
              column: 11,
            },
          },
          type: 'number',
          units: undefined,
          value: 3,
        },
      ],
      location: {
        source: undefined,
        start: {
          offset: 94,
          line: 10,
          column: 1,
        },
        end: {
          offset: 105,
          line: 10,
          column: 12,
        },
      },
      type: 'call_expression',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 94,
            line: 10,
            column: 1,
          },
          end: {
            offset: 98,
            line: 10,
            column: 5,
          },
        },
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
                  location: {
                    source: undefined,
                    start: {
                      offset: 132,
                      line: 13,
                      column: 11,
                    },
                    end: {
                      offset: 142,
                      line: 13,
                      column: 21,
                    },
                  },
                  type: 'call_expression',
                  value: {
                    location: {
                      source: undefined,
                      start: {
                        offset: 132,
                        line: 13,
                        column: 11,
                      },
                      end: {
                        offset: 140,
                        line: 13,
                        column: 19,
                      },
                    },
                    type: 'identifier',
                    value: 'Function',
                  },
                },
              ],
              location: {
                source: undefined,
                start: {
                  offset: 130,
                  line: 13,
                  column: 9,
                },
                end: {
                  offset: 143,
                  line: 13,
                  column: 22,
                },
              },
              type: 'call_expression',
              value: {
                location: {
                  source: undefined,
                  start: {
                    offset: 130,
                    line: 13,
                    column: 9,
                  },
                  end: {
                    offset: 131,
                    line: 13,
                    column: 10,
                  },
                },
                type: 'identifier',
                value: 'A',
              },
            },
          ],
          location: {
            source: undefined,
            start: {
              offset: 127,
              line: 13,
              column: 6,
            },
            end: {
              offset: 144,
              line: 13,
              column: 23,
            },
          },
          type: 'call_expression',
          value: {
            location: {
              source: undefined,
              start: {
                offset: 127,
                line: 13,
                column: 6,
              },
              end: {
                offset: 129,
                line: 13,
                column: 8,
              },
            },
            type: 'identifier',
            value: 'Of',
          },
        },
      ],
      location: {
        source: undefined,
        start: {
          offset: 122,
          line: 13,
          column: 1,
        },
        end: {
          offset: 145,
          line: 13,
          column: 24,
        },
      },
      type: 'call_expression',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 122,
            line: 13,
            column: 1,
          },
          end: {
            offset: 126,
            line: 13,
            column: 5,
          },
        },
        type: 'identifier',
        value: 'Name',
      },
    });
    expect(maapInpParser.toString(program)).toBe(
      'Name()\nName(1)\nName(1,2,3)\nName(Of(A(Function())))',
    );
  });
  test('is expression', async () => {
    const program = maapInpParser.parse(await readTestData('is.INP')).output;
    expect(program.value[0]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 38,
          line: 4,
          column: 1,
        },
        end: {
          offset: 54,
          line: 4,
          column: 17,
        },
      },
      target: {
        location: {
          source: undefined,
          start: {
            offset: 38,
            line: 4,
            column: 1,
          },
          end: {
            offset: 45,
            line: 4,
            column: 8,
          },
        },
        type: 'identifier',
        value: 'VARNAME',
      },
      type: 'is_expression',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 49,
            line: 4,
            column: 12,
          },
          end: {
            offset: 54,
            line: 4,
            column: 17,
          },
        },
        type: 'identifier',
        value: 'Value',
      },
    });
    expect(program.value[1]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 81,
          line: 7,
          column: 1,
        },
        end: {
          offset: 97,
          line: 7,
          column: 17,
        },
      },
      target: {
        location: {
          source: undefined,
          start: {
            offset: 81,
            line: 7,
            column: 1,
          },
          end: {
            offset: 91,
            line: 7,
            column: 11,
          },
        },
        type: 'parameter_name',
        value: 'START TIME',
      },
      type: 'is_expression',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 95,
            line: 7,
            column: 15,
          },
          end: {
            offset: 97,
            line: 7,
            column: 17,
          },
        },
        type: 'number',
        units: undefined,
        value: 0,
      },
    });
    expect(program.value[2]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 98,
          line: 8,
          column: 1,
        },
        end: {
          offset: 117,
          line: 8,
          column: 20,
        },
      },
      target: {
        location: {
          source: undefined,
          start: {
            offset: 98,
            line: 8,
            column: 1,
          },
          end: {
            offset: 106,
            line: 8,
            column: 9,
          },
        },
        type: 'parameter_name',
        value: 'END TIME',
      },
      type: 'is_expression',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 110,
            line: 8,
            column: 13,
          },
          end: {
            offset: 117,
            line: 8,
            column: 20,
          },
        },
        type: 'number',
        units: undefined,
        value: 144000,
      },
    });
    expect(program.value[3]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 118,
          line: 9,
          column: 1,
        },
        end: {
          offset: 141,
          line: 9,
          column: 24,
        },
      },
      target: {
        location: {
          source: undefined,
          start: {
            offset: 118,
            line: 9,
            column: 1,
          },
          end: {
            offset: 132,
            line: 9,
            column: 15,
          },
        },
        type: 'parameter_name',
        value: 'PRINT INTERVAL',
      },
      type: 'is_expression',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 136,
            line: 9,
            column: 19,
          },
          end: {
            offset: 141,
            line: 9,
            column: 24,
          },
        },
        type: 'number',
        units: undefined,
        value: 5000,
      },
    });
    expect(maapInpParser.toString(program)).toBe(
      'VARNAME IS Value\nSTART TIME IS 0\nEND TIME IS 144000\nPRINT INTERVAL IS 5000',
    );
  });
});

describe('statements', () => {
  test('sensitivity statements', async () => {
    const program = maapInpParser.parse(
      await readTestData('sensitivity.INP'),
    ).output;
    expect(program.value[0]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 101,
          line: 5,
          column: 1,
        },
        end: {
          offset: 115,
          line: 5,
          column: 15,
        },
      },
      type: 'sensitivity',
      value: 'ON',
    });
    expect(program.value[1]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 135,
          line: 8,
          column: 1,
        },
        end: {
          offset: 150,
          line: 8,
          column: 16,
        },
      },
      type: 'sensitivity',
      value: 'OFF',
    });
    expect(program.value[2]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 224,
          line: 12,
          column: 1,
        },
        end: {
          offset: 235,
          line: 12,
          column: 12,
        },
      },
      type: 'identifier',
      value: 'SENSITIVITY',
    });
    expect(maapInpParser.toString(program)).toBe(
      'SENSITIVITY ON\nSENSITIVITY OFF\nSENSITIVITY',
    );
  });
  test('title statements', async () => {
    const program = maapInpParser.parse(await readTestData('title.INP')).output;
    expect(program.value[0]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 40,
          line: 4,
          column: 1,
        },
        end: {
          offset: 61,
          line: 6,
          column: 4,
        },
      },
      type: 'title',
      value: 'Valid Title',
    });
    expect(program.value[1]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 76,
          line: 9,
          column: 1,
        },
        end: {
          offset: 126,
          line: 13,
          column: 4,
        },
      },
      type: 'title',
      value: `A title that
extends onto
multiple lines`,
    });
    expect(program.value[2]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 142,
          line: 16,
          column: 1,
        },
        end: {
          offset: 151,
          line: 17,
          column: 4,
        },
      },
      type: 'title',
      value: undefined,
    });
    expect(maapInpParser.toString(program)).toBe(
      'TITLE\nValid Title\nEND\nTITLE\nA title that\nextends onto\nmultiple lines\nEND\nTITLE\n\nEND',
    );
  });
  test('parameter file statements', async () => {
    const program = maapInpParser.parse(await readTestData('file.INP')).output;
    expect(program.value[0]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 39,
          line: 4,
          column: 1,
        },
        end: {
          offset: 72,
          line: 4,
          column: 34,
        },
      },
      fileType: 'PARAMETER FILE',
      type: 'file',
      value: 'parameter_file.PAR',
    });
    expect(program.value[1]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 178,
          line: 8,
          column: 1,
        },
        end: {
          offset: 194,
          line: 8,
          column: 17,
        },
      },
      fileType: 'PARAMETER FILE',
      type: 'file',
      value: '1',
    });
    expect(program.value[2]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 248,
          line: 12,
          column: 1,
        },
        end: {
          offset: 262,
          line: 12,
          column: 15,
        },
      },
      type: 'parameter_name',
      value: 'PARAMETER FILE',
    });
    expect(program.value[3]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 274,
          line: 15,
          column: 1,
        },
        end: {
          offset: 290,
          line: 15,
          column: 17,
        },
      },
      fileType: 'INCLUDE',
      type: 'file',
      value: 'file.inc',
    });
    expect(program.value[4]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 372,
          line: 19,
          column: 1,
        },
        end: {
          offset: 384,
          line: 19,
          column: 13,
        },
      },
      fileType: 'INCLUDE',
      type: 'file',
      value: '1234',
    });
    expect(program.value[5]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 430,
          line: 23,
          column: 1,
        },
        end: {
          offset: 437,
          line: 23,
          column: 8,
        },
      },
      type: 'identifier',
      value: 'INCLUDE',
    });
    expect(maapInpParser.toString(program)).toBe(
      'PARAMETER FILE parameter_file.PAR\nPARAMETER FILE 1\nPARAMETER FILE\nINCLUDE file.inc\nINCLUDE 1234\nINCLUDE',
    );
  });
  test('block statements', async () => {
    const program = maapInpParser.parse(await readTestData('block.INP')).output;
    expect(program.value[0]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 40,
          line: 4,
          column: 1,
        },
        end: {
          offset: 75,
          line: 6,
          column: 4,
        },
      },
      blockType: 'PARAMETER CHANGE',
      type: 'block',
      value: [
        {
          location: {
            source: undefined,
            start: {
              offset: 57,
              line: 5,
              column: 1,
            },
            end: {
              offset: 71,
              line: 5,
              column: 15,
            },
          },
          target: {
            arguments: [
              {
                location: {
                  source: undefined,
                  start: {
                    offset: 65,
                    line: 5,
                    column: 9,
                  },
                  end: {
                    offset: 66,
                    line: 5,
                    column: 10,
                  },
                },
                type: 'number',
                units: undefined,
                value: 1,
              },
            ],
            location: {
              source: undefined,
              start: {
                offset: 57,
                line: 5,
                column: 1,
              },
              end: {
                offset: 67,
                line: 5,
                column: 11,
              },
            },
            type: 'call_expression',
            value: {
              location: {
                source: undefined,
                start: {
                  offset: 57,
                  line: 5,
                  column: 1,
                },
                end: {
                  offset: 64,
                  line: 5,
                  column: 8,
                },
              },
              type: 'identifier',
              value: 'VarName',
            },
          },
          type: 'assignment',
          value: {
            location: {
              source: undefined,
              start: {
                offset: 70,
                line: 5,
                column: 14,
              },
              end: {
                offset: 71,
                line: 5,
                column: 15,
              },
            },
            type: 'number',
            units: undefined,
            value: 1,
          },
        },
      ],
    });
    expect(program.value[1]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 85,
          line: 9,
          column: 1,
        },
        end: {
          offset: 105,
          line: 10,
          column: 4,
        },
      },
      blockType: 'PARAMETER CHANGE',
      type: 'block',
      value: [],
    });
    expect(program.value[2]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 137,
          line: 13,
          column: 1,
        },
        end: {
          offset: 193,
          line: 17,
          column: 4,
        },
      },
      blockType: 'PARAMETER CHANGE',
      type: 'block',
      value: [
        {
          location: {
            source: undefined,
            start: {
              offset: 154,
              line: 14,
              column: 1,
            },
            end: {
              offset: 189,
              line: 16,
              column: 4,
            },
          },
          blockType: 'IF',
          test: {
            location: {
              source: undefined,
              start: {
                offset: 157,
                line: 14,
                column: 4,
              },
              end: {
                offset: 172,
                line: 14,
                column: 19,
              },
            },
            target: {
              arguments: [
                {
                  location: {
                    source: undefined,
                    start: {
                      offset: 165,
                      line: 14,
                      column: 12,
                    },
                    end: {
                      offset: 166,
                      line: 14,
                      column: 13,
                    },
                  },
                  type: 'number',
                  units: undefined,
                  value: 1,
                },
              ],
              location: {
                source: undefined,
                start: {
                  offset: 157,
                  line: 14,
                  column: 4,
                },
                end: {
                  offset: 167,
                  line: 14,
                  column: 14,
                },
              },
              type: 'call_expression',
              value: {
                location: {
                  source: undefined,
                  start: {
                    offset: 157,
                    line: 14,
                    column: 4,
                  },
                  end: {
                    offset: 164,
                    line: 14,
                    column: 11,
                  },
                },
                type: 'identifier',
                value: 'VarName',
              },
            },
            type: 'is_expression',
            value: {
              location: {
                source: undefined,
                start: {
                  offset: 171,
                  line: 14,
                  column: 18,
                },
                end: {
                  offset: 172,
                  line: 14,
                  column: 19,
                },
              },
              type: 'number',
              units: undefined,
              value: 1,
            },
          },
          type: 'conditional_block',
          value: [
            {
              location: {
                source: undefined,
                start: {
                  offset: 173,
                  line: 15,
                  column: 1,
                },
                end: {
                  offset: 185,
                  line: 15,
                  column: 13,
                },
              },
              type: 'set_timer',
              value: {
                location: {
                  source: undefined,
                  start: {
                    offset: 177,
                    line: 15,
                    column: 5,
                  },
                  end: {
                    offset: 185,
                    line: 15,
                    column: 13,
                  },
                },
                type: 'timer',
                value: 1,
              },
            },
          ],
        },
      ],
    });
    expect(program.value[3]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 205,
          line: 20,
          column: 1,
        },
        end: {
          offset: 234,
          line: 22,
          column: 4,
        },
      },
      blockType: 'INITIATORS',
      type: 'block',
      value: [
        {
          location: {
            source: undefined,
            start: {
              offset: 216,
              line: 21,
              column: 1,
            },
            end: {
              offset: 230,
              line: 21,
              column: 15,
            },
          },
          target: {
            arguments: [
              {
                location: {
                  source: undefined,
                  start: {
                    offset: 224,
                    line: 21,
                    column: 9,
                  },
                  end: {
                    offset: 225,
                    line: 21,
                    column: 10,
                  },
                },
                type: 'number',
                units: undefined,
                value: 1,
              },
            ],
            location: {
              source: undefined,
              start: {
                offset: 216,
                line: 21,
                column: 1,
              },
              end: {
                offset: 226,
                line: 21,
                column: 11,
              },
            },
            type: 'call_expression',
            value: {
              location: {
                source: undefined,
                start: {
                  offset: 216,
                  line: 21,
                  column: 1,
                },
                end: {
                  offset: 223,
                  line: 21,
                  column: 8,
                },
              },
              type: 'identifier',
              value: 'VarName',
            },
          },
          type: 'assignment',
          value: {
            location: {
              source: undefined,
              start: {
                offset: 229,
                line: 21,
                column: 14,
              },
              end: {
                offset: 230,
                line: 21,
                column: 15,
              },
            },
            type: 'number',
            units: undefined,
            value: 1,
          },
        },
      ],
    });
    expect(program.value[4]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 244,
          line: 25,
          column: 1,
        },
        end: {
          offset: 258,
          line: 26,
          column: 4,
        },
      },
      blockType: 'INITIATORS',
      type: 'block',
      value: [],
    });
    expect(program.value[5]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 290,
          line: 29,
          column: 1,
        },
        end: {
          offset: 340,
          line: 33,
          column: 4,
        },
      },
      blockType: 'INITIATORS',
      type: 'block',
      value: [
        {
          location: {
            source: undefined,
            start: {
              offset: 301,
              line: 30,
              column: 1,
            },
            end: {
              offset: 336,
              line: 32,
              column: 4,
            },
          },
          blockType: 'IF',
          test: {
            location: {
              source: undefined,
              start: {
                offset: 304,
                line: 30,
                column: 4,
              },
              end: {
                offset: 319,
                line: 30,
                column: 19,
              },
            },
            target: {
              arguments: [
                {
                  location: {
                    source: undefined,
                    start: {
                      offset: 312,
                      line: 30,
                      column: 12,
                    },
                    end: {
                      offset: 313,
                      line: 30,
                      column: 13,
                    },
                  },
                  type: 'number',
                  units: undefined,
                  value: 1,
                },
              ],
              location: {
                source: undefined,
                start: {
                  offset: 304,
                  line: 30,
                  column: 4,
                },
                end: {
                  offset: 314,
                  line: 30,
                  column: 14,
                },
              },
              type: 'call_expression',
              value: {
                location: {
                  source: undefined,
                  start: {
                    offset: 304,
                    line: 30,
                    column: 4,
                  },
                  end: {
                    offset: 311,
                    line: 30,
                    column: 11,
                  },
                },
                type: 'identifier',
                value: 'VarName',
              },
            },
            type: 'is_expression',
            value: {
              location: {
                source: undefined,
                start: {
                  offset: 318,
                  line: 30,
                  column: 18,
                },
                end: {
                  offset: 319,
                  line: 30,
                  column: 19,
                },
              },
              type: 'number',
              units: undefined,
              value: 1,
            },
          },
          type: 'conditional_block',
          value: [
            {
              location: {
                source: undefined,
                start: {
                  offset: 320,
                  line: 31,
                  column: 1,
                },
                end: {
                  offset: 332,
                  line: 31,
                  column: 13,
                },
              },
              type: 'set_timer',
              value: {
                location: {
                  source: undefined,
                  start: {
                    offset: 324,
                    line: 31,
                    column: 5,
                  },
                  end: {
                    offset: 332,
                    line: 31,
                    column: 13,
                  },
                },
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
      location: {
        source: undefined,
        start: {
          offset: 57,
          line: 4,
          column: 1,
        },
        end: {
          offset: 97,
          line: 6,
          column: 4,
        },
      },
      blockType: 'WHEN',
      test: {
        location: {
          source: undefined,
          start: {
            offset: 62,
            line: 4,
            column: 6,
          },
          end: {
            offset: 78,
            line: 4,
            column: 22,
          },
        },
        target: {
          location: {
            source: undefined,
            start: {
              offset: 62,
              line: 4,
              column: 6,
            },
            end: {
              offset: 70,
              line: 4,
              column: 14,
            },
          },
          type: 'identifier',
          value: 'VARIABLE',
        },
        type: 'is_expression',
        value: {
          location: {
            source: undefined,
            start: {
              offset: 74,
              line: 4,
              column: 18,
            },
            end: {
              offset: 78,
              line: 4,
              column: 22,
            },
          },
          type: 'boolean',
          value: true,
        },
      },
      type: 'conditional_block',
      value: [
        {
          location: {
            source: undefined,
            start: {
              offset: 79,
              line: 5,
              column: 1,
            },
            end: {
              offset: 93,
              line: 5,
              column: 15,
            },
          },
          target: {
            location: {
              source: undefined,
              start: {
                offset: 79,
                line: 5,
                column: 1,
              },
              end: {
                offset: 86,
                line: 5,
                column: 8,
              },
            },
            type: 'identifier',
            value: 'VARNAME',
          },
          type: 'assignment',
          value: {
            location: {
              source: undefined,
              start: {
                offset: 89,
                line: 5,
                column: 11,
              },
              end: {
                offset: 93,
                line: 5,
                column: 15,
              },
            },
            type: 'number',
            units: undefined,
            value: 1000,
          },
        },
      ],
    });
    expect(program.value[1]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 112,
          line: 9,
          column: 1,
        },
        end: {
          offset: 137,
          line: 10,
          column: 4,
        },
      },
      blockType: 'WHEN',
      test: {
        location: {
          source: undefined,
          start: {
            offset: 117,
            line: 9,
            column: 6,
          },
          end: {
            offset: 133,
            line: 9,
            column: 22,
          },
        },
        target: {
          location: {
            source: undefined,
            start: {
              offset: 117,
              line: 9,
              column: 6,
            },
            end: {
              offset: 125,
              line: 9,
              column: 14,
            },
          },
          type: 'identifier',
          value: 'VARIABLE',
        },
        type: 'is_expression',
        value: {
          location: {
            source: undefined,
            start: {
              offset: 129,
              line: 9,
              column: 18,
            },
            end: {
              offset: 133,
              line: 9,
              column: 22,
            },
          },
          type: 'boolean',
          value: true,
        },
      },
      type: 'conditional_block',
      value: [],
    });
    expect(program.value[2]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 152,
          line: 13,
          column: 1,
        },
        end: {
          offset: 190,
          line: 15,
          column: 4,
        },
      },
      blockType: 'IF',
      test: {
        location: {
          source: undefined,
          start: {
            offset: 155,
            line: 13,
            column: 4,
          },
          end: {
            offset: 171,
            line: 13,
            column: 20,
          },
        },
        target: {
          location: {
            source: undefined,
            start: {
              offset: 155,
              line: 13,
              column: 4,
            },
            end: {
              offset: 163,
              line: 13,
              column: 12,
            },
          },
          type: 'identifier',
          value: 'VARIABLE',
        },
        type: 'is_expression',
        value: {
          location: {
            source: undefined,
            start: {
              offset: 167,
              line: 13,
              column: 16,
            },
            end: {
              offset: 171,
              line: 13,
              column: 20,
            },
          },
          type: 'boolean',
          value: true,
        },
      },
      type: 'conditional_block',
      value: [
        {
          location: {
            source: undefined,
            start: {
              offset: 172,
              line: 14,
              column: 1,
            },
            end: {
              offset: 186,
              line: 14,
              column: 15,
            },
          },
          target: {
            location: {
              source: undefined,
              start: {
                offset: 172,
                line: 14,
                column: 1,
              },
              end: {
                offset: 179,
                line: 14,
                column: 8,
              },
            },
            type: 'identifier',
            value: 'VARNAME',
          },
          type: 'assignment',
          value: {
            location: {
              source: undefined,
              start: {
                offset: 182,
                line: 14,
                column: 11,
              },
              end: {
                offset: 186,
                line: 14,
                column: 15,
              },
            },
            type: 'number',
            units: undefined,
            value: 1000,
          },
        },
      ],
    });
    expect(program.value[3]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 203,
          line: 18,
          column: 1,
        },
        end: {
          offset: 226,
          line: 19,
          column: 4,
        },
      },
      blockType: 'IF',
      test: {
        location: {
          source: undefined,
          start: {
            offset: 206,
            line: 18,
            column: 4,
          },
          end: {
            offset: 222,
            line: 18,
            column: 20,
          },
        },
        target: {
          location: {
            source: undefined,
            start: {
              offset: 206,
              line: 18,
              column: 4,
            },
            end: {
              offset: 214,
              line: 18,
              column: 12,
            },
          },
          type: 'identifier',
          value: 'VARIABLE',
        },
        type: 'is_expression',
        value: {
          location: {
            source: undefined,
            start: {
              offset: 218,
              line: 18,
              column: 16,
            },
            end: {
              offset: 222,
              line: 18,
              column: 20,
            },
          },
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
      location: {
        source: undefined,
        start: {
          offset: 40,
          line: 4,
          column: 1,
        },
        end: {
          offset: 66,
          line: 6,
          column: 4,
        },
      },
      type: 'alias',
      value: [
        {
          location: {
            source: undefined,
            start: {
              offset: 46,
              line: 5,
              column: 1,
            },
            end: {
              offset: 62,
              line: 5,
              column: 17,
            },
          },
          target: {
            location: {
              source: undefined,
              start: {
                offset: 46,
                line: 5,
                column: 1,
              },
              end: {
                offset: 53,
                line: 5,
                column: 8,
              },
            },
            type: 'identifier',
            value: 'VARNAME',
          },
          type: 'as_expression',
          value: {
            location: {
              source: undefined,
              start: {
                offset: 57,
                line: 5,
                column: 12,
              },
              end: {
                offset: 62,
                line: 5,
                column: 17,
              },
            },
            type: 'identifier',
            value: 'Value',
          },
        },
      ],
    });
    expect(program.value[1]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 76,
          line: 9,
          column: 1,
        },
        end: {
          offset: 85,
          line: 10,
          column: 4,
        },
      },
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
    const program = maapInpParser.parse(
      await readTestData('plotfil.INP'),
    ).output;
    expect(program.value[0]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 42,
          line: 4,
          column: 1,
        },
        end: {
          offset: 76,
          line: 8,
          column: 4,
        },
      },
      n: 3,
      type: 'plotfil',
      value: [
        [
          {
            location: {
              source: undefined,
              start: {
                offset: 52,
                line: 5,
                column: 1,
              },
              end: {
                offset: 53,
                line: 5,
                column: 2,
              },
            },
            type: 'identifier',
            value: 'A',
          },
          {
            location: {
              source: undefined,
              start: {
                offset: 54,
                line: 5,
                column: 3,
              },
              end: {
                offset: 55,
                line: 5,
                column: 4,
              },
            },
            type: 'identifier',
            value: 'B',
          },
          {
            location: {
              source: undefined,
              start: {
                offset: 56,
                line: 5,
                column: 5,
              },
              end: {
                offset: 57,
                line: 5,
                column: 6,
              },
            },
            type: 'identifier',
            value: 'C',
          },
        ],
        [
          {
            location: {
              source: undefined,
              start: {
                offset: 58,
                line: 6,
                column: 1,
              },
              end: {
                offset: 59,
                line: 6,
                column: 2,
              },
            },
            type: 'identifier',
            value: 'D',
          },
          {
            location: {
              source: undefined,
              start: {
                offset: 60,
                line: 6,
                column: 3,
              },
              end: {
                offset: 61,
                line: 6,
                column: 4,
              },
            },
            type: 'identifier',
            value: 'E',
          },
          {
            location: {
              source: undefined,
              start: {
                offset: 62,
                line: 6,
                column: 5,
              },
              end: {
                offset: 63,
                line: 6,
                column: 6,
              },
            },
            type: 'boolean',
            value: false,
          },
        ],
        [
          {
            location: {
              source: undefined,
              start: {
                offset: 64,
                line: 7,
                column: 1,
              },
              end: {
                offset: 65,
                line: 7,
                column: 2,
              },
            },
            type: 'identifier',
            value: 'G',
          },
          {
            location: {
              source: undefined,
              start: {
                offset: 66,
                line: 7,
                column: 3,
              },
              end: {
                offset: 67,
                line: 7,
                column: 4,
              },
            },
            type: 'identifier',
            value: 'H',
          },
          {
            arguments: [
              {
                location: {
                  source: undefined,
                  start: {
                    offset: 70,
                    line: 7,
                    column: 7,
                  },
                  end: {
                    offset: 71,
                    line: 7,
                    column: 8,
                  },
                },
                type: 'identifier',
                value: 'J',
              },
            ],
            location: {
              source: undefined,
              start: {
                offset: 68,
                line: 7,
                column: 5,
              },
              end: {
                offset: 72,
                line: 7,
                column: 9,
              },
            },
            type: 'call_expression',
            value: {
              location: {
                source: undefined,
                start: {
                  offset: 68,
                  line: 7,
                  column: 5,
                },
                end: {
                  offset: 69,
                  line: 7,
                  column: 6,
                },
              },
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
    const program = maapInpParser.parse(
      await readTestData('userevt.INP'),
    ).output;
    expect(program.value[0].type).toBe('user_evt');
    expect(program.value[0].location).toStrictEqual({
      source: undefined,
      start: {
        offset: 112,
        line: 5,
        column: 1,
      },
      end: {
        offset: 323,
        line: 24,
        column: 4,
      },
    });
    const userEvt = program.value[0] as t.UserEvtStatement;
    expect(userEvt.value[0]).toStrictEqual({
      flag: {
        location: {
          source: undefined,
          start: {
            offset: 152,
            line: 8,
            column: 5,
          },
          end: {
            offset: 153,
            line: 8,
            column: 6,
          },
        },
        type: 'boolean',
        value: true,
      },
      location: {
        source: undefined,
        start: {
          offset: 148,
          line: 8,
          column: 1,
        },
        end: {
          offset: 168,
          line: 8,
          column: 21,
        },
      },
      index: 100,
      type: 'parameter',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 154,
            line: 8,
            column: 7,
          },
          end: {
            offset: 168,
            line: 8,
            column: 21,
          },
        },
        type: 'parameter_name',
        value: 'Parameter Name',
      },
    });
    expect(userEvt.value[1]).toStrictEqual({
      flag: undefined,
      location: {
        source: undefined,
        start: {
          offset: 200,
          line: 11,
          column: 1,
        },
        end: {
          offset: 215,
          line: 11,
          column: 16,
        },
      },
      index: 102,
      type: 'parameter',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 204,
            line: 11,
            column: 5,
          },
          end: {
            offset: 215,
            line: 11,
            column: 16,
          },
        },
        type: 'parameter_name',
        value: 'Parameter 2',
      },
    });
    expect(userEvt.value[2]).toStrictEqual({
      index: 1,
      location: {
        source: undefined,
        start: {
          offset: 226,
          line: 14,
          column: 1,
        },
        end: {
          offset: 269,
          line: 18,
          column: 4,
        },
      },
      type: 'action',
      value: [
        {
          flag: undefined,
          location: {
            source: undefined,
            start: {
              offset: 236,
              line: 15,
              column: 1,
            },
            end: {
              offset: 251,
              line: 15,
              column: 16,
            },
          },
          index: 103,
          type: 'parameter',
          value: {
            location: {
              source: undefined,
              start: {
                offset: 240,
                line: 15,
                column: 5,
              },
              end: {
                offset: 251,
                line: 15,
                column: 16,
              },
            },
            type: 'parameter_name',
            value: 'Parameter 3',
          },
        },
        {
          index: 2,
          location: {
            source: undefined,
            start: {
              offset: 252,
              line: 16,
              column: 1,
            },
            end: {
              offset: 265,
              line: 17,
              column: 4,
            },
          },
          type: 'action',
          value: [],
        },
      ],
    });
    expect(userEvt.value[3]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 298,
          line: 21,
          column: 1,
        },
        end: {
          offset: 318,
          line: 22,
          column: 4,
        },
      },
      blockType: 'IF',
      test: {
        location: {
          source: undefined,
          start: {
            offset: 301,
            line: 21,
            column: 4,
          },
          end: {
            offset: 314,
            line: 21,
            column: 17,
          },
        },
        target: {
          location: {
            source: undefined,
            start: {
              offset: 301,
              line: 21,
              column: 4,
            },
            end: {
              offset: 306,
              line: 21,
              column: 9,
            },
          },
          type: 'identifier',
          value: 'VALUE',
        },
        type: 'is_expression',
        value: {
          location: {
            source: undefined,
            start: {
              offset: 310,
              line: 21,
              column: 13,
            },
            end: {
              offset: 314,
              line: 21,
              column: 17,
            },
          },
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
    const program = maapInpParser.parse(
      await readTestData('function.INP'),
    ).output;
    expect(program.value[0]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 43,
          line: 4,
          column: 1,
        },
        end: {
          offset: 64,
          line: 4,
          column: 22,
        },
      },
      name: {
        location: {
          source: undefined,
          start: {
            offset: 52,
            line: 4,
            column: 10,
          },
          end: {
            offset: 56,
            line: 4,
            column: 14,
          },
        },
        type: 'identifier',
        value: 'name',
      },
      type: 'function',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 59,
            line: 4,
            column: 17,
          },
          end: {
            offset: 64,
            line: 4,
            column: 22,
          },
        },
        type: 'expression',
        value: {
          left: {
            location: {
              source: undefined,
              start: {
                offset: 59,
                line: 4,
                column: 17,
              },
              end: {
                offset: 60,
                line: 4,
                column: 18,
              },
            },
            type: 'number',
            units: undefined,
            value: 1,
          },
          op: '+',
          right: {
            location: {
              source: undefined,
              start: {
                offset: 63,
                line: 4,
                column: 21,
              },
              end: {
                offset: 64,
                line: 4,
                column: 22,
              },
            },
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
      location: {
        source: undefined,
        start: {
          offset: 44,
          line: 4,
          column: 1,
        },
        end: {
          offset: 56,
          line: 4,
          column: 13,
        },
      },
      type: 'set_timer',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 48,
            line: 4,
            column: 5,
          },
          end: {
            offset: 56,
            line: 4,
            column: 13,
          },
        },
        type: 'timer',
        value: 1,
      },
    });
    expect(maapInpParser.toString(program)).toBe('SET TIMER #1');
  });
  test('lookup variable statements', async () => {
    const program = maapInpParser.parse(
      await readTestData('lookup.INP'),
    ).output;
    expect(program.value[0]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 41,
          line: 4,
          column: 1,
        },
        end: {
          offset: 141,
          line: 7,
          column: 4,
        },
      },
      name: {
        location: {
          source: undefined,
          start: {
            offset: 57,
            line: 4,
            column: 17,
          },
          end: {
            offset: 69,
            line: 4,
            column: 29,
          },
        },
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
      location: {
        source: undefined,
        start: {
          offset: 40,
          line: 4,
          column: 1,
        },
        end: {
          offset: 54,
          line: 4,
          column: 15,
        },
      },
      type: 'sensitivity',
      value: 'ON',
    });
    expect(program.value[1]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 69,
          line: 7,
          column: 1,
        },
        end: {
          offset: 86,
          line: 7,
          column: 18,
        },
      },
      target: {
        location: {
          source: undefined,
          start: {
            offset: 69,
            line: 7,
            column: 1,
          },
          end: {
            offset: 79,
            line: 7,
            column: 11,
          },
        },
        type: 'identifier',
        value: 'Identifier',
      },
      type: 'assignment',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 82,
            line: 7,
            column: 14,
          },
          end: {
            offset: 86,
            line: 7,
            column: 18,
          },
        },
        type: 'number',
        units: 'HR',
        value: 1,
      },
    });
    expect(program.value[2]).toStrictEqual({
      arguments: [],
      location: {
        source: undefined,
        start: {
          offset: 101,
          line: 10,
          column: 1,
        },
        end: {
          offset: 111,
          line: 10,
          column: 11,
        },
      },
      type: 'call_expression',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 101,
            line: 10,
            column: 1,
          },
          end: {
            offset: 109,
            line: 10,
            column: 9,
          },
        },
        type: 'identifier',
        value: 'Function',
      },
    });
    expect(program.value[3]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 129,
          line: 13,
          column: 1,
        },
        end: {
          offset: 148,
          line: 13,
          column: 20,
        },
      },
      target: {
        location: {
          source: undefined,
          start: {
            offset: 129,
            line: 13,
            column: 1,
          },
          end: {
            offset: 139,
            line: 13,
            column: 11,
          },
        },
        type: 'identifier',
        value: 'Identifier',
      },
      type: 'as_expression',
      value: {
        location: {
          source: undefined,
          start: {
            offset: 143,
            line: 13,
            column: 15,
          },
          end: {
            offset: 148,
            line: 13,
            column: 20,
          },
        },
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
      location: {
        source: undefined,
        start: {
          offset: 25,
          line: 2,
          column: 1,
        },
        end: {
          offset: 97,
          line: 6,
          column: 4,
        },
      },
      blockType: 'INITIATORS',
      type: 'block',
      value: [
        {
          location: {
            source: undefined,
            start: {
              offset: 36,
              line: 3,
              column: 1,
            },
            end: {
              offset: 53,
              line: 3,
              column: 18,
            },
          },
          type: 'parameter_name',
          value: 'A VALID INITIATOR',
        },
        {
          location: {
            source: undefined,
            start: {
              offset: 54,
              line: 4,
              column: 1,
            },
            end: {
              offset: 77,
              line: 4,
              column: 24,
            },
          },
          type: 'parameter_name',
          value: 'ANOTHER VALID INITIATOR',
        },
      ],
    });
    expect(safeParsed.output.value[1]).toStrictEqual({
      location: {
        source: undefined,
        start: {
          offset: 116,
          line: 9,
          column: 1,
        },
        end: {
          offset: 123,
          line: 9,
          column: 8,
        },
      },
      type: 'identifier',
      value: 'PLOTFIL',
    });
  });
});
