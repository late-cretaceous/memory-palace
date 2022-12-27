import styles from './Card.module.css';

const Card = (props) => {
    let cardStyles = props.className ? styles[props.className] : styles.default;

    cardStyles += ` ${styles.card}`;

    return <div className={cardStyles}>
        {props.children}
    </div>
}

export default Card;