import { setDiagnostics } from "@codemirror/lint";

// Turns the hook's parseError into CodeMirror diagnostics and applies them.
export function applyParseError(view, parseError) {
  if (!view) return;
  let diagnostics = [];
  if (parseError && parseError.line) {
    const doc = view.state.doc;
    const line = doc.line(Math.min(parseError.line, doc.lines));
    diagnostics = [
      { from: line.from, to: line.to, severity: "error", message: parseError.message },
    ];
  }
  view.dispatch(setDiagnostics(view.state, diagnostics));
}