import { Avatar } from 'antd';
import React from 'react';

export  function ChatMessage({ message }) {
  return (
    <div className="chat-box__content__item">
      <div className="chat-box__content__avatar">
        <Avatar style={{ verticalAlign: 'middle' }}>Me</Avatar>
      </div>
      <div className="chat-box__content__message">{message.text} </div>
    </div>
  );
}
