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
    // setTimeout(() => {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onMouseUp);

    document.removeEventListener('ontouchmove', onDrag);
    document.removeEventListener('ontouchend', onMouseUp);
    // }, 100);
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

  return (
    <div
      id={listItem[labelIdPropName]}
      className={`drag-list-item${isSelected ? ' drag-list-item-selected' : ''}`}
      onClick={onRowClick}
      onMouseDown={onMouseDown}
    >
      {listItem[labelTextPropName]}
    </div>
  );
};

export default DragListItem;
