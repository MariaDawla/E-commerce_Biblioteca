import "./styles.css";

const IconButton = ({ icon, onClick, disabled }) => {
  return (
    <div className="icon-button" onClick={onClick} disabled={disabled}>
      <span class="material-symbols-rounded">{icon}</span>
    </div>
  );
};

export { IconButton };
