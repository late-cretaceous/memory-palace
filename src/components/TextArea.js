import styles from "./TextArea.module.css";
import { useState, useRef, useEffect, useLayoutEffect } from "react";

const TextArea = () => {
  const [typedText, setTypedText] = useState("Test Div Test Drive");
  const [displayedText, setDisplayedText] = useState(typedText);
  const [textWidth, setTextWidth] = useState(0);
  const [spaceWidth, setSpaceWidth] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(null);
  console.log(textWidth);
  console.log(`[${typedText}]`);

  const containerRef = useRef(null);

  const textAreaWidth = (text) => {
    const trailingSpaces = text.match(/\s+$/);
    const trailingSpacesLength = trailingSpaces
      ? trailingSpaces[0].length * spaceWidth
      : 0;
  
    console.log(trailingSpacesLength);
  
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
      const textarea = containerRef.current.querySelector('textarea');
      window.requestAnimationFrame(() => {
        textarea.selectionStart = cursorPosition;
        textarea.selectionEnd = cursorPosition;
      });
    }
  }, [typedText, spaceWidth, cursorPosition]);

  const typeTextHandler = (e) => {
    console.log(`e.target.value: ${e.target.value}`);
    setTypedText(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  return (
    <div ref={containerRef}>
      <textarea
        className={styles.textArea}
        onChange={typeTextHandler}
        value={displayedText}
        style={{ width: `${textWidth}px` }}
      />
    </div>
  );
};

export default TextArea;
