import javascriptLessons from "./javascript/index.js";
import pythonLessons from "./python/index.js";

export const getStarterCode = (language, lesson) => {
  const lessons = language === "python" ? pythonLessons : javascriptLessons;

  return lessons[lesson] ?? "";
};
