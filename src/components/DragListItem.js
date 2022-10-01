import React, { useCallback, useState, useEffect, useRef } from 'react';

const DragListItem = ({
  listItem,
  labelTextPropName,
  labelIdPropName,
  onRowClickHandler,
  selectedList,
  onMouseDownHandler,
  onMouseUpHandler,
  onDragHandler,
  isDragging,
  renderDragHandle
}) => {
  const [isSelected, setSelected] = useState(!!selectedList[listItem[labelIdPropName]]);
  const draggableRef = useRef(false);

  // useEffect(() => {
  //   setSelected(selectedList[listItem[labelIdPropName]]);
  // }, [selectedList[listItem[labelIdPropName]]]);

  const onRowClick = useCallback((internalSelectItem = null) => {
    const isSelectedOnCLick = internalSelectItem !== null ? !isSelected : internalSelectItem;
    setSelected(isSelectedOnCLick);
    onRowClickHandler(isSelectedOnCLick, listItem, listItem[labelIdPropName]);
  }, [isSelected, selectedList, onRowClickHandler]);

  const onDrag = useCallback((e) => {
    if (onDragHandler) {
      onDragHandler(e, selectedList);
    }
  }, [selectedList]);

  const onMouseUp = useCallback((e) => {
    if (onMouseUpHandler) {
      onMouseUpHandler(e, selectedList);
    }
    if (draggableRef.current) {
      setSelected(false);
      onRowClickHandler(false, listItem, listItem[labelIdPropName]);
      draggableRef.current = false;
    }
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onMouseUp);

    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', onMouseUp);
  }, [selectedList, onMouseUpHandler]);

  const onMouseDown = useCallback(
    (e) => {
      if(e.preventDefault) e.preventDefault();
      if (e.nativeEvent.which === 1 || e.button === 0) {
        if (onMouseDownHandler) {
          onMouseDownHandler(e);
        }
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', onMouseUp);

        document.addEventListener('touchmove', onDrag);
        document.addEventListener('touchend', onMouseUp);
        if (!draggableRef.current && !selectedList[listItem[labelIdPropName]]) {
          onRowClick(true);
          draggableRef.current = true;
        }
      }
    },
    [onMouseDownHandler]
  );

  const onTouchStartHandler = (e) => {
    if (onMouseDownHandler) {
      onMouseDownHandler(e);
    }
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onMouseUp);

    document.addEventListener('touchmove', onDrag);
    document.addEventListener('touchend', onMouseUp);
  }

  const renderDragHandleContainer = () => {
    if (renderDragHandle) {
      return (
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStartHandler}
        >
          {renderDragHandle}
        </div>
      )
    }
    return <></>;
  }

  const attachMouseDownEvents = {};

  if (!renderDragHandle) {
    attachMouseDownEvents.onMouseDown = onMouseDown;
    attachMouseDownEvents.onTouchStart = onTouchStartHandler;
  }

  return (
    <div
      id={listItem[labelIdPropName]}
      className={`drag-list-item${!!selectedList[listItem[labelIdPropName]] ? ` drag-list-item-selected${isDragging ? ' drag-list-item-dragging' : ''}` : ''}`}
      onClick={onRowClick}
      { ...attachMouseDownEvents }
      
    >
      {renderDragHandleContainer()}
      {listItem[labelTextPropName]}
    </div>
  );
};

export default DragListItem;
