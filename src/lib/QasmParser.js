// Created 9/18/26. 
// buildGateEntry() by Benjamin Kerr
// Other functions by Claude

// lib/QasmParser.js

const KEYWORDS = new Set(['OPENQASM', 'qreg', 'creg', 'measure', 'include']);

// Matches a gate token like "rx(1.5708)" or "h":
//   group 1 = gate name
//   group 2 = angle expression text (undefined if no parens)
const GATE_TOKEN_RE = /^(\w+)(?:\(([^)]*)\))?$/;

/**
 * Strips OpenQASM line comments ("// ...") from the source.
 * Must happen before splitting on ';', since a comment could
 * itself contain a semicolon.
 */
function stripComments(source) {
    return source
        .split('\n')
        .map(line => {
            const idx = line.indexOf('//');
            return idx === -1 ? line : line.slice(0, idx);
        })
        .join('\n');
}

/**
 * Splits OpenQASM source into an array of clean, non-empty
 * statement strings (comments removed, whitespace trimmed,
 * no trailing/blank entries).
 */
export function parseStatements(source) {
    const withoutComments = stripComments(source);

    return withoutComments
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
}

/**
 * Classifies a single cleaned OpenQASM statement (no trailing ';',
 * already trimmed) into a shape describing its statement type.
 *
 * Returns one of:
 *   { type: 'openqasm', rest: string }
 *   { type: 'qreg', rest: string }
 *   { type: 'noop', keyword: string, rest: string }
 *   { type: 'gate', name: string, angleText: string|null, rest: string }
 *   { type: 'unknown', statement: string }   // couldn't classify at all
 */
export function classifyStatement(statement) {
    const firstSpaceIdx = statement.search(/\s/);
    const firstToken = firstSpaceIdx === -1 ? statement : statement.slice(0, firstSpaceIdx);
    const rest = firstSpaceIdx === -1 ? '' : statement.slice(firstSpaceIdx + 1).trim();

    if (firstToken === 'OPENQASM') {
        return { type: 'openqasm', rest };
    }

    if (firstToken === 'qreg') {
        return { type: 'qreg', rest };
    }

    if (KEYWORDS.has(firstToken)) {
        // creg, measure, include — no-op for now
        return { type: 'noop', keyword: firstToken, rest };
    }

    const gateMatch = firstToken.match(GATE_TOKEN_RE);
    if (gateMatch) {
        const [, name, angleText] = gateMatch;
        return { type: 'gate', name, angleText: angleText ?? null, rest };
    }

    return { type: 'unknown', statement };
}

/**
 * Parses the `rest` of a qreg statement, e.g. "q[2]" -> { name: "q", size: 2 }.
 * Throws if the statement doesn't match the expected "<name>[<int>]" shape.
 */
export function parseQreg(rest) {
    const match = rest.trim().match(/^(\w+)\s*\[\s*(\d+)\s*\]$/);
    if (!match) {
        throw new Error(`Malformed qreg declaration: "qreg ${rest};"`);
    }

    const [, name, sizeText] = match;
    const size = parseInt(sizeText, 10);

    return { name, size };
}

/**
 * Parses a single wire reference, e.g. "q[0]" -> { name: "q", index: 0 }.
 * Same "<name>[<int>]" shape as parseQreg, but referring to one wire
 * of a register rather than declaring the register's size.
 * Throws if the string doesn't match that shape.
 */
export function parseWireRef(wireRefStr) {
    const match = wireRefStr.trim().match(/^(\w+)\s*\[\s*(\d+)\s*\]$/);
    if (!match) {
        throw new Error(`Malformed wire reference: "${wireRefStr}"`);
    }

    const [, name, indexText] = match;
    const index = parseInt(indexText, 10);

    return { name, index };
}

/**
 * Parses a comma-separated list of wire references, e.g.
 * "q[0],q[1]" or "q[0], q[1]" -> [{ name: "q", index: 0 }, { name: "q", index: 1 }].
 * Safe to split on ',' because a single wire ref (per parseWireRef's shape)
 * can never itself contain a comma.
 */
export function parseWireRefList(restStr) {
    return restStr.split(',').map(chunk => parseWireRef(chunk));
}

