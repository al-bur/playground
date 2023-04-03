import "./App.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { deepClone } from "./util";
import html2canvas from "html2canvas";

const CENTER_INDEX = 4;

const Cell = ({ index, gridIndex, datum, onBlur, customClass }) => {
  return (
    <div
      contenteditable="true"
      className={`cell${customClass ? ` ${customClass}` : ""}`}
      id={`c${index + 1}`}
      onBlur={(e) => onBlur(e, gridIndex, index)}
    >
      {datum || " "}
    </div>
  );
};

const Grid = ({ index, data, handleChangeCell }) => {
  const getCustomCellClassname = (cellIndex) => {
    if (cellIndex === CENTER_INDEX) {
      if (index === CENTER_INDEX) return "center-grid-center-cell";

      return "center-cell";
    }

    return null;
  };

  return (
    <div className="grid">
      {data.map((_, i) => (
        <Cell
          key={i}
          index={i}
          gridIndex={index}
          customClass={getCustomCellClassname(i)}
          datum={data[i]}
          onBlur={handleChangeCell}
        />
      ))}
    </div>
  );
};

const INITIAL_CELLS = Array(9).fill(Array(9).fill(""));

const App = () => {
  const fullScreenRef = useRef(null);
  const [cells, setCells] = useState(
    JSON.parse(localStorage.getItem("CELLS")) ?? INITIAL_CELLS
  );

  const saveCellsToLocalStorage = useCallback(() => {
    localStorage.setItem("CELLS", JSON.stringify(cells));
  }, [cells]);

  const handleChangeCell = (e, gridIndex, cellIndex) => {
    const newCell = e.target.textContent;
    const copiedCells = deepClone(cells);

    copiedCells[gridIndex][cellIndex] = newCell;

    setCells(copiedCells);
  };

  const resetCells = () => {
    localStorage.removeItem("CELLS");

    setCells(INITIAL_CELLS);
  };

  const saveScreenshot = () => {
    const fullElement = fullScreenRef.current;

    html2canvas(fullElement).then((canvas) => {
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "screenshot.png";
      link.click();
    });
  };

  useEffect(() => {
    saveCellsToLocalStorage();
  }, [saveCellsToLocalStorage]);

  return (
    <div className="container" ref={fullScreenRef}>
      <h1>상민이의 만다라트</h1>
      <div className="outer-grid">
        {cells.map((_, index) => (
          <Grid
            key={index}
            index={index}
            center={index === CENTER_INDEX}
            data={cells[index]}
            handleChangeCell={handleChangeCell}
          />
        ))}
      </div>
      <div data-html2canvas-ignore="true">
        <button onClick={saveCellsToLocalStorage}>저장하기</button>
        <button onClick={resetCells}>리셋하기</button>
        <button onClick={saveScreenshot}>스크린샷 저장하기</button>
      </div>
    </div>
  );
};

export default App;
