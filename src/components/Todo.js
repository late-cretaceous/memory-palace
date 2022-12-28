import styles from './Todo.module.css';
import Card from './UI/Card';

const Todo = props => {
    const dragHandler = e => {
        console.log()
    };

    return <Card className={styles.todo} draggable='true'>
        <h3>{props.id}</h3>
    </Card>
}

export default Todo;