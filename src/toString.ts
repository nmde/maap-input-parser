/* eslint-disable @typescript-eslint/no-use-before-define */
import * as t from './types';

/**
 * Checks if a type is a literal.
 *
 * @param type - The type to check.
 * @returns If the type is a statement.
 */
function isLiteral(type: string): boolean {
  return ['number', 'boolean', 'timer'].indexOf(type) >= 0;
}

/**
 * Checks if a type is a statement.
 *
 * @param type - The type to check.
 * @returns If the type is a statement.
 */
function isStatement(type: string): boolean {
  return (
    [
      'sensitivity',
      'title',
      'file',
      'block',
      'conditional_block',
      'alias',
      'plotfil',
      'user_evt',
      'function',
      'set_timer',
      'lookup_variable',
    ].indexOf(type) >= 0
  );
}

/**
 * Compiles a NumericLiteral into code.
 *
 * @param numericLiteral - The object to compile.
 * @returns The compiled code.
 */
function numberToString(numericLiteral: t.NumericLiteral): string {
  let re = `${numericLiteral.value}`;
  if (numericLiteral.units) {
    re += ` ${numericLiteral.units}`;
  }
  return re;
}

/**
 * Compiles a BooleanLiteral into code.
 *
 * @param booleanLiteral - The object to compile.
 * @returns The compiled code.
 */
function booleanToString(booleanLiteral: t.BooleanLiteral): string {
  if (booleanLiteral.value) {
    return 'T';
  }
  return 'F';
}

/**
 * Compiles a Parameter into code.
 *
 * @param parameter - The object to compile.
 * @returns The compiled code.
 */
function parameterToString(parameter: t.Parameter): string {
  let re = `${parameter.index} `;
  if (parameter.flag) {
    re += `${booleanToString(parameter.flag)} `;
  }
  return `${re}${parameter.value}`;
}

/**
 * Compiles a TimerLiteral into code.
 *
 * @param timerLiteral - The object to compile.
 * @returns The compiled code.
 */
function timerToString(timerLiteral: t.TimerLiteral): string {
  return `TIMER #${timerLiteral.value}`;
}

/**
 * Compiles a Literal into code.
 *
 * @param literal - The object to compile.
 * @returns The compiled code.
 */
function literalToString(literal: t.Literal): string {
  switch (literal.type) {
    case 'number':
      return numberToString(literal);
    case 'boolean':
      return booleanToString(literal);
    case 'timer':
    default:
      return timerToString(literal);
  }
}

/**
 * Compiles an Identifier into code.
 *
 * @param identifier - The object to compile.
 * @returns The compiled code.
 */
function identifierToString(identifier: t.Identifier): string {
  return identifier.value;
}

/**
 * Compiles ExpressionMember into code.
 *
 * @param expressionMember - The object to compile.
 * @returns The compiled code.
 */
function expressionMemberToString(expressionMember: t.ExpressionMember) {
  if (isLiteral(expressionMember.type)) {
    return literalToString(expressionMember as t.Literal);
  }
  return identifierToString(expressionMember as t.Identifier);
}

/**
 * Compiles Arguments into code.
 *
 * @param args - The object to compile.
 * @returns The compiled code.
 */
function argumentsToString(args: t.Arguments): string {
  let re = '';
  args.forEach((arg) => {
    re += `${expressionTypeToString(arg)},`;
  });
  return re.substring(0, re.length - 1);
}

/**
 * Compiles a CallExpression into code.
 *
 * @param callExpression - The object to compile.
 * @returns The compiled code.
 */
function callExpressionToString(callExpression: t.CallExpression): string {
  return `${identifierToString(callExpression.value)}(${argumentsToString(
    callExpression.arguments,
  )})`;
}

/**
 * Compiles PureExpression into code.
 *
 * @param pureExpression - The object to compile.
 * @returns The compiled code.
 */
function pureExpressionToString(pureExpression: t.PureExpression): string {
  let re = `${expressionTypeToString(pureExpression.value.left)} ${
    pureExpression.value.op
  } `;
  if (pureExpression.value.right.type === 'expression') {
    re += pureExpressionToString(pureExpression.value.right);
  } else {
    re += expressionTypeToString(pureExpression.value.right);
  }
  return re;
}

/**
 * Compiles ExpressionBlock into code.
 *
 * @param expressionBlock - The object to compile.
 * @returns The compiled code.
 */
function expressionBlockToString(expressionBlock: t.ExpressionBlock): string {
  return `(${pureExpressionToString(expressionBlock.value)})`;
}

