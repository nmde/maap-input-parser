{
	function extractList(list, index) {
    	return list.map(i => i[index]);
    }
}

Start = __ program:Program __ {
	return program;
}

/* Lexical Grammar */
SourceCharacter = .
FreeCharacter = !LineTerminator SourceCharacter
WhiteSpace = "\t" / "\v" / "\f" / " " / "\u00A0" / "\uFEFF"
LineTerminator = [\n\r\u2028\u2029]
LineTerminatorSequence = "\n" / "\r\n" / "\r" / "\u2028" / "\u2029"
Comment = SingleLineComment
CommentIndicator = "//" / "!" / "C " / "**"
SingleLineComment = CommentIndicator v:FreeCharacter*
IdentifierStart = [a-zA-Z] / "$" / "_" / "\\"
Literal = BooleanLiteral / NumericLiteral / TimerLiteral
Units = first:[a-zA-Z0-9]+ rest:(("**" / "/") Units)? {
	let units = first.join('');
    if (rest) {
    	units += rest[0] + rest[1];
    }
    return units;
}
NumericLiteral = literal:DecimalLiteral !(IdentifierStart / DecimalDigit) units:(_ Units)? {
	return {
    	location: location(),
    	type: "number",
        units: (units || [])[1],
        value: literal,
    }
}
DecimalLiteral = DecimalIntegerLiteral "." DecimalDigit* ExponentPart? {
	return parseFloat(text());
}
	/ "." DecimalDigit+ ExponentPart? {
    return parseFloat(text());
}
	/ DecimalIntegerLiteral ExponentPart? {
    return parseFloat(text());
}
DecimalIntegerLiteral = "0" / NonZeroDigit DecimalDigit*
DecimalDigit = [0-9]
NonZeroDigit = [1-9]
ExponentPart = ExponentIndicator SignedInteger
ExponentIndicator = "e"i
SignedInteger = [+-]? DecimalDigit+
BooleanLiteral = v:(TRUE / FALSE / T / F) ![a-zA-Z] {
	let value = v === 'TRUE' || v === 'T';
	return {
    	location: location(),
    	type: "boolean",
        value,
    }
}
Reserved = (END / IS / AS) ![a-zA-Z]
Identifier = !Reserved head:[a-zA-Z0-9:]+ tail:(" " Identifier)? {
	let value = head.join('');
    if (tail) {
    	value += " " + tail[1].value;
    }
	return {
    	location: location(),
    	type: "identifier",
        value,
    }
}
Parameter = index:[0-9]+ _ flag:(BooleanLiteral _)? value:FreeCharacter* {
	return {
    	flag: (flag || [])[0],
        location: location(),
        index: Number(index.join('')),
    	type: "parameter",
        value: extractList(value, 1).join('').trim(),
    }
}
TimerLiteral = TIMER _ "#"? n:[0-9]+ {
	return {
    	location: location(),
    	type: "timer",
        value: Number(n.join('')),
    }
}

ACTION = "ACTION"i
ALIAS = "ALIAS"i
AS = "AS"i
END = "END"i !" TIME"i
F = "F"i
FALSE = "FALSE"i
FUNCTION = "FUNCTION"i
INCLUDE = "INCLUDE"i
INITIATORS = "INITIATOR"i "S"i? {
	return "INITIATORS";
}
IF = "IF"i
IS = "IS"i
LOOKUP_VARIABLE = "LOOKUP VARIABLE"i
OFF = "OFF"i
ON = "ON"i
PARAMETER_CHANGE = "PARAMETER CHANGE"i
PARAMETER_FILE = "PARAMETER FILE"i
PLOTFIL = "PLOTFIL"i
SENSITIVITY = "SENSITIVITY"i
SET = "SET"i
SI = "SI"i
T = "T"i
TIMER = "TIMER"
TITLE = "TITLE"i
TRUE = "TRUE"i
USEREVT = "USEREVT"i
WHEN = "WHEN"i

__ = (WhiteSpace / LineTerminatorSequence / Comment)*
_ = WhiteSpace*

/* Expressions */
ExpressionMember = value:(Literal / Identifier) {
	return value;
}
Arguments = value:ExpressionType rest:(_ "," _ Arguments)? {
	let args = [value];
    if (rest) {
    	args = args.concat(rest[3]);
    }
	return args;
}
CallExpression = value:Identifier _ "(" args:Arguments? ")" {
	return {
    	arguments: args || [],
        location: location(),
    	type: "call_expression",
        value,
    }
}
ExpressionOperator = "**" / "*" / "/" / ">=" / "<=" / ">" / "<" / "+" / "-"
Expression = left:ExpressionType _ op:ExpressionOperator _ right:(Expression / ExpressionType) {
	return {
    	location: location(),
    	type: "expression",
        value: {
        	left,
            op,
            right,
        },
    }
}
ExpressionBlock = "(" value:Expression ")" {
	return {
    	location: location(),
    	type: "expression_block",
        value,
    }
}
ExpressionType = CallExpression / ExpressionBlock / ExpressionMember
Assignment = target:(CallExpression / Identifier) _ "=" _ value:Expr {
	return {
    	location: location(),
    	target,
    	type: "assignment",
        value,
    }
}
IsExpression = target:(CallExpression / Identifier) _ IS _ value:Expr {
	return {
    	location: location(),
    	target,
    	type: "is_expression",
        value,
    }
}
AsExpression = target:(CallExpression / Identifier) _ AS _ value:Identifier {
	return {
    	location: location(),
    	target,
    	type: "as_expression",
        value,
    }
}
Expr = IsExpression / Expression / ExpressionType
Variable = CallExpression / ExpressionMember

