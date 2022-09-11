import React, { useState, useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import DragListItem from './DragListItem';

const DragListContainer = forwardRef(
  (
    {
      listData,
      labelTextPropName = 'text',
      labelIdPropName = 'id',
      renderDragTextComponent,
      onDragStart,
      onDragStop,
      onDragging
    },
    ref
  ) => {
    const dragContainerRef = useRef(null);
    const [selectedList, setSelectedList] = useState({});
    const [pageCoOrdinates, setPageCoOrdinates] = useState(null);
    const initPosRef = useRef(null);
    const isDragStart = useRef(false);
    const dropElemContainer = useRef(null);

    useImperativeHandle(ref, () => ({
      getDragPosition: () => {
        return {
          pageCoOrdinates
        };
      },
      setDropElement: (elem) => {
        dropElemContainer.current = elem;
      }
    }));

    const updatedSelectedList = (selectedListData) => {
      let selectedData = [];
      if (Object.keys(selectedListData).length) {
        const selectedDataKeys = Object.keys(selectedListData);
        selectedData = selectedDataKeys.map((selectedObj) => {
          return selectedListData[selectedObj];
        });
      }
      return selectedData;
    };

    const onRowClickHandler = (isSelected, selectedItem, idVal) => {
      if (selectedList[idVal]) {
        delete selectedList[idVal];
      } else {
        selectedList[idVal] = selectedItem;
      }
      setSelectedList(selectedList);
    };

    const onMouseDownHandler = (e) => {
      const { pageX, pageY } = e;
      initPosRef.current = { pageX, pageY };
    };

    const onMouseUpHandler = (e, selectedListData) => {
      initPosRef.current = null;
      isDragStart.current = false;
      setPageCoOrdinates(null);
      onDragStop(dropElemContainer.current, updatedSelectedList(selectedListData));
      dropElemContainer.current = null;
    };

    const onDragHandler = (e, selectedListData) => {
      const { pageX, pageY } = e;
      if (initPosRef.current) {
        const { pageX: initPageX, pageY: initPageY } = initPosRef.current;
        if (
          !isDragStart.current &&
          (Math.abs(initPageX - pageX) > 5 || Math.abs(initPageY - pageY) > 5)
        ) {
          isDragStart.current = true;
          if (onDragStart) {
            onDragStart(e, isDragStart.current, updatedSelectedList(selectedListData));
          }
        }
      }

      setPageCoOrdinates({
        pageX,
        pageY
      });
      if (onDragging) {
        onDragging(e);
      }
      const mostNestedElement = document.elementFromPoint(e.clientX, e.clientY);
    };

    const renderDragListItem = useMemo(() => {
      return listData.map((listItem) => {
        return (
          <DragListItem
            key={listItem[labelIdPropName]}
            listItem={listItem}
            labelTextPropName={labelTextPropName}
            labelIdPropName={labelIdPropName}
            onRowClickHandler={onRowClickHandler}
            selectedList={selectedList}
            onMouseDownHandler={onMouseDownHandler}
            onMouseUpHandler={onMouseUpHandler}
            onDragHandler={onDragHandler}
          />
        );
      });
    }, [listData]);

    return (
      <>
        <div ref={dragContainerRef} className="drag-list-container">
          {renderDragListItem}
        </div>
        {!!isDragStart.current && (
          <div
            style={{
              opacity: !!isDragStart.current ? 1 : 0,
              left: pageCoOrdinates.pageX - 20,
              top: pageCoOrdinates.pageY - 20
            }}
            className="draggable-move-container"
          >
            {renderDragTextComponent()}
          </div>
        )}
      </>
    );
  }
);
export default DragListContainer;
