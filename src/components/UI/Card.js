import styles from './Card.module.css';

const Card = (props) => {
    let cardStyles = props.className ? props.className : '';

    cardStyles += ` ${styles.card}`;

    return <div className={cardStyles}>
        {props.children}
    </div>
}

export default Card;