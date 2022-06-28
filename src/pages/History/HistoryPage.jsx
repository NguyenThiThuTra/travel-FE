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

  const pagingDefault = { limit: 10, page: 1 };
  const [paging, setPaging] = useState(pagingDefault);
  const [dataOrder, setDataOrder] = useState([]);
  useEffect(() => {
    async function getAllOrderByUserId() {
      if (currentUser?.data?._id) {
        const res = await dispatch(
          getAllOrder({
            filters: {
              user_id: currentUser?.data?._id,
              status: orderStatus,
            },
            limit: pagingDefault.limit,
            page: pagingDefault.page,
            sort: '-createdAt',
          })
        ).unwrap();
        const data = res?.data;
        setDataOrder(data);
      }
    }
    if (currentUser?.data?._id && orderStatus) {
      getAllOrderByUserId();
    }
    // getAllOrderByUserId();
    // }, [currentUser, orderStatus, updateOrderStatus, commentPost]);
  }, [currentUser, orderStatus]);

  const loadMore = async () => {
    try {
      const res = await dispatch(
        getAllOrder({
          filters: {
            user_id: currentUser?.data?._id,
            status: orderStatus,
          },
          limit: paging.limit,
          page: paging.page + 1,
          sort: '-createdAt',
        })
      ).unwrap();
      const data = res?.data;
      setDataOrder((preState) => [...dataOrder, ...data]);
      setPaging((prevState) => ({ ...prevState, page: prevState.page + 1 }));
    } catch (error) {
      console.error(error);
    }
  };

  const editStatusBooking = (id, status) => {
    setDataOrder((preState) => {
      const dataOrder = preState.map((data) => {
        if (data?._id === id) {
          return { ...data, status };
        }
        return data;
      });
      return dataOrder;
    });
  };
  const onChangeTabs = (key) => {
    setPaging(pagingDefault);
    setOrderStatus(key);
  };
  const dataRender = dataOrder?.filter((data) => data.status === orderStatus);
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
              <ListOrders
                editStatusBooking={editStatusBooking}
                data={dataRender}
              />
            </TabPane>
            <TabPane tab="Đã xác nhận" key={ORDER_STATUS.approved.en}>
              <ListOrders
                orderStatus={ORDER_STATUS.approved.en}
                data={dataRender}
              />
            </TabPane>
            <TabPane tab="Đã huỷ" key={ORDER_STATUS.canceled.en}>
              <ListOrders data={dataRender} />
            </TabPane>
            <TabPane tab="Bị từ chối" key={ORDER_STATUS.rejected.en}>
              <ListOrders data={dataRender} />
            </TabPane>
          </Tabs>
        </Content>
        {order?.paging?.current_page < order?.paging?.last_page && (
          <div
            onClick={loadMore}
            style={{
              color: '#5191FA',
              fontSize: '1.4rem',
              marginTop: '1.5rem',
              cursor: 'pointer',
            }}
          >
            Xem thêm
          </div>
        )}
      </Layout>
    </div>
  );
}
