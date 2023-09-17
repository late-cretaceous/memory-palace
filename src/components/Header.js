import styles from "./Header.module.css";

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
    </header>
  );
};

export default Header;
