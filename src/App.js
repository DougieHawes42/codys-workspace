import { useState, useRef, useEffect } from "react";
import { LuGripVertical, LuGripHorizontal } from "react-icons/lu";
import { useLocation } from "react-router-dom";

import { getStarterCode } from "./lessons/index.js";

import "./styles/main.scss";

import Header from "./components/layout/Header.js";
import CodeInput from "./components/layout/CodeInput.js";
import Stage from "./components/layout/Stage.js";

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [verticalMode, setVerticalMode] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50);
  const [topHeight, setTopHeight] = useState(50);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const path = window.location.hash.replace(/^#\/?/, "");

  const [prefix, lesson] = path.split("/");

  const language = prefix === "py" ? "python" : "javascript";

  const starterCode = getStarterCode(language, lesson);

  const startDragging = (e) => {
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDragging = (e) => {
    if (!isDragging.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    if (verticalMode) {
      const relativeY = e.clientY - rect.top;
      const percentage = (relativeY / rect.height) * 100;

      const limitedHeight = Math.min(89, Math.max(11, percentage));

      setTopHeight(limitedHeight);
    } else {
      const relativeX = e.clientX - rect.left;
      const percentage = (relativeX / rect.width) * 100;

      const limitedWidth = Math.min(89, Math.max(11, percentage));

      setLeftWidth(limitedWidth);
    }
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <Header
        darkMode={darkMode}
        verticalMode={verticalMode}
        setDarkMode={setDarkMode}
        setVerticalMode={setVerticalMode}
        language={language}
      />
      <div
        className={`workspace ${verticalMode ? "vertical" : "horizontal"}`}
        style={{
          gridTemplateColumns: verticalMode
            ? "minmax(0, 1fr)"
            : `${leftWidth}fr 16px ${100 - leftWidth}fr`,
          gridTemplateRows: verticalMode
            ? `${topHeight}fr 16px ${100 - topHeight}fr`
            : "minmax(0, 1fr)",
        }}
        ref={containerRef}>
        <CodeInput
          darkMode={darkMode}
          language={language}
          setOutput={setOutput}
          setIsRunning={setIsRunning}
          starterCode={starterCode}
        />
        <div
          className="divider"
          onPointerDown={startDragging}
          onPointerMove={handleDragging}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}>
          {verticalMode ? (
            <LuGripHorizontal className="divider-icon" />
          ) : (
            <LuGripVertical className="divider-icon" />
          )}
        </div>
        <Stage
          darkMode={darkMode}
          output={output}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
        />
      </div>
    </div>
  );
};

export default App;
