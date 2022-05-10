import { Empty } from 'antd';
import React from 'react';
import { OrderItem } from './OrderItem/OrderItem';

export function ListOrders({ data, seller = false }) {
  return (
    <div>
      {data?.map((item) => (
        <OrderItem seller={seller} data={item} key={item._id} />
      ))}
      {data?.length === 0 && <Empty />}
    </div>
  );
}
