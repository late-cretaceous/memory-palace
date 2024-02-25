import { useDispatch } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";
import { useSelector } from "react-redux";

const DateInput = ({ todo, name }) => {
  const dispatch = useDispatch();
  const date = useSelector((state) => state.persistentSlice[todo.id].date);

  const handleInputChange = (e) => {
    const { value } = e.target;

    if (!isNaN(value)) {
      dispatch(
        editTodo({
          id: todo.id,
          edit: { date: { ...date, [name]: value } },
        })
      );
    }
  };

  return (
    <input
      type="text"
      name={name}
      value={date[name]}
      onChange={handleInputChange}
    />
  );
};

export default DateInput;
