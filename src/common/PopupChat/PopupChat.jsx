import React, { useState, useRef, useEffect, useMemo } from 'react';
import ChatIcon from 'assets/images/chat.png';
import { Avatar, Empty, Input } from 'antd';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { firestore, firebase } from 'configs/firebase/config';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { ChatMessage } from './ChatMessage';
import { v4 as uuidv4 } from 'uuid';
import {
  setOpenPopupChatBox,
  setReceiver,
  toggleOpenPopupChatBox,
  useOpenPopupChatBoxSelector,
  useReceiverChatBoxSelector,
} from 'features/ChatBox/ChatBoxSlice';
import ListHomestayChatBox from './ListHomestayChatBox';
import './_PopupChat.scss';

export default function PopupChat() {
  const dispatch = useDispatch();
  // popup chat with admin
  const dummy = useRef();
  const chatBoxRef = useRef(null);
  const inputMessageRef = useRef(null);

  const [openPopupChat, setOpenPopupChat] = useState(false);

  const openPopupChatBox = useSelector(useOpenPopupChatBoxSelector);

  const receiver = useSelector(useReceiverChatBoxSelector);

  const currentUser = useSelector(useCurrentUserSelector);

  const conversationsRef = firestore.collection('conversations');
  const queryConversations = conversationsRef.where(
    'members',
    'array-contains',
    currentUser?.data?._id
  );

  const [conversations, loadingConversations] = useCollectionData(
    queryConversations,
    { idField: 'id' }
  );

  const [currentConversation, setCurrentConversation] = useState(null);

  const onChangeCurrentConversation = (conversation_id) => {
    setCurrentConversation(
      conversations?.find((conversation) =>
        conversation.id.includes(conversation_id)
      )
    );
  };

  useEffect(() => {
    if (conversations && receiver) {
      setCurrentConversation(
        conversations?.find((conversation) =>
          conversation.members.includes(receiver?.user_id)
        )
      );
    }
  }, [conversations, receiver]);

  useEffect(() => {
    if (currentConversation) {
      dispatch(
        setReceiver({
          user_id: currentConversation.members.find(
            (member) => member !== currentUser?.data?._id
          ),
        })
      );
    }
  }, [currentConversation]);

  // useEffect(() => {
  //   if (!currentConversation) return;
  //   const getMessages = async () => {
  //     firestore
  //       .collection('messages')
  //       .where('conversation_id', '==', currentConversation?.id || null)
  //       .orderBy('createdAt', 'desc')
  //       .onSnapshot((snapshot) => {
  //         console.log({ snapshot });
  //         const messages = snapshot.docs.map((doc) => ({
  //           ...doc.data(),
  //           id: doc.id,
  //         }));
  //         console.log({ messagesmessagesmessages: messages });
  //         // setMessages(messages);
  //       });
  //   };
  //   getMessages();
  // }, [currentConversation]);
  const messageRef = firestore.collection('messages');
  const query = messageRef
    .where('conversation_id', '==', currentConversation?.id || null)
    .orderBy('createdAt', 'desc')
    .limit(25);
  const [messages] = useCollectionData(query);

  console.log({ messages, receiver, conversations, currentConversation });
  const [formValue, setFormValue] = useState();

  const handleSwitchPopupChat = () => {
    setOpenPopupChat(!openPopupChat);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const conversation_id = uuidv4();
    if (!currentConversation) {
      const conversation = {
        members: [currentUser?.data?._id, receiver?.user_id],
        id: conversation_id,
      };
      conversationsRef.add(conversation);
    }

    const message = {
      conversation_id: currentConversation?.id || conversation_id,
      user_id: currentUser?.data?._id,
      sender_id: currentUser?.data?._id,
      sender_name: currentUser?.data?.name,
      receiver_id: receiver?.user_id,
      text: formValue,
      // createdAt: new Date(),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
    messageRef.add(message);
    setFormValue('');
  };

  useEffect(() => {
    if (receiver || currentConversation) {
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, receiver, currentConversation]);

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
            {(receiver || currentConversation) && (
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
            {!receiver && !currentConversation && (
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
              <ListHomestayChatBox
                data={conversations}
                onChangeCurrentConversation={onChangeCurrentConversation}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
