import { List, Typography } from 'antd';
import React, { Fragment } from 'react';

export default function ListHomestayChatBox({
  data,
  onChangeCurrentConversation,
}) {
  const handleChangeCurrentConversation = (conversation_id) => {
    onChangeCurrentConversation(conversation_id);
  };
  return (
    <Fragment>
      <div className="ul-list-item-homestay__title" mark>
        [ITEM] Danh sách homestay
      </div>

      <ul className="ul-list-item-homestay">
        {data?.map((item) => (
          <li
            onClick={() => handleChangeCurrentConversation(item.id)}
            key={item}
          >
            <Typography.Text mark>[ITEM] {'s'}</Typography.Text>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
