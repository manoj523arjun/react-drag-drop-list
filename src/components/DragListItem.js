import React, { useCallback, useState, useEffect, useRef } from 'react';

const DragListItem = ({
  listItem,
  labelTextPropName,
  labelIdPropName,
  onRowClickHandler,
  selectedList,
  onMouseDownHandler,
  onMouseUpHandler,
  onDragHandler
}) => {
  const [isSelected, setSelected] = useState();

  const [isTouchStart, setTouchStart] = useState(false);

  const onRowClick = useCallback(() => {
    setSelected(!isSelected);
    // if (selectedList[listItem[labelIdPropName]]) {
    //     delete selectedList[listItem[labelIdPropName]];
    // } else {
    //     selectedList[listItem[labelIdPropName]] = listItem;
    // }
    onRowClickHandler(!isSelected, listItem, listItem[labelIdPropName]);
  }, [isSelected]);

  const onDrag = (e) => {
    if (onDragHandler) {
      onDragHandler(e, selectedList);
    }
  };

  const onMouseUp = (e) => {
    if (onMouseUpHandler) {
      onMouseUpHandler(e, selectedList);
    }
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onMouseUp);

    // document.removeEventListener('ontouchmove', onDrag);
    // document.removeEventListener('ontouchend', onMouseUp);
  };

  const onMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      if (e.nativeEvent.which === 1 || e.button === 0) {
        if (onMouseDownHandler) {
          onMouseDownHandler(e);
        }
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', onMouseUp);

        document.addEventListener('ontouchmove', onDrag);
        document.addEventListener('ontouchend', onMouseUp);
      }
    },
    [onMouseDownHandler]
  );

  const onTouchStartHandler = (e) => {
    setTouchStart(true);
    // if (onMouseDownHandler) {
    //   onMouseDownHandler(e);
    // }
    // document.addEventListener('mousemove', onDrag);
    // document.addEventListener('mouseup', onMouseUp);

    // document.addEventListener('ontouchmove', onDrag);
    // document.addEventListener('ontouchend', onMouseUp);
  }

  return (
    <div
      id={listItem[labelIdPropName]}
      className={`drag-list-item${isSelected ? ' drag-list-item-selected' : ''}`}
      onClick={onRowClick}
      onMouseDown={onMouseDown}
      // onTouchStart={onTouchStartHandler}
      onTouchStart={onTouchStartHandler}
      onTouchMove={() => setTouchStart("TOUCH_MOVE")}
      onTouchEnd={() => setTouchStart(false)}
    >
      {listItem[labelTextPropName]} {isTouchStart === "TOUCH_MOVE" ? "move" : isTouchStart === true ? "start" : "end"}
    </div>
  );
};

export default DragListItem;
