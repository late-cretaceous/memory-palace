import styles from "./Header.module.css";
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
        <Sort className={styles.button} style={{ fill: fontColor }} />
      </div>
    </header>
  );
};

export default Header;
