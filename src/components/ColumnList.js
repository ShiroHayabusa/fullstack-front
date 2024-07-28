import React from 'react';
import { Link } from 'react-router-dom';
import './ColumnList.css';

const ColumnList = ({ groupedItems, itemsPerColumn }) => {
  const groupedKeys = Object.keys(groupedItems).sort();

  const columns = [];
  let currentColumn = [];
  let currentKey = null;

  groupedKeys.forEach((key) => {
    const items = groupedItems[key];
    if (currentColumn.length + items.length > itemsPerColumn) {
      columns.push(currentColumn);
      currentColumn = [];
      currentKey = null;
    }
    items.forEach((item) => {
      if (!currentKey || currentKey !== key) {
        currentColumn.push({ type: 'header', value: key });
        currentKey = key;
      }
      currentColumn.push({ type: 'item', value: item });
    });
  });

  if (currentColumn.length > 0) {
    columns.push(currentColumn);
  }

  return (
    <div className="columns">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="column">
          {column.map((entry, itemIndex) => (
            entry.type === 'header' ? (
              <h3 className='border-bottom' key={itemIndex}>{entry.value}</h3>
            ) : (
              <ul className='list-group list-group-flush' key={itemIndex}>
                <li className='list-group-item'>
                  <Link to={`/catalog/${entry.value.name}`}>{entry.value.name}</Link>
                </li>
              </ul>
            )
          ))}
        </div>
      ))}
    </div>
  );
};

export default ColumnList;