/**
 * Compiles ExpressionType into code.
 *
 * @param expressionType - The object to compile.
 * @returns The compiled code.
 */
function expressionTypeToString(expressionType: t.ExpressionType): string {
  if (expressionType.type === 'call_expression') {
    return callExpressionToString(expressionType);
  }
  if (expressionType.type === 'expression_block') {
    return expressionBlockToString(expressionType);
  }
  return expressionMemberToString(expressionType);
}

/**
 * Compiles an Assignment into code.
 *
 * @param assignment - The object to compile.
 * @returns The compiled code.
 */
function assignmentToString(assignment: t.Assignment): string {
  let target = '';
  if (assignment.target.type === 'call_expression') {
    target = callExpressionToString(assignment.target);
  } else {
    target = identifierToString(assignment.target);
  }
  return `${target} = ${expressionToString(assignment.value)}`;
}

/**
 * Compiles an IsExpression into code.
 *
 * @param isExpression - The object to compile.
 * @returns The compiled code.
 */
function isExpressionToString(isExpression: t.IsExpression): string {
  let target = '';
  if (isExpression.target.type === 'call_expression') {
    target = callExpressionToString(isExpression.target);
  } else {
    target = identifierToString(isExpression.target);
  }
  return `${target} IS ${expressionToString(isExpression.value)}`;
}

/**
 * Compiles an AsExpression into code.
 *
 * @param asExpression - The object to compile.
 * @returns The compiled code.
 */
function asExpressionToString(asExpression: t.AsExpression): string {
  let target = '';
  if (asExpression.target.type === 'call_expression') {
    target = callExpressionToString(asExpression.target);
  } else {
    target = identifierToString(asExpression.target);
  }
  return `${target} AS ${identifierToString(asExpression.value)}`;
}

/**
 * Compiles an Expression into code.
 *
 * @param expression - The object to compile.
 * @returns The compiled code.
 */
function expressionToString(expression: t.Expression): string {
  switch (expression.type) {
    case 'is_expression':
      return isExpressionToString(expression);
    case 'expression':
      return pureExpressionToString(expression);
    default:
      return expressionTypeToString(expression);
  }
}

/**
 * Compiles a Variable into code.
 *
 * @param variable - The object to compile.
 * @returns The compiled code.
 */
function variableToString(variable: t.Variable) {
  if (variable.type === 'call_expression') {
    return callExpressionToString(variable);
  }
  return expressionMemberToString(variable);
}

/**
 * Compiles a Statement into code.
 *
 * @param statement - The object to compile.
 * @returns The compiled code.
 */
function statementToString(statement: t.Statement): string {
  switch (statement.type) {
    case 'sensitivity':
      return sensitivityToString(statement);
    case 'title':
      return titleToString(statement);
    case 'file':
      return fileToString(statement);
    case 'block':
      return blockToString(statement);
    case 'conditional_block':
      return conditionalBlockToString(statement);
    case 'alias':
      return aliasToString(statement);
    case 'plotfil':
      return plotfilToString(statement);
    case 'user_evt':
      return userEvtToString(statement);
    case 'function':
      return functionToString(statement);
    case 'set_timer':
      return setTimerToString(statement);
    case 'lookup_variable':
    default:
      return lookupToString(statement);
  }
}

/**
 * Compiles an SensitivityStatement into code.
 *
 * @param sensitivityStatement - The object to compile.
 * @returns The compiled code.
 */
function sensitivityToString(
  sensitivityStatement: t.SensitivityStatement,
): string {
  return `SENSITIVITY ${sensitivityStatement.value}`;
}

/**
 * Compiles a TitleStatement into code.
 *
 * @param titleStatement - The object to compile.
 * @returns The compiled code.
 */
function titleToString(titleStatement: t.TitleStatement): string {
  return `TITLE\n${titleStatement.value || ''}\nEND`;
}

/**
 * Compiles a FileStatement into code.
 *
 * @param fileStatement - The object to compile.
 * @returns The compiled code.
 */
function fileToString(fileStatement: t.FileStatement): string {
  return `${fileStatement.fileType} ${fileStatement.value}`;
}

/**
 * Compiles a BlockStatement into code.
 *
 * @param blockStatement - The object to compile.
 * @returns The compiled code.
 */
function blockToString(blockStatement: t.BlockStatement): string {
  return `${blockStatement.blockType}\n${blockStatement.value
    .map((sourceElement) => sourceElementToString(sourceElement))
    .join('\n')}\nEND`;
}

