let pyodide = null;

const initialisePython = async () => {
  if (!pyodide) {
    importScripts("https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js");

    pyodide = await loadPyodide();
  }

  return pyodide;
};

self.onmessage = async (event) => {
  const { code } = event.data;

  try {
    const python = await initialisePython();

    python.setStdout({
      batched: (message) => {
        self.postMessage({
          type: "output",
          message,
        });
      },
    });

    python.setStderr({
      batched: (message) => {
        self.postMessage({
          type: "output",
          message,
        });
      },
    });

    await python.runPythonAsync(code);

    self.postMessage({ type: "complete" });
  } catch (error) {
    self.postMessage({
      type: "output",
      message: String(error),
    });

    self.postMessage({ type: "complete" });
  }
};
