import React, { useState, useRef, forwardRef, useImperativeHandle, useMemo, useEffect } from 'react';
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
      onDragging,
      renderDragHandle = null,
      selectedListItems
    },
    ref
  ) => {
    const convertArrToObj = () => {
      return selectedListItems.reduce((initObj, selectedItem) => {
        initObj[selectedItem[labelIdPropName]] = selectedItem;
        return initObj;
      }, {});
    };

    const dragContainerRef = useRef(null);
    const [selectedList, setSelectedList] = useState(convertArrToObj());
    const [pageCoOrdinates, setPageCoOrdinates] = useState(null);
    const initPosRef = useRef(null);
    const isDragStart = useRef(false);
    const dropElemContainer = useRef(null);

    useEffect(() => {
      setSelectedList(convertArrToObj());
    }, [selectedListItems]);

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
      let pageX, pageY;
      if (e.type.includes("touch")) {
        const { touches } = e;
        pageX = touches[0].pageX;
        pageY = touches[0].pageY;
      } else {
        pageX = e.pageX;
        pageY = e.pageY;
      }
      initPosRef.current = { pageX, pageY };
    };

    const onMouseUpHandler = async (e, selectedListData, currentDrgaItem) => {
      const prevSelectedData = { ...selectedListData };
      // if (currentDrgaItem && !dropElemContainer.current) {
      //   delete prevSelectedData[currentDrgaItem[labelIdPropName]];
      //   await setSelectedList(prevSelectedData);
      // }
      if (isDragStart.current && onDragStop && dropElemContainer.current) {
        onDragStop(dropElemContainer.current, updatedSelectedList(prevSelectedData));
      }
      dropElemContainer.current = null;
      initPosRef.current = null;
      isDragStart.current = false;
      setPageCoOrdinates(null);
    };

    const onDragHandler = async (e, selectedListData, currentDrgaItem) => {
      let pageX, pageY;
      if (e.type.includes("touch")) {
        const { touches } = e;
        pageX = touches[0].pageX;
        pageY = touches[0].pageY;
      } else {
        pageX = e.pageX;
        pageY = e.pageY;
      }

      if (initPosRef.current) {
        const { pageX: initPageX, pageY: initPageY } = initPosRef.current;
        if (
          !isDragStart.current &&
          (Math.abs(initPageX - pageX) > 5 || Math.abs(initPageY - pageY) > 5)
        ) {
          isDragStart.current = true;
          if (onDragStart) {
            const prevSelectedData = { ...selectedListData };
            // if (currentDrgaItem) {
            //   prevSelectedData[currentDrgaItem[labelIdPropName]] = { isDragging: true, ...currentDrgaItem };
            //   await setSelectedList(prevSelectedData);
            // }
            onDragStart(e, isDragStart.current, updatedSelectedList(prevSelectedData));
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
            isDragging={isDragStart.current}
            renderDragHandle={renderDragHandle}
            isListItemSelected={selectedList[listItem[labelIdPropName]]}
          />
        );
      });
    }, [listData, selectedList, isDragStart.current]);
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
