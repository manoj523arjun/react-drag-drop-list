import React, { useState, useRef } from 'react';
import DragListContainer from './components/DragListContainer';
import DropContainer from './components/DropContainer';
import './App.css';

const App = () => {
  const dragContainerRef = useRef(null);
  const [dropContainerData, setDropContainerData] = useState([]);
  const [movedItems, setMovedItems] = useState([]);
  const [pageCOrds, setPageCords] = useState(null);
  const listData = [
    {
      text: 'Item 1',
      isDraggable: true,
      id: 1
    },
    {
      text: 'Item 2',
      isDraggable: true,
      id: 2
    },
    {
      text: 'Item 3',
      isDraggable: true,
      id: 3
    },
    {
      text: 'Item 4',
      isDraggable: true,
      id: 4
    }
  ];
  const renderDragTextComponent = () => {
    return (
      <div className="move-container" style={{ backgroundColor: '#e5e5e5', padding: 8 }}>
        <span>Moving {dropContainerData.length} Items</span>
      </div>
    );
  };

  const onDragStart = (event, isDraggingStart, selectedList) => {
    console.log('drag start', selectedList);
    setDropContainerData(selectedList);
  };

  const onDragStop = (dropElement, selectedItems) => {
    console.log('drag stop', dropElement, selectedItems);
    setMovedItems(dropElement ? selectedItems : []);
  };

  const onDragging = (e) => {
    const { pageX, pageY } = e;
    setPageCords({ pageX, pageY });
  };

  // console.log(dragContainerRef.current, "dragContainerRef");

  return (
    <>
      <DragListContainer
        listData={listData}
        labelTextPropName="text"
        labelIdPropName="id"
        renderDragTextComponent={renderDragTextComponent}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        onDragging={onDragging}
        ref={dragContainerRef}
      />
      <DropContainer dragContainerRef={dragContainerRef} pageCOrds={pageCOrds}>
        <>{!!movedItems.length && movedItems.map((item) => item.text)}</>
      </DropContainer>

      <DropContainer dragContainerRef={dragContainerRef} pageCOrds={pageCOrds}>
        <>{!!movedItems.length && movedItems.map((item) => item.text)}</>
      </DropContainer>
    </>
  );
};
export default App;
