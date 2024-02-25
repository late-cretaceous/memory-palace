import DateInput from "../Inputs/DateInput";

const DateForm = ({ todo, ...props }) => {
  return (
    <div>
      <DateInput todo={todo} name="month" />
      <DateInput todo={todo} name="day" />
      <DateInput todo={todo} name="year" />
    </div>
  );
};

export default DateForm;
