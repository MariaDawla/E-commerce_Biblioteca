import "./styles.css";

export const Alert = ({
  alertMessage,
  alertStatus,
  setAlertClosing,
  alertClosing,
}) => {
  return alertMessage ? (
    <div
      className={`alert ${alertClosing ? "hide-alert" : ""}`}
      style={{
        "--alert-color": `var(--${alertStatus})`,
      }}
    >
      <span
        class="material-symbols-outlined"
        style={{ "font-variation-settings": "'FILL' 1" }}
      >
        {alertStatus === "success" ? "check_circle" : "error"}
      </span>
      {alertMessage}
      <div
        class="close-alert"
        onClick={() => {
          setAlertClosing(true);
        }}
      >
        <i class="material-symbols-outlined">close</i>
      </div>
    </div>
  ) : (
    <></>
  );
};
