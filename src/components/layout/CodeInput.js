import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";

import "./style.scss";

const CodeInput = ({
  darkMode,
  language,
  starterCode,
  setOutput,
  setIsRunning,
}) => {
  const [code, setCode] = useState(starterCode);

  useEffect(() => {
    setCode(starterCode);
  }, [starterCode]);

  const iframeRef = useRef(null);
  const pythonWorkerRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;

      if (event.data?.type === "student-complete") {
        setIsRunning(false);
        return;
      }

      if (event.data?.type !== "student-output") return;

      setOutput((previous) =>
        previous ? `${previous}\n${event.data.message}` : event.data.message,
      );
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (language !== "python") return;

    const worker = new Worker(new URL("./python.worker.js", import.meta.url), {
      type: "module",
    });

    pythonWorkerRef.current = worker;

    worker.onmessage = (event) => {
      const { type, message } = event.data;

      if (type === "output") {
        setOutput((previous) =>
          previous ? `${previous}\n${message}` : message,
        );
      }

      if (type === "complete") {
        setIsRunning(false);
      }
    };

    return () => {
      worker.terminate();
      pythonWorkerRef.current = null;
    };
  }, [language, setOutput]);

  const runCode = () => {
    setOutput("");
    setIsRunning(true);

    if (language === "python") {
      pythonWorkerRef.current?.postMessage({ code });
      return;
    }

    const iframe = iframeRef.current;
    if (!iframe) return;

    const safeCode = code.replace(/<\/script/gi, "<\\/script");

    iframe.srcdoc = `
    <script>
      const send = (value) => {
        parent.postMessage({
          type: "student-output",
          message: String(value)
        }, "*");
      };

      console.log = (...values) => {
        send(values.join(" "));
      };

      window.onerror = (message) => {
        send("Error: " + message);
      };
    <\/script>

    <script>
        try {
    ${safeCode}
  } catch (error) {
    send("Error: " + error.message);
  } finally {
    parent.postMessage({
      type: "student-complete"
    }, "*");
  }
    <\/script>
  `;
  };

  return (
    <div className={`code-input ${darkMode ? "dark" : "light"}`}>
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => setCode(value)}
        defaultLanguage={language}
        defaultValue={`${language === "python" ? "#" : "//"} Write your ${language} here`}
        theme={darkMode ? "vs-dark" : "vs-light"}
        options={{
          fontSize: 28,
          minimap: { enabled: false },
          automaticLayout: true,
          wordWrap: "on",
          tabSize: 2,
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
          padding: {
            top: 10,
          },
          lineNumbersMinChars: 2,
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 12,
          tabSize: language === "python" ? 4 : 2,
          insertSpaces: true,
          detectIndentation: false,
          autoIndent: "full",
        }}
      />
      <button className="code-input-button" onClick={runCode}>
        REFRESH
      </button>
      <iframe
        ref={iframeRef}
        title="JavaScript execution"
        sandbox="allow-scripts"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default CodeInput;
