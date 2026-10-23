import { useState, useRef, useEffect } from "react";
import { EXAMPLES } from "../lib/examples.js";
import "./ExamplesMenu.css";

function ExamplesMenu({ onSelectExample }) {
  const [open, setOpen] = useState(false);

  // A ref gives us direct access to the real DOM element, which we need
  // below to ask "was this click inside the menu or outside it?"
  const wrapperRef = useRef(null);

  // While the menu is open, close it when the user presses anywhere outside it.
  // useEffect is for syncing with things outside React, like listeners on
  // `document`. The function it returns is cleanup: React runs it when the
  // menu closes (or unmounts), so we never leave a stray listener behind.
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function handleSelect(example) {
    onSelectExample(example.qasm);
    setOpen(false);
  }

  return (
    <div
      className="nav-dropdown"
      ref={wrapperRef}
      onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}
    >
      <button
        type="button"
        className="nav-dropdown-toggle"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        examples
      </button>

      { open && (
        <div className="nav-dropdown-menu">
          {EXAMPLES.map(example => (
            <button
              type="button"
              key={example.name}
              onClick={() => handleSelect(example)}
            >
              {example.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExamplesMenu;