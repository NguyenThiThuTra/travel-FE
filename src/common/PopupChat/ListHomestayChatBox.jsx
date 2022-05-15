import { List, Typography } from 'antd';
import React, { Fragment, useState } from 'react';
import HomestayChatBox from './HomestayChatBoxItem';

export default function ListHomestayChatBox({
  data,
  onChangeCurrentConversation,
}) {
  return (
    <Fragment>
      <div className="ul-list-item-homestay__title" mark>
        [ITEM] Danh sách homestay
      </div>
      <ul className="ul-list-item-homestay">
        {data?.map((conversation) => (
          <HomestayChatBox
            key={conversation.id}
            conversation={conversation}
            onChangeCurrentConversation={onChangeCurrentConversation}
          />
        ))}
      </ul>
    </Fragment>
  );
}
