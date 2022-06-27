import { Avatar } from 'antd';
import userApi from 'api/userApi';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { setReceiver } from 'features/ChatBox/ChatBoxSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { detectOwnerHomestay } from 'constants/detectOwnerHomestay';
import homestayApi from 'api/homestayApi';
import AvatarDefault from 'assets/images/avatar_default.png';

export default function HomestayChatBox({
  onChangeCurrentConversation,
  conversation,
  currentConversation,
  sender,
}) {
  const location = useLocation();
  const dispatch = useDispatch();

  const [receiver, set_Receiver] = useState(null);
  const currentUser = useSelector(useCurrentUserSelector);
  const [isOwnerHomestay, setIsOwnerHomestay] = useState(false);

  useEffect(() => {
    setIsOwnerHomestay(
      detectOwnerHomestay.some((path) => location.pathname.includes(path))
    );
  }, [location]);

  useEffect(() => {
    const friendId = conversation.members.find(
      (member) => member !== sender?._id
    );
    // get receiver
    if (!isOwnerHomestay) {
      homestayApi.getHomestay(friendId).then((res) => {
        set_Receiver(res?.data);
      });
    } else {
      userApi.getUser(friendId).then((res) => {
        set_Receiver(res?.data);
      });
    }
  }, [conversation, currentUser, isOwnerHomestay]);

  const onClick = (conversation_id) => {
    onChangeCurrentConversation(conversation_id);
    dispatch(setReceiver(receiver));
  };
  return (
    <li
      style={{
        backgroundColor:
          currentConversation?.id === conversation?.id ? '#f5f6f8' : '',
      }}
      onClick={() => onClick(conversation.id)}
    >
      <Avatar src={receiver?.avatar || AvatarDefault} />
      <p>{receiver?.name}</p>
    </li>
  );
}
