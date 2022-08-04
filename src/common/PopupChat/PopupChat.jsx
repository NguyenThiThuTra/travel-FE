import { Empty, Input } from 'antd';
import homestayApi from 'api/homestayApi';
import ChatIcon from 'assets/images/chat.png';
import classNames from 'classnames';
import { firestore } from 'configs/firebase/config';
import { detectOwnerHomestay } from 'constants/detectOwnerHomestay';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import {
  toggleOpenPopupChatBox,
  useOpenPopupChatBoxSelector,
  useReceiverChatBoxSelector
} from 'features/ChatBox/ChatBoxSlice';
import { useEffect, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { AiOutlineCloseCircle, AiOutlineSend } from 'react-icons/ai';
import { BsChatFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './ChatMessage';
import ListHomestayChatBox from './ListHomestayChatBox';
import './_PopupChat.scss';

export default function PopupChat({ fixed = true, size }) {
  const location = useLocation();
  const dispatch = useDispatch();

  // popup chat with admin
  const dummy = useRef();
  const chatBoxRef = useRef(null);
  const inputMessageRef = useRef(null);

  const [openPopupChat, setOpenPopupChat] = useState(false);

  const openPopupChatBox = useSelector(useOpenPopupChatBoxSelector);

  const receiver = useSelector(useReceiverChatBoxSelector);
  const currentUser = useSelector(useCurrentUserSelector);

  const [sender, setSender] = useState('');
  // fetchHomestayByUserId
  const [isOwnerHomestay, setIsOwnerHomestay] = useState(false);

  useEffect(() => {
    setIsOwnerHomestay(
      detectOwnerHomestay.some((path) => location.pathname.includes(path))
    );
  }, [location]);

  useEffect(() => {
    if (!isOwnerHomestay) {
      setSender(currentUser?.data);
    } else {

      async function fetchHomestayByUserId() {
        const payload = {
          filters: { user_id: currentUser?.data?._id },
        };
        const response = await homestayApi.getAll(payload);
        setSender(response?.data?.[0]);
      }
      fetchHomestayByUserId();
    }
  }, [currentUser, isOwnerHomestay]);

  // get conversations
  const conversationsRef = firestore.collection('conversations');
  const queryConversations = conversationsRef
    .where('members', 'array-contains', sender?._id || '')
    .orderBy('updatedAt', 'desc');

  const [conversations] = useCollectionData(queryConversations, {
    idField: 'id',
  });

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
          conversation.members.includes(receiver?._id)
        )
      );
    }
  }, [conversations, receiver]);

  const [dataMessages, setDataMessages] = useState([]);
  const messageRef = firestore.collection('messages');

  const queryMessage = messageRef
    .where('conversation_id', '==', currentConversation?.id || null)
    .orderBy('createdAt', 'desc');
  const [messages] = useCollectionData(queryMessage);
  useEffect(() => {
    setDataMessages(messages);
  }, [messages]);

  const [formValue, setFormValue] = useState();

  const handleSwitchPopupChat = () => {
    setOpenPopupChat(!openPopupChat);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!formValue) {
      return;
    }
    setOnScroll(true);

    const conversation_id = uuidv4();
    const currentTime = new Date().getTime();
    if (!currentConversation) {
      const conversation = {
        members: [sender?._id, receiver?._id],
        id: conversation_id,
        createdAt: currentTime,
        updatedAt: currentTime,
      };
      conversationsRef.add(conversation);
    }

    const message = {
      conversation_id: currentConversation?.id || conversation_id,
      user_id: currentUser?.data?._id,
      sender_id: sender?._id,
      text: formValue,
      photoURL: sender?.avatar,
      name: sender?.name,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
    messageRef.add(message);
    conversationsRef
      .doc(currentConversation?.doc_id)
      .update({ updatedAt: currentTime });
    setFormValue('');
  };

  // animation
  const [onScroll, setOnScroll] = useState(false);
  useEffect(() => {
    if (conversationsRef || receiver || currentConversation) {
      dummy?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationsRef, onScroll, messages, receiver, currentConversation]);

  useEffect(() => {
    if (receiver) {
      inputMessageRef?.current?.focus();
    }
  }, [receiver]);

  return (
    <div className="popup-chat">
      <div
        onClick={() => dispatch(toggleOpenPopupChatBox())}
        className={classNames('icon-open-message ', {
          fixed: fixed,
          'size-small': size === 'small',
        })}
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
          onMouseEnter={() => chatBoxRef?.current?.focus()}
          className={classNames('chat-box fixed ', {
            fixed: fixed,
          })}
        >
          {/* <div onClick={() => moreMessage()}> MORE MORE </div> */}
          <div className="chat-box__header">
            <BsChatFill color="#ff4d4f" fontSize={20} />
            <span className="chat-box__title">
              <strong>Chat</strong>
            </span>
            <span
              onClick={() => dispatch(toggleOpenPopupChatBox())}
              className="chat-box__close"
            >
              <AiOutlineCloseCircle color="#ff4d4f" fontSize={25} />
            </span>
          </div>
          <div className="chat-box__main">
            <div className="chat-box__listHomestay">
              <ListHomestayChatBox
                data={conversations}
                sender={sender}
                currentConversation={currentConversation}
                onChangeCurrentConversation={onChangeCurrentConversation}
              />
            </div>
            {(receiver || currentConversation) && (
              <div className="chat-box__receiver">
                <div className="chat-box__receiver__name" mark>
                  {receiver?.name}
                </div>
                <div className="chat-box__content">
                  <span ref={dummy}></span>
                  {dataMessages?.map((message, index) => (
                    <ChatMessage
                      sender={sender}
                      message={message}
                      key={message.updatedAt}
                    />
                  ))}
                </div>

                <form onSubmit={sendMessage}>
                  <div className="chat-box__input-wrap">
                    <Input
                      ref={inputMessageRef}
                      value={formValue}
                      onChange={(e) => setFormValue(e.target.value)}
                      type="text"
                      placeholder="Gửi tin nhắn"
                    />
                    <button type="submit" className="chat-box__btn-send">
                      <AiOutlineSend />
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
          </div>
        </div>
      )}
    </div>
  );
}
