import styles from "./Header.module.css";
import buttonStyle from "./UI/button.module.css";
import { ReactComponent as Sort } from "../assets/sort.svg";
import { useDispatch, useSelector } from "react-redux";
import { sort } from "../redux/globalSlice";

const Header = (props) => {
  const dispatch = useDispatch();
  const { sorted, headerColorNegative } = useSelector(
    (state) => state.globalSlice
  );
  const color = headerColorNegative ? props.color.negative() : props.color;
  const colorComplement = color.negative().toString();
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
        backgroundColor: color,
        color: colorComplement,
      }}
    >
      <h1>neato note</h1>
      <div className={styles["header-buttons-row"]}>
        <button
          className={buttonClasses}
          onClick={() => {
            dispatch(sort(sorted ? "manual" : "date"));
          }}
        >
          <Sort style={{ fill: colorComplement }} />
        </button>
      </div>
    </header>
  );
};

export default Header;
