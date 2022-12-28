import styles from "./Card.module.css";

const Card = (props) => {
  const { children, className, ...attributeProps } = props;
  const cardStyles = className ? `${className} ${styles.card}` : styles.card;

  return (
    <div className={cardStyles} {...attributeProps}>
      {children}
    </div>
  );
};

export default Card;
