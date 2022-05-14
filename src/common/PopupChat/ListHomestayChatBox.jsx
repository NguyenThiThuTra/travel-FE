import { List, Typography } from 'antd';
import React, { Fragment } from 'react';

export default function ListHomestayChatBox() {
  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfiresEnd.',
  ];
  return (
    <Fragment>
      <div className="ul-list-item-homestay__title" mark>
        [ITEM] Danh sách homestay
      </div>

      <ul class="ul-list-item-homestay">
        {data?.map((item) => (
          <li key={item}>
            <Typography.Text mark>[ITEM] {item}</Typography.Text>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
