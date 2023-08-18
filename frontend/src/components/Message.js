import React from "react";
import { Alert } from "react-bootstrap";

const Message = ({ variant, children }) => {
  // return <Alert variant={variant}>{children}</Alert>

  const deleteMessage = () => {
    const message = document.getElementById("message");
    message.style.display = "none";
  };

  const CLASSNAME = "alert alert-dismissible alert-" + variant;

  return (
    <div id="message" className={CLASSNAME} variant={variant}>
      {/* <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        onClick={deleteMessage}
      ></button> */}
      <strong>{children}</strong>{" "}
    </div>
    // <div
    //   className="toast show"
    //   role="alert"
    //   aria-live="assertive"
    //   aria-atomic="true"
    // >
    //   <div className="toast-header">
    //     <strong className="me-auto">Bootstrap</strong>
    //     <small>11 mins ago</small>
    //     <button
    //       type="button"
    //       className="btn-close ms-2 mb-1"
    //       data-bs-dismiss="toast"
    //       aria-label="Close"
    //     >
    //       <span aria-hidden="true"></span>
    //     </button>
    //   </div>
    //   <div className="toast-body">Hello, world! This is a toast message.</div>
    // </div>
  );
};

Message.defaultProps = {
  variant: "info",
};

export default Message;
