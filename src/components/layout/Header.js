import { MdOutlineFlashlightOn, MdOutlineFlashlightOff } from "react-icons/md";
import { LuStretchVertical, LuStretchHorizontal } from "react-icons/lu";

import "./style.scss";

import Logo from "../../media/neon-sign.png";

const Header = ({
  darkMode,
  verticalMode,
  setDarkMode,
  setVerticalMode,
  language,
}) => {
  return (
    <header className={`header ${darkMode ? "dark" : "light"}`}>
      <h1 className="header-title">
        <span className="header-title-language">
          {language === "javascript" ? "JavaScript" : "Python"}
        </span>
        WorkSpace
      </h1>
      <div className="header-right">
        <div className="header-icons">
          <div className="header-icon" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <MdOutlineFlashlightOn /> : <MdOutlineFlashlightOff />}
          </div>
          <div
            className="header-icon"
            onClick={() => setVerticalMode(!verticalMode)}>
            {verticalMode ? <LuStretchHorizontal /> : <LuStretchVertical />}
          </div>
        </div>
        <img className="header-logo" src={Logo} alt="Logo" />
      </div>
    </header>
  );
};

export default Header;
