import { Layout, Tabs, Typography } from 'antd';
import { ListOrders } from 'components/History/ListOrders/ListOrders';
import { ORDER_STATUS } from 'constants/order';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { useCommentPostSelector } from 'features/Comment/CommentSlice';
import {
  getAllOrder,
  useOrderSelector,
  useUpdateOrderStatusSelector,
} from 'features/Order/OrderSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const { TabPane } = Tabs;
const { Title } = Typography;

const { Content, Sider } = Layout;

export default function HistoryPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector(useCurrentUserSelector);
  const [orderStatus, setOrderStatus] = useState(ORDER_STATUS.pending.en);
  const updateOrderStatus = useSelector(useUpdateOrderStatusSelector);
  const commentPost = useSelector(useCommentPostSelector);
  const order = useSelector(useOrderSelector);

  useEffect(() => {
    async function getAllOrderByUserId() {
      if (currentUser?.data?._id) {
        dispatch(
          getAllOrder({
            filters: {
              user_id: currentUser?.data?._id,
              status: orderStatus,
            },
          })
        );
      }
    }
    if (currentUser?.data?._id && orderStatus) {
      getAllOrderByUserId();
    }
    getAllOrderByUserId();
  }, [currentUser, orderStatus, updateOrderStatus, commentPost]);

  const onChangeTabs = (key) => {
    setOrderStatus(key);
  };

  return (
    <div className="history-page" style={{ padding: '8rem 2rem' }}>
      <Layout style={{ padding: '2rem' }}>
        <Title style={{ padding: '0 2rem' }} center level={3}>
          Lịch sử giao dịch
        </Title>
        <Content>
          <Tabs
            onChange={onChangeTabs}
            style={{ padding: '2rem' }}
            defaultActiveKey="1"
          >
            <TabPane tab="Đang chờ xử lý" key={ORDER_STATUS.pending.en}>
              <ListOrders data={order?.data} />
            </TabPane>
            <TabPane tab="Đã xác nhận" key={ORDER_STATUS.approved.en}>
              <ListOrders
                orderStatus={ORDER_STATUS.approved.en}
                data={order?.data}
              />
            </TabPane>
            <TabPane tab="Đã huỷ" key={ORDER_STATUS.canceled.en}>
              <ListOrders data={order?.data} />
            </TabPane>
            <TabPane tab="Bị từ chối" key={ORDER_STATUS.rejected.en}>
              <ListOrders data={order?.data} />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </div>
  );
}
