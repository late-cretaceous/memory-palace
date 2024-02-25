import { useDispatch } from "react-redux";
import { editTodo } from "../../redux/persistentSlice";
import { useSelector } from "react-redux";

const DateInput = ({ todo, ...props }) => {
  const dispatch = useDispatch();
  const date = useSelector((state) => state.persistentSlice[todo.id].date);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (!isNaN(value)) {
      const month = name === "month" ? value : date.month;
      const day = name === "day" ? value : date.day;
      const year = name === "year" ? value : date.year;

      dispatch(
        editTodo({
          id: todo.id,
          edit: { date: { month: month, day: day, year: year } },
        })
      );
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
      <input
        type="text"
        name="day"
        value={date.day}
        onChange={handleInputChange}
      />
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