/**
 * Maps an OpenQASM gate name (lowercase, as written in source) to:
 *   - baseGate: the exact Sim.js property/method name to look up via
 *     Sim[gate.gate] (matches your circuit structure's `gate` field).
 *     Must match Sim.js exactly — e.g. Sim.js has no "S" or "T",
 *     only "SZ" (their equivalent) and "SSZ" (their equivalent).
 *   - numControls: how many of the gate's wire args are controls
 *     (the remaining, final wire arg is always the target).
 *
 * OpenQASM convention: for controlled gates, controls come first in
 * the argument list and the target comes last (e.g. "cx control,target";
 * "ccx control1,control2,target").
 *
 * Only single-target gates (optionally with controls) are supported here,
 * since the current runCircuit() applies one gate matrix to one wire per
 * step (plus controls) — it has no path for genuine two-wire gates like
 * SWAP. Two-wire gate support is a known future extension; until then,
 * "swap" is intentionally left out of this table so it is classified as
 * unsupported rather than silently mishandled.
 */
export const GATE_INFO = {
    // Pauli gates
    x: { baseGate: 'X', numControls: 0 },
    y: { baseGate: 'Y', numControls: 0 },
    z: { baseGate: 'Z', numControls: 0 },

    // Hadamard
    h: { baseGate: 'H', numControls: 0 },

    // Phase gates (Sim.js calls these SZ and SSZ, not S and T)
    s: { baseGate: 'SZ', numControls: 0 },
    t: { baseGate: 'SSZ', numControls: 0 },

    // Rotation gates (parameterized — angleText will be set)
    rx: { baseGate: 'RX', numControls: 0 },
    ry: { baseGate: 'RY', numControls: 0 },
    rz: { baseGate: 'RZ', numControls: 0 },

    // Controlled gates: implemented as the base gate (X) applied to the
    // target wire, with the other wire(s) passed as controls — NOT via
    // Sim.CX, which runCircuit has no path to use.
    cx: { baseGate: 'X', numControls: 1 },   // CNOT
    ccx: { baseGate: 'X', numControls: 2 },   // Toffoli
};

/**
 * Resolves a single token from an angle expression to a number.
 * "pi" -> Math.PI; anything else is parsed as a float.
 * Throws if the token is not "pi" and not a valid number.
 */
function resolveAngleToken(token) {
    if (token === 'pi') {
        return Math.PI;
    }
    const value = parseFloat(token);
    if (Number.isNaN(value)) {
        throw new Error(`Invalid angle expression token: "${token}"`);
    }
    return value;
}

/**
 * Evaluates a limited subset of OpenQASM 2.0 angle expressions and
 * converts the result from radians (OpenQASM's convention) to degrees
 * (the convention Sim.js's RX/RY/RZ expect).
 *
 * Supported syntax:
 *   - plain numbers: "1.5708", "0"
 *   - the constant "pi"
 *   - a single optional leading unary minus: "-pi/2"
 *   - a left-to-right chain of terms separated by '*' or '/' (no '+'/'-'
 *     between terms, and no parentheses or function calls)
 *
 * Examples: "pi" -> 180, "pi/2" -> 90, "pi*3/4" -> 135, "-pi/2" -> -90
 *
 * Throws on anything outside this supported subset (parentheses,
 * function calls, '+'/'-' between terms, malformed tokens, etc.)
 * rather than silently producing a wrong angle.
 */
export function evaluateAngleExpression(expressionText) {
    // Strip ALL whitespace (not just leading/trailing), since operators
    // and operands may be separated by spaces, e.g. "pi / 2".
    let text = expressionText.replace(/\s+/g, '');

    let isNegative = false;
    if (text.startsWith('-')) {
        isNegative = true;
        text = text.slice(1).trim();
    }

    if (text.length === 0) {
        throw new Error(`Empty angle expression: "${expressionText}"`);
    }

    // Reject anything using syntax we don't support, so a malformed or
    // out-of-scope expression fails loudly instead of being misparsed.
    if (/[^\w.*/]/.test(text)) {
        throw new Error(
            `Unsupported angle expression: "${expressionText}" ` +
            `(only numbers, "pi", and chained */ are supported)`
        );
    }

    const tokens = text.split(/([*/])/).map(t => t.trim());

    let result = resolveAngleToken(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const operandValue = resolveAngleToken(tokens[i + 1]);
        if (operator === '*') {
            result *= operandValue;
        } else if (operator === '/') {
            result /= operandValue;
        } else {
            throw new Error(`Unsupported operator in angle expression: "${operator}"`);
        }
    }

    if (isNegative) {
        result = -result;
    }

    const angleInRadians = result;
    const angleInDegrees = angleInRadians / Math.PI * 180;
    return angleInDegrees;
}

