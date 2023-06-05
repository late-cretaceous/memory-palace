import { useRef, useEffect } from "react";

const ExtraFlex = ({ children, measure, ...attributeProps }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const spacing = 20;

    const childArray = Array.from(containerRef.current.children);

    const totalHeight = childArray.reduce((acc, child) => {
      if (measure) {
        return acc + child[measure].offsetHeight;
      }
      return acc + child.offsetHeight;
    }, 0);

    containerRef.current.style.height = `${
      totalHeight + spacing * (children.length - 1)
    }px`;
  }, [children, measure]);

  return (
    <ul ref={containerRef} {...attributeProps}>
      {children}
    </ul>
  );
};

export default ExtraFlex;
