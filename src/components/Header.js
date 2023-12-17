import styles from "./Header.module.css";
import buttonStyle from "./UI/button.module.css";
import { ReactComponent as Sort } from "../assets/sort.svg";
import { useDispatch, useSelector } from "react-redux";
import { sort } from "../redux/globalSlice";

const Header = (props) => {
  const dispatch = useDispatch();
  const colorComplement = props.color.negative().toString();
  const sorting = Boolean(
    useSelector((state) => state.globalSlice.sort) !== "manual"
  );
  const buttonClasses = `${buttonStyle.button} ${
    sorting ? styles.selected : styles.unselected
  }`;

  return (
    <header
      className={styles.header}
      style={{
        backgroundColor: props.color,
        color: colorComplement,
      }}
    >
      <h1>neato note</h1>
      <div className={styles["header-buttons-row"]}>
        <button
          className={buttonClasses}
          onClick={() => {
            dispatch(sort("date"));
          }}
        >
          <Sort style={{ fill: colorComplement }} />
        </button>
      </div>
    </header>
  );
};

export default Header;