/**
 * Compiles a ConditionalBlockStatement into code.
 *
 * @param conditionalBlockStatement - The object to compile.
 * @returns The compiled code.
 */
function conditionalBlockToString(
  conditionalBlockStatement: t.ConditionalBlockStatement,
): string {
  return `${conditionalBlockStatement.blockType} ${expressionToString(
    conditionalBlockStatement.test,
  )}\n${conditionalBlockStatement.value
    .map((sourceElement) => sourceElementToString(sourceElement))
    .join('\n')}\nEND`;
}

/**
 * Compiles an AliasStatement into code.
 *
 * @param aliasStatement - The object to compile.
 * @returns The compiled code.
 */
function aliasToString(aliasStatement: t.AliasStatement): string {
  return `ALIAS\n${aliasStatement.value
    .map((aliasBody) => asExpressionToString(aliasBody))
    .join('\n')}\nEND`;
}

/**
 * Compiles a PlotFilStatement into code.
 *
 * @param plotfilStatement - The object to compile.
 * @returns The compiled code.
 */
function plotfilToString(plotfilStatement: t.PlotFilStatement): string {
  return `PLOTFIL ${plotfilStatement.n}\n${plotfilStatement.value
    .map((plotFilBody) =>
      plotFilBody
        .map((plotFilList) => {
          if (plotFilList.type === 'call_expression') {
            return callExpressionToString(plotFilList);
          }
          return expressionMemberToString(plotFilList);
        })
        .join(','),
    )
    .join('\n')}\nEND`;
}

/**
 * Compiles a UserEvtStatement into code.
 *
 * @param userEvtStatement - The object to compile.
 * @returns The compiled code.
 */
function userEvtToString(userEvtStatement: t.UserEvtStatement) {
  return `USEREVT\n${userEvtBodyToString(userEvtStatement.value)}\nEND`;
}

/**
 * Compiles a UserEvtBody into code.
 *
 * @param userEvtBody - The object to compile.
 * @returns The compiled code.
 */
function userEvtBodyToString(userEvtBody: t.UserEvtElement[]): string {
  return userEvtBody
    .map((userEvtElement) => {
      if (userEvtElement.type === 'parameter') {
        return parameterToString(userEvtElement);
      }
      if (userEvtElement.type === 'action') {
        return actionToString(userEvtElement);
      }
      return sourceElementToString(userEvtElement);
    })
    .join('\n');
}

/**
 * Compiles an ActionStatement into code.
 *
 * @param actionStatement - The object to compile.
 * @returns The compiled code.
 */
function actionToString(actionStatement: t.ActionStatement): string {
  return `ACTION #${actionStatement.index}\n${userEvtBodyToString(
    actionStatement.value,
  )}\nEND`;
}

/**
 * Compiles a FunctionStatement into code.
 *
 * @param functionStatement - The object to compile.
 * @returns The compiled code.
 */
function functionToString(functionStatement: t.FunctionStatement): string {
  return `FUNCTION ${identifierToString(
    functionStatement.name,
  )} = ${expressionToString(functionStatement.value)}`;
}

/**
 * Compiles a TimerStatement into code.
 *
 * @param timerStatement - The object to compile.
 * @returns The compiled code.
 */
function setTimerToString(timerStatement: t.TimerStatement): string {
  return `SET ${timerToString(timerStatement.value)}`;
}

/**
 * Compiles an LookupStatement into code.
 *
 * @param lookupStatement - The object to compile.
 * @returns The compiled code.
 */
function lookupToString(lookupStatement: t.LookupStatement): string {
  return `LOOKUP VARIABLE ${variableToString(
    lookupStatement.name,
  )}\n${lookupStatement.value.join('\n')}\nEND`;
}

/**
 * Compiles the given SourceElement object into code.
 *
 * @param sourceElement - The object to compile.
 * @returns The compiled code.
 */
function sourceElementToString(sourceElement: t.SourceElement): string {
  if (isStatement(sourceElement.type)) {
    return statementToString(sourceElement as t.Statement);
  }
  if (sourceElement.type === 'assignment') {
    return assignmentToString(sourceElement);
  }
  if (sourceElement.type === 'as_expression') {
    return asExpressionToString(sourceElement);
  }
  return expressionToString(sourceElement as t.Expression);
}

/**
 * Compiles the given Program object into code.
 *
 * @param input - The program to compile.
 * @returns The compiled program.
 */
export default function toString(input: t.Program): string {
  return input.value
    .map((sourceElement) => sourceElementToString(sourceElement))
    .join('\n');
}
