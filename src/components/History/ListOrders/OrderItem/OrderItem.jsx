import {
  Typography,
  Divider,
  Button,
  Space,
  Card,
  Tag,
  Popconfirm,
} from 'antd';
import { ORDER_STATUS, ORDER_STATUS_COLOR } from 'constants/order';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { updateOrder } from 'features/Order/OrderSlice';
import './_OrderItem.scss';

const { Title } = Typography;

//['single', 'double', 'family', 'big family'],
const TYPE_ROOM = {
  single: 'Phòng đơn',
  double: 'Phòng đôi',
  family: 'Phòng gia đình',
  bigFamily: 'Phòng gia đình lớn',
};
export function OrderItem({ seller, data, totalPriceOrders }) {
  const dispatch = useDispatch();
  const handleChangeStatus = async (status) => {
    // update status !rejected
    if (status === ORDER_STATUS.approved.en) {
      const formOrder = { status };
      return dispatch(
        updateOrder({
          id: data._id,
          order: formOrder,
        })
      );
    }
    if (
      status === ORDER_STATUS.rejected.en ||
      status === ORDER_STATUS.canceled.en
    ) {
      // update status rejected
      const formOrder = { status };
      return dispatch(
        updateOrder({
          id: data._id,
          order: formOrder,
        })
      );
    }
  };
  // total payment
  const totalPayment = useMemo(
    () =>
      data?.order?.reduce((acc, item) => {
        return acc + item?.select_room * item?.category_id?.price;
      }, 0),
    [data]
  );
  return (
    <Card className="order-item">
      <Title level={4}>{data?.homestay_id?.name}</Title>
      <Divider className="order-item__divider" />
      {data?.order?.map(({ category_id: category, select_room }, idx) => (
        <div
          key={idx}
          style={{ marginBottom: '1rem' }}
          className="order-item__main"
        >
          <div className="order-item__description">
            <img
              className="order-item__img"
              src={
                category?.images?.[0] ||
                'https://chieutour.com.vn/upload/images/tour-du-lich-tu-tphcm-di-da-nang.jpg'
              }
              alt="img"
            />
            <div>
              <div className="order-item__name">{category?.name}</div>
              <div className="order-item__category">
                {TYPE_ROOM[category?.type]}
              </div>
              <div className="order-item__quantity">{`x${select_room}`}</div>{' '}
            </div>
          </div>

          <div className="order-item__price">₫{category?.price}</div>
        </div>
      ))}

      <Divider className="order-item__divider" />
      <div className="order-item__bottom">
        <div className="order-item__total">
          Tổng số tiền: <span>₫{totalPayment}</span>
        </div>
        {seller && data?.status === ORDER_STATUS.pending.en && (
          <Space>
            <Popconfirm
              title="Bạn có chắc chắn muốn xác nhận đơn hàng này?"
              onConfirm={() => handleChangeStatus(ORDER_STATUS.approved.en)}
              okText="Đồng ý"
              cancelText="Không"
            >
              <Button type="primary">Xác nhận</Button>
            </Popconfirm>
            <Popconfirm
              // huỷ đơn hàng
              title="Bạn có chắc chắn muốn từ chối đơn hàng này?"
              onConfirm={() => handleChangeStatus(ORDER_STATUS.rejected.en)}
              okText="Đồng ý"
              cancelText="Không"
            >
              <Button type="danger">Từ chối</Button>
            </Popconfirm>
          </Space>
        )}
        {!seller && data?.status === ORDER_STATUS.pending.en && (
          <Popconfirm
            title="Bạn có chắc chắn muốn huỷ đơn hàng này?"
            onConfirm={() => handleChangeStatus(ORDER_STATUS.canceled.en)}
            okText="Đồng ý"
            cancelText="Không"
          >
            <div className="order-item__btn">Huỷ đơn hàng</div>
          </Popconfirm>
        )}
        {!seller && data?.status !== ORDER_STATUS.pending.en && (
          <Tag
            style={{ cursor: 'default', borderRadius: '20px' }}
            className="order-item__btn"
            color={ORDER_STATUS_COLOR?.[data?.status]}
          >
            {ORDER_STATUS?.[data?.status].vi}
          </Tag>
        )}
      </div>
    </Card>
  );
}
