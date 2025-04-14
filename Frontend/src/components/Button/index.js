import "./styles.css";

const Button = ({ title, onClick, disabled }) => {
  return (
    <input type="button" value={title} onClick={onClick} disabled={disabled} />
  );
};

export { Button };