/* Statements */
Statement = value:(SensitivityStatement
	/ TitleStatement
    / FileStatement
    / BlockStatement
    / ConditionalBlockStatement
    / AliasStatement
    / PlotFilStatement
    / UserEvtStatement
    / FunctionStatement
    / TimerStatement
    / LookupStatement) {
    return {
    	location: location(),
        ...value,
    }
}
SensitivityStatement = SENSITIVITY __ value:(ON / OFF) {
	return {
    	location: location(),
    	type: "sensitivity",
        value,
    }
}
TitleStatement = TITLE __ value:TitleBlock? __ END {
	return {
    	type: "title",
        value,
    }
}
TitleBlock = !END first:FreeCharacter+ rest:(__ TitleBlock)? {
	let title = extractList(first, 1).join('');
    if (rest) {
    	title += '\n' + rest[1];
    }
	return title;
}
FileStatement = fileType:(PARAMETER_FILE / INCLUDE) _ v:FreeCharacter+ {
	return {
    	fileType,
    	type: "file",
        value: extractList(v, 1).join(''),
    }
}
BlockStatement = blockType:(PARAMETER_CHANGE / INITIATORS) __ value:SourceElements? __ END {
	return {
    	blockType,
        type: "block",
        value: value || [],
    }
}
ConditionalBlockStatement = blockType:(WHEN / IF) _ test:Expr __ value:SourceElements? __ END {
	return {
    	blockType,
    	test,
    	type: "conditional_block",
        value: value || [],
    }
}
AliasStatement = ALIAS __ value:AliasBody? __ END {
	return {
    	type: "alias",
        value: value || [],
    }
}
AliasBody = head:AsExpression tail:(__ AsExpression)* {
	return [head].concat(extractList(tail, 1));
}
PlotFilStatement = PLOTFIL _ n:[0-9]+ __ value:PlotFilBody? __ END {
	return {
    	n: Number(n.join('')),
    	type: "plotfil",
        value: value || [],
    }
}
PlotFilList = head:(CallExpression / ExpressionMember) tail:(_ "," _ PlotFilList)* {
	let value = [head];
    if (tail && tail.length > 0) {
    	value = value.concat(extractList(tail, 3)[0]);
    }
	return value;
}
PlotFilBody = head:PlotFilList tail:(__ PlotFilBody)* {
	let value = [head];
    if (tail && tail.length > 0) {
    	value = value.concat(extractList(tail, 1)[0]);
    }
	return value;
}
UserEvtStatement = USEREVT __ value:UserEvtBody? __ END {
	return {
    	type: "user_evt",
        value: value || [],
    }
}
UserEvtBody = head:UserEvtElement tail:(__ UserEvtElement)* {
	return [head].concat(extractList(tail, 1));
}
UserEvtElement = Parameter / ActionStatement / SourceElement
ActionStatement = ACTION _ "#" n:[0-9]+ __ value:UserEvtBody? __ END {
	return {
    	index: Number(n.join('')),
        location: location(),
    	type: "action",
        value: value || [],
    }
}
FunctionStatement = FUNCTION _ name:Identifier _ "=" _ value:Expr {
	return {
    	name,
    	type: "function",
        value,
    }
}
TimerStatement = SET _ value:TimerLiteral {
	return {
    	type: "set_timer",
        value,
    }
}
LookupStatement = LOOKUP_VARIABLE _ name:Variable __ value:LookupBody? __ END {
	return {
		name,
    	type: "lookup_variable",
        value,
    }
}
LookupBody = !Reserved head:FreeCharacter+ tail:(__ LookupBody)* {
	let value = [extractList(head, 1).join('')];
    if (tail && tail.length > 0) {
    	value = value.concat(extractList(tail, 1)[0]);
    }
	return value;
}

/* Program blocks */
Program = value:SourceElements? {
	return {
    	type: "program",
        value: value || [],
    }
}
SourceElements = head:SourceElement tail:(__ SourceElement)* {
	return [head].concat(extractList(tail, 1));
}
SourceElement = Statement / Assignment / AsExpression / Expr
