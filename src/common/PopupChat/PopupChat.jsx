import React, { useState, useRef, useEffect } from 'react';
import ChatIcon from 'assets/images/chat.png';
import { Avatar, Empty, Input } from 'antd';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { firestore, firebase } from 'configs/firebase/config';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { ChatMessage } from './ChatMessage';
import './_PopupChat.scss';
import {
  setOpenPopupChatBox,
  toggleOpenPopupChatBox,
  useOpenPopupChatBoxSelector,
  useReceiverChatBoxSelector,
} from 'features/ChatBox/ChatBoxSlice';
import ListHomestayChatBox from './ListHomestayChatBox';

export default function PopupChat({ receiver_id = 'asfs' }) {
  const dispatch = useDispatch();
  // popup chat with admin
  const dummy = useRef();
  const chatBoxRef = useRef(null);
  const inputMessageRef = useRef(null);

  const [openPopupChat, setOpenPopupChat] = useState(false);

  const openPopupChatBox = useSelector(useOpenPopupChatBoxSelector);

  const receiver = useSelector(useReceiverChatBoxSelector);

  const currentUser = useSelector(useCurrentUserSelector);
  console.log({ receiver });

  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt', 'desc').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });
  console.log({ messages });
  const [formValue, setFormValue] = useState();

  const handleSwitchPopupChat = () => {
    setOpenPopupChat(!openPopupChat);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const message = {
      user_id: currentUser?.data?._id,
      sender_id: currentUser?.data?._id,
      sender_name: currentUser?.data?.name,
      receiver_id: receiver?._id,
      receiver_name: receiver?.name,
      text: formValue,
      // createdAt: new Date(),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
    messageRef.add(message);
    setFormValue('');
  };

  useEffect(() => {
    if (receiver) {
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, receiver]);

  useEffect(() => {
    if (receiver) {
      inputMessageRef.current.focus();
    }
  }, [receiver]);

  // openChatBox
  const openChatBox = () => {
    dispatch(setOpenPopupChatBox(true));
  };

  return (
    <div className="popup-chat">
      <div
        onClick={() => dispatch(toggleOpenPopupChatBox())}
        className="icon-open-message"
      >
        <img
          width="40px"
          height="40px"
          src={ChatIcon}
          alt="icon-open-message"
        />
      </div>
      {openPopupChatBox && (
        <div
          ref={chatBoxRef}
          onMouseEnter={() => chatBoxRef.current.focus()}
          className="chat-box"
        >
          <div className="chat-box__header">
            <Avatar style={{ verticalAlign: 'middle' }}>Me</Avatar>
            <span className="chat-box__title">
              <strong>Admin</strong>
            </span>
            <span
              onClick={() => dispatch(toggleOpenPopupChatBox())}
              className="chat-box__close"
            >
              X
            </span>
          </div>
          <div className="chat-box__main">
            {(receiver || receiver) && (
              <div className="chat-box__receiver">
                <div className="chat-box__receiver__name" mark>
                  Tra Nguyen Homestay
                </div>
                <div className="chat-box__content">
                  <span ref={dummy}></span>
                  {messages?.map((message, index) => (
                    <ChatMessage message={message} key={message.updatedAt} />
                  ))}
                </div>

                <form onSubmit={sendMessage}>
                  <div className="chat-box__input-wrap">
                    <Input
                      ref={inputMessageRef}
                      value={formValue}
                      onChange={(e) => setFormValue(e.target.value)}
                      type="text"
                      placeholder="Type a message"
                    />
                    <button type="submit" className="chat-box__btn-send">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            )}
            {!receiver && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            )}

            <div className="chat-box__listHomestay">
              <ListHomestayChatBox />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
