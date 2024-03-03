import styles from "./TextArea.module.css";
import { useState, useRef, useEffect, useLayoutEffect } from "react";

const TextArea = ({
  trail = 0,
  containerHover = false,
  inputHandler,
  text,
  placeholder,
  autofocus = true,
}) => {
  const [typedText, setTypedText] = useState(placeholder);
  const [displayedText, setDisplayedText] = useState(typedText);
  const [textWidth, setTextWidth] = useState(0);
  const [textAreaFreeze, setTextAreaFreeze] = useState(false);
  const [spaceWidth, setSpaceWidth] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef(null);

  if (textAreaFreeze) {
    setTimeout(() => {
      setTextAreaFreeze(false);
    }, 17);
  }

  useEffect(() => {
    setSpaceWidth(pureTextAreaWidth("_ _") - pureTextAreaWidth("__"));

    autofocus && containerRef.current.querySelector("textarea").focus();    
  }, []);

  useEffect(() => {
    setTypedText(text);
  }, [text]);

  const moveCursor = (position) => {
    const textarea = containerRef.current.querySelector("textarea");
    window.requestAnimationFrame(() => {
      textarea.selectionStart = position;
      textarea.selectionEnd = position;
    });
  };

  useLayoutEffect(() => {
    setTextWidth(textComponentWidth(typedText, trail));
    setDisplayedText(typedText);

    if (cursorPosition !== null) {
      moveCursor(cursorPosition);
    }
  }, [typedText, spaceWidth]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setContainerWidth(entry.contentRect.width);
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const cleanUpRef = containerRef.current;
    return () => {
      if (cleanUpRef) {
        observer.unobserve(cleanUpRef);
      }
      observer.disconnect();
    };
  }, []);

  const pureTextAreaWidth = (text) => {
    const textOrPlaceholder = text ? text : placeholder;
    const tempElement = document.createElement("span");
    tempElement.style.visibility = "hidden";
    tempElement.style.position = "absolute";
    tempElement.style.whiteSpace = "pre";
    tempElement.classList.add(styles.textArea);
    tempElement.textContent = textOrPlaceholder;

    containerRef.current.appendChild(tempElement);
    const width = parseFloat(getComputedStyle(tempElement).width);
    containerRef.current.removeChild(tempElement);

    return width;
  };

  const textComponentWidth = (text, trail) => {
    const trailArea = trail > spaceWidth ? trail : spaceWidth;

    return pureTextAreaWidth(text) + trailArea;
  };

  const typeTextHandler = (e) => {
    inputHandler(e.target.value);
    setCursorPosition(e.target.selectionStart);
    setTextAreaFreeze(true);
  };

  const clickToTypeHandler = (e) => {
    setIsTyping(true);
    moveCursor(e.target.value.length);
  };

  return (
    <div ref={containerRef}>
      <div
        className={`${styles.textHighlight} ${
          isTyping ? styles.highlighted : containerHover ? styles.buttoned : ""
        } `}
        style={{
          width: `${textWidth}px`,
          padding: `0 ${spaceWidth * 2}px 0 0.75rem`,
        }}
      >
        <textarea
          className={styles.textArea}
          onInput={typeTextHandler}
          value={displayedText}
          style={{
            width: `${textWidth}px`,
            maxWidth: `${textWidth >= containerWidth ? "100%" : "none"}`,
          }}
          readOnly={textAreaFreeze}
          onFocus={clickToTypeHandler}
          onBlur={() => setIsTyping(false)}
          rows={textWidth < containerWidth ? 1 : 2}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TextArea;
