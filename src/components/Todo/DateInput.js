import { useDispatch } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";
import { useSelector } from "react-redux";

const DateInput = ({todo, ...props}) => {
  const dispatch = useDispatch();
  const date = useSelector((state) => state[todo.id].date);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "month":
        dispatch(editTodo(todo.id, { date: { month: value } }));
        break;
      case "day":
        dispatch(editTodo(todo.id, { date: { day: value } }));
        break;
      case "year":
        dispatch(editTodo(todo.id, { date: { year: value } }));
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <input
        type="text"
        name="month"
        value={date.month}
        onChange={handleInputChange}
      />
      /
      <input
        type="text"
        name="day"
        value={date.day}
        onChange={handleInputChange}
      />
      /
      <input
        type="text"
        name="year"
        value={date.year}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default DateInput;
