import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContributionGrid = ({ make, user, trims, spotsWithouPage, totalCells }) => {
  const cellSize = 15; // размер ячейки в пикселях
  const navigate = useNavigate(); // хук для навигации

  // Состояния для массива trims, spots и общего количества ячеек.



  // Пока данные не загружены
  if (totalCells === null) {
    return <div>Загрузка...</div>;
  }

  // Создаем массив длиной totalCells.
  const cellsArray = [...Array(totalCells).keys()];

  return (
    <div
      style={{
        display: 'grid',
        // Например, 7 столбцов — можно изменить под ваши требования.
        gridTemplateColumns: `repeat(20, ${cellSize}px)`,
        gap: 2,
        padding: 0,
        margin: 0,
      }}
    >
      {cellsArray.map((_, index) => {
        // Получаем текущий объект trim для ячейки.
        const currentTrim = trims[index];

        // Определяем, найдено ли совпадение по trim между массивом spots и текущим объектом trims.
        const isMarked =
          currentTrim &&
          spotsWithouPage &&
          spotsWithouPage.some(spot => spot.trim?.id === currentTrim.id);

        // Задаем цвет фона: если совпадает, закрашиваем (например, зеленым), иначе оставляем прозрачным.
        const backgroundColor = isMarked ? '#14c609' : 'transparent';

        // Подготавливаем текст для всплывающей подсказки (tooltip)
        const tooltipText = currentTrim
          ? `${currentTrim.model?.name}\n${currentTrim.bodystyle.generation.name}\n${currentTrim.bodystyle.bodytype.name}\n${currentTrim.name}` // Здесь можно добавить другую информацию, например, model или year.
          : 'Нет данных';

        return (
          <button
            key={index}
            // Переход на страницу trim при клике (например, /trim/{id})
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
            // Используем атрибут title для простейшего tooltip
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
