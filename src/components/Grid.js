import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContributionGrid = ({ make, user, trims, spotsWithouPage, totalCells }) => {
  const cellSize = 15; 
  const navigate = useNavigate(); 

  if (totalCells === null) {
    return <div>Loading...</div>;
  }

  const cellsArray = [...Array(totalCells).keys()];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(25, ${cellSize}px)`,
        gap: 2,
        padding: 0,
        margin: 0,
      }}
    >
      {cellsArray.map((_, index) => {

        const currentTrim = trims[index];

        const isMarked =
          currentTrim &&
          spotsWithouPage &&
          spotsWithouPage.some(spot => spot.trim?.id === currentTrim.id);

        const backgroundColor = isMarked ? '#14c609' : 'transparent';

        const tooltipText = currentTrim
          ? `${currentTrim.model?.name}\n${currentTrim.bodystyle.generation.name}\n${currentTrim.bodystyle.bodytype.name}\n${currentTrim.name}` // Здесь можно добавить другую информацию, например, model или year.
          : 'No data';

        return (
          <button
            key={index}

            onClick={() => {
              if (currentTrim && currentTrim.id) {
                navigate(`/catalog/${make}/${currentTrim.model?.name}/${currentTrim.bodystyle.generation.id}/${currentTrim.bodystyle.id}/${currentTrim.id}`);
              }
            }}
            style={{
              padding: 0,
              margin: 0,
              border: 'none',
              background: 'transparent',
              lineHeight: 0,
              cursor: 'pointer',
            }}

            title={tooltipText}
          >
            <div
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                border: '2px solid #ddd',
                boxSizing: 'border-box',
                margin: 0,
                backgroundColor,
              }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default ContributionGrid;