/**
 * Builds one circuit gate entry ({ gate, wire, angle, controls }) from
 * a classified gate statement's pieces.
 *
 *   - Look up `gateInfo` (already done for you below) to get baseGate
 *     and numControls.
 *   - Call parseWireRefList(rest) to get the array of wire refs.
 *   - Check the array has exactly (numControls + 1) wires — throw a
 *     clear error if not (e.g. "cx requires 2 wires, got 1").
 *   - Split into controlRefs (all but last) and the target ref (last),
 *     using what we practiced with .slice(0, -1) and .at(-1).
 *   - Build `controls` as an array of [index, true] pairs from controlRefs.
 *   - Compute `angle`: null if angleText is null, otherwise
 *     evaluateAngleExpression(angleText).
 *   - Return { gate: gateInfo.baseGate, wire: target.index, angle, controls }.
 *
 * Validates that every wire ref's `name` matches the
 * declared register name (registerInfo.name) — throws if not.
 */
function buildGateEntry(classifiedGate, registerInfo) {
    const gateInfo = GATE_INFO[classifiedGate.name];
    if (!gateInfo) {
        throw new Error(`Unsupported gate: "${classifiedGate.name}"`);
    }

    let arr = parseWireRefList(classifiedGate.rest);
    let controlRefs = arr.slice(0, -1);
    let targetRef;
    let controls;
    let angle;

    if (!arr.every(ref => ref.name === registerInfo.name)) {
        throw new Error(
            `Gate "${classifiedGate.name}" references undeclared register ` +
            `(expected "${registerInfo.name}", got wire ref(s): ${arr.map(r => r.name).join(', ')})`
        );
    }

    if (arr.length === (gateInfo.numControls + 1)) {
        targetRef = arr.at(-1);
        controls = controlRefs.map(ref => [ref.index, true]);
        if (classifiedGate.angleText) {
            angle = evaluateAngleExpression(classifiedGate.angleText)
        }
        else {
            angle = null;
        }
    }
    else { throw new Error('cx requires ' + (gateInfo.numControls + 1) + 'wires, but got ' + arr.length + '.') }

    return { gate: gateInfo.baseGate, wire: targetRef.index, angle, controls }
}

/**
 * Parses a full OpenQASM 2.0 source string into a circuit object:
 *   { numQubits: <int>, gates: [ { gate, wire, angle, controls }, ... ] }
 *
 * Throws a descriptive Error on any problem (malformed statement,
 * missing/duplicate qreg, gate referencing an undeclared register,
 * gate appearing before qreg, unsupported gate name, etc.) — callers
 * (eventually, UI code behind a "Run" button) are expected to catch
 * this and display the message rather than let it crash the app.
 */
export function parseCircuit(source) {
    const statements = parseStatements(source);

    let registerInfo = null; // { name, size }, set once qreg is seen
    const gates = [];

    for (const statement of statements) {
        const classified = classifyStatement(statement);

        switch (classified.type) {
            case 'openqasm': {
                // Version check intentionally lenient for now — just no-op.
                break;
            }

            case 'qreg': {
                if (registerInfo !== null) {
                    throw new Error(
                        `Duplicate qreg declaration: "qreg ${classified.rest};" ` +
                        `(register "${registerInfo.name}" was already declared)`
                    );
                }
                registerInfo = parseQreg(classified.rest);
                break;
            }

            case 'noop': {
                // creg, measure, include — intentionally not yet supported.
                break;
            }

            case 'gate': {
                if (registerInfo === null) {
                    throw new Error(
                        `Gate statement "${statement}" appears before any qreg declaration`
                    );
                }
                gates.push(buildGateEntry(classified, registerInfo));
                break;
            }

            case 'unknown': {
                throw new Error(`Could not parse statement: "${classified.statement}"`);
            }

            default: {
                // Should be unreachable given classifyStatement's return shape.
                throw new Error(`Unhandled statement type: "${classified.type}"`);
            }
        }
    }

    if (registerInfo === null) {
        throw new Error('No qreg declaration found in source');
    }

    return { numQubits: registerInfo.size, gates };
}