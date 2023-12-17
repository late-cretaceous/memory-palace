import styles from "./Header.module.css";
import buttonStyle from "./UI/button.module.css";
import { ReactComponent as Sort } from "../assets/sort.svg";

const Header = (props) => {
  const fontColor = props.color.negative().toString();

  return (
    <header
      className={styles.header}
      style={{
        backgroundColor: props.color,
        color: fontColor,
      }}
    >
      <h1>neato note</h1>
      <div className={styles["header-buttons-row"]}>
        <button className={buttonStyle.button}>
          <Sort style={{ fill: fontColor }} />
        </button>
      </div>
    </header>
  );
};

export default Header;
