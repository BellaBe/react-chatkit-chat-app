//jshint esversion: 6
import React from "react";

const Message = props => {
  const { username, text } = props;
  return (
    <div className="message">
      <div className="message-username">{username}</div>
      <div className="message-text">{text}</div>
    </div>
  );
};
export default Message;
