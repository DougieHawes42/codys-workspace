import CodyLoader1 from "../../media/loaders/cody1.png";

import "./style.scss";

const Stage = ({ darkMode, output, isRunning }) => {
  return (
    <div className={`stage ${darkMode ? "dark" : "light"}`}>
      <pre className="stage-output">
        {output ? (
          output
        ) : isRunning ? (
          <div className="stage-loading">
            <img
              className="stage-loading-image"
              src={CodyLoader1}
              alt="Loading..."
            />
            <span>Loading...</span>
          </div>
        ) : (
          <pre className="stage-output">{output}</pre>
        )}
      </pre>
    </div>
  );
};

export default Stage;
