// lib/qasmLanguage.js
//
// Syntax highlighting for OpenQASM 2.0 in CodeMirror 6.
// StreamLanguage reads the text one line at a time. For each chunk, the
// token() function consumes some characters from the stream and returns a
// token name; CodeMirror maps that name to a highlight style.
//
// Gate names come from GATE_INFO so the highlighter and the parser always
// agree on which gates exist.

import { StreamLanguage } from "@codemirror/language";
import { GATE_INFO } from "./QasmParser.js";

const KEYWORDS = new Set(["OPENQASM", "include", "qreg", "creg"]);
const GATES = new Set(Object.keys(GATE_INFO));

const qasmStreamParser = {
  name: "openqasm",

  token(stream) {
    // Whitespace
    if (stream.eatSpace()) return null;

    // Line comment: // ... to end of line
    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    }

    // String literal (used by include "qelib1.inc";)
    if (stream.match(/^"[^"]*"/)) return "string";

    // Numbers: 3, 3.14, .5, 1e-3
    if (stream.match(/^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/)) return "number";

    // Words: keywords, gate names, pi, register names
    if (stream.match(/^[A-Za-z_][A-Za-z0-9_]*/)) {
      const word = stream.current();
      if (KEYWORDS.has(word)) return "keyword";
      if (word === "pi") return "atom";
      if (GATES.has(word)) return "typeName";
      return "variableName";
    }

    // Operators and punctuation
    if (stream.match(/^[+\-*/^]/)) return "operator";
    if (stream.match(/^[;,()[\]]/)) return "punctuation";

    // Anything else: consume one character so we never loop forever
    stream.next();
    return null;
  },
};

export const qasmLanguage = StreamLanguage.define(qasmStreamParser);