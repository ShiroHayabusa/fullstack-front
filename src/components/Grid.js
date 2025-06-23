import { useNavigate } from 'react-router-dom';

const ContributionGrid = ({ make, generations, spotsWithouPage, totalCells }) => {
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

        const currentGeneration = generations[index];

        const isMarked =
          currentGeneration &&
          spotsWithouPage &&
          spotsWithouPage.some(spot => spot.generation?.id === currentGeneration.id);

        const backgroundColor = isMarked ? '#14c609' : 'transparent';

        const tooltipText = currentGeneration
          ? `${currentGeneration.model?.name}\n${currentGeneration.name}` 
          : 'No data';

        return (
          <button
            key={index}

            onClick={() => {
              if (currentGeneration && currentGeneration.id) {
                navigate(`/catalog/${make}/${currentGeneration.model?.name}/${currentGeneration.id}`);
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
