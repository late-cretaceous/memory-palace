import styles from "./Header.module.css";
import { ReactComponent as Sort } from "../assets/triangle.svg";

const Header = (props) => {
  return (
    <header
      className={styles.header}
      style={{
        backgroundColor: props.color,
        color: props.color.negative().toString(),
      }}
    >
      <h1>neato note</h1>
      <div className={styles["header-buttons-row"]}>
        <Sort />
      </div>
    </header>
  );
};

export default Header;
