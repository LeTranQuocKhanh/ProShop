import React from "react";

const Message = ({ variant, children, order }) => {
  const deleteMessage = () => {
    const message = document.getElementById(ID);
    message.style.display = "none";
  };

  const CLASSNAME = "alert alert-dismissible alert-" + variant;
  const ID = "message" + order;

  return (
    <div id={ID} className={CLASSNAME} variant={variant}>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        onClick={deleteMessage}
      ></button>
      <strong>{children}</strong>{" "}
    </div>
  );
};

Message.defaultProps = {
  variant: "info",
};

export default Message;
