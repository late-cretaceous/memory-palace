import styles from "./TextArea.module.css";
import { useState, useRef, useEffect, useLayoutEffect } from "react";

const TextArea = (props) => {
  const [typedText, setTypedText] = useState("Test Div Test Drive");
  const [displayedText, setDisplayedText] = useState(typedText);
  const [textWidth, setTextWidth] = useState(0);
  const [textAreaFreeze, setTextAreaFreeze] = useState(false);
  const [spaceWidth, setSpaceWidth] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(null);

  const containerRef = useRef(null);

  if (textAreaFreeze) {
    setTimeout(() => {
      setTextAreaFreeze(false);
    }, 17);
  }

  const textAreaWidth = (text) => {
    const trailingSpaces = text.match(/\s+$/);
    const trailingSpacesLength = trailingSpaces
      ? trailingSpaces[0].length * spaceWidth
      : 0;

    const tempElement = document.createElement("span");
    tempElement.style.visibility = "hidden";
    tempElement.style.position = "absolute";
    tempElement.style.whiteSpace = "pre";
    tempElement.classList.add(styles.textAreaTEMPORARY);
    tempElement.textContent = text;

    containerRef.current.appendChild(tempElement);
    const width =
      tempElement.getBoundingClientRect().width +
      trailingSpacesLength +
      spaceWidth;
    containerRef.current.removeChild(tempElement);

    return width;
  };

  useEffect(() => {
    setSpaceWidth(textAreaWidth("_ _") - textAreaWidth("__"));
  }, []);

  useLayoutEffect(() => {
    setTextWidth(textAreaWidth(typedText));
    setDisplayedText(typedText);

    if (cursorPosition !== null) {
      const textarea = containerRef.current.querySelector("textarea");
      window.requestAnimationFrame(() => {
        textarea.selectionStart = cursorPosition;
        textarea.selectionEnd = cursorPosition;
      });
    }
  }, [typedText, spaceWidth]);

  const typeTextHandler = (e) => {
    setTypedText(e.target.value);
    setCursorPosition(e.target.selectionStart);
    setTextAreaFreeze(true);
  };

  return (
    <div ref={containerRef} className={styles.textArea}>
      <textarea
        onInput={typeTextHandler}
        value={displayedText}
        style={{ width: `${textWidth}px` }}
        readOnly={textAreaFreeze}
      />
    </div>
  );
};

export default TextArea;
