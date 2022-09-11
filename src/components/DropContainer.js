import React, { useEffect, useRef, useState } from 'react';

const DropContainer = ({ children, className, pageCOrds, dragContainerRef }) => {
  const dropZoneRef = useRef(null);
  const [isEntered, setEntered] = useState(false);
  useEffect(() => {
    const cords = dragContainerRef?.current ? dragContainerRef?.current?.getDragPosition() : null;
    if (!cords.pageCoOrdinates && isEntered) {
      setEntered(false);
    }
    const dropZone = dropZoneRef?.current;
    if (dropZone && cords?.pageCoOrdinates) {
      const { top, bottom, left, right } = dropZone.getBoundingClientRect();
      const { pageX, pageY } = cords.pageCoOrdinates;
      if (pageX >= left && pageX <= right && pageY >= top && pageY <= bottom && !isEntered) {
        setEntered(true);
        dragContainerRef?.current?.setDropElement(dropZoneRef.current);
      } else if (
        !(pageX >= left && pageX <= right && pageY >= top && pageY <= bottom) &&
        isEntered
      ) {
        setEntered(false);
        dragContainerRef?.current?.setDropElement(null);
      }
    }
  }, [dragContainerRef?.current?.getDragPosition()]);
  return (
    <div
      ref={dropZoneRef}
      data-drop="true"
      className={`drop-container${isEntered ? ' drop-container-hover' : ''}${
        className ? ` ${className}` : ''
      }`}
    >
      {children}
    </div>
  );
};

export default DropContainer;
