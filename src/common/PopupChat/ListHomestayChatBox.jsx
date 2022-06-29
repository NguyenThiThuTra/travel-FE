import { List, Typography } from 'antd';
import { detectOwnerHomestay } from 'constants/detectOwnerHomestay';
import { RouteConstant } from 'constants/RouteConstant';
import React, { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HomestayChatBox from './HomestayChatBoxItem';

export default function ListHomestayChatBox({
  data,
  onChangeCurrentConversation,
  currentConversation,
  sender,
}) {
  const location = useLocation();
  const [isOwnerHomestay, setIsOwnerHomestay] = useState(false);

  useEffect(() => {
    setIsOwnerHomestay(
      detectOwnerHomestay.some((path) => location.pathname.includes(path))
    );
  }, [location]);
  return (
    <Fragment>
      <div className="ul-list-item-homestay__title" mark>
        {isOwnerHomestay ? 'Danh sách người dùng' : 'Danh sách homestay'}
      </div>
      <ul className="ul-list-item-homestay">
        {data?.map((conversation) => (
          <HomestayChatBox
            sender={sender}
            currentConversation={currentConversation}
            key={conversation.id}
            conversation={conversation}
            onChangeCurrentConversation={onChangeCurrentConversation}
          />
        ))}
      </ul>
    </Fragment>
  );
}
