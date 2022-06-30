import {
  Button,
  Card,
  Divider,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from 'antd';
import commentApi from 'api/comment';
import orderApi from 'api/orderApi';
import FormAssessmentHomestay from 'components/Homestay/FormAssessmentHomestay/FormAssessmentHomestay';
import { ORDER_STATUS, ORDER_STATUS_COLOR } from 'constants/order';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import {
  getAllCommentInHomestay,
  useCommentsSelector,
} from 'features/Comment/CommentSlice';
import {
  getAllOrder,
  updateOrder,
  useOrderSelector,
} from 'features/Order/OrderSlice';
import moment from 'moment';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import './_OrderItem.scss';

const { Title } = Typography;

//['single', 'double', 'family', 'big family'],
const TYPE_ROOM = {
  single: 'Phòng đơn',
  double: 'Phòng đôi',
  family: 'Phòng gia đình',
  bigFamily: 'Phòng gia đình lớn',
};
export function OrderItem({
  orderStatus,
  seller,
  data,
  totalPriceOrders,
  editStatusBooking,
}) {
  const dispatch = useDispatch();

  const currentUser = useSelector(useCurrentUserSelector);

  const handleChangeStatus = async (status) => {
    // update status !rejected
    if (status === ORDER_STATUS.approved.en) {
      const formOrder = { status };
      try {
        await dispatch(
          updateOrder({
            id: data._id,
            order: formOrder,
          })
        ).unwrap();
        await editStatusBooking(data._id, status);
        return false;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    if (
      status === ORDER_STATUS.rejected.en ||
      status === ORDER_STATUS.canceled.en
    ) {
      // update status rejected
      const formOrder = { status };
      try {
        await dispatch(
          updateOrder({
            id: data._id,
            order: formOrder,
          })
        ).unwrap();
        await editStatusBooking(data._id, status);
        return false;
      } catch (error) {
        console.error(error);
        return false;
      }
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

  // show Modal review
  const [loading, setLoading] = useState(false);
  const [visibleFormReview, setVisibleFormReview] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const showModal = (id) => {
    setOrderId(id);
    setVisibleFormReview(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisibleFormReview(false);
    }, 3000);
  };

  const handleCancel = () => {
    setVisibleFormReview(false);
  };

  // handle assessments
  const [comments, setComments] = useState(null);
  const [orders, setOrders] = useState(null);

  // get all comments Homestay
  useEffect(() => {
    const getComments = async () => {
      const payload = { homestay_id: data?.homestay_id?._id };
      const response = await commentApi.getAllCommentInHomestay(payload);
      setComments(response?.data);
    };
    getComments();
  }, [data]);

  // get comment by order_id
  const [commentOrderId, setCommentOrderId] = useState('');
  const handleSetCommentOrderId = () => {
    setCommentOrderId(data?._id);
  };
  const [commentByOrderId, setCommentByOrderId] = useState(null);
  useEffect(() => {
    const getCommentByOrderId = async () => {
      const payload = { filters: { order_id: data?._id }, limit: 1 };
      const response = await commentApi.getAll(payload);
      setCommentByOrderId(response?.data);
    };
    getCommentByOrderId();
  }, [data, commentOrderId]);

  // get my order in homestay
  useEffect(() => {
    const getOrders = async () => {
      const payload = {
        filters: {
          homestay_id: data?.homestay_id?._id,
          user_id: currentUser?.data?._id,
          status: ORDER_STATUS.approved.en,
        },
      };
      const response = await orderApi.getAll(payload);
      setOrders(response?.data);
    };
    getOrders();
  }, [currentUser, data?.homestay_id?._id]);

  const checkUserCommented = () => {
    const isTimeAfterNow = moment(data?.start).isSameOrBefore(moment());
    const isCheckConditionReview =
      !seller && orderStatus === ORDER_STATUS.approved.en && isTimeAfterNow;
    if (isCheckConditionReview) {
      return true;
    } else {
      return false;
    }
  };

  const renderAddressHomestay = () => {
    if (!data) {
      return '';
    }
    const addresses = data?.homestay_id?.addresses;
    const address = addresses?.address;
    const district = addresses?.district?.name;
    const province = addresses?.province?.name;
    const ward = addresses?.ward?.name;
    return `${address}, ${ward}, ${district}, ${province}`;
  };

  return (
    <Fragment>
      <Card className="order-item">
        <Title level={4}>{data?.homestay_id?.name}</Title>
        <div style={{ fontWeight: 'bold' }}>
          Địa chỉ: {renderAddressHomestay()}{' '}
        </div>
        <div style={{ fontWeight: 'bold' }}>
        Thời gian : {moment(data?.start).format('DD/MM/YYYY')} - {moment(data?.end).format('DD/MM/YYYY')}
        </div>
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
        <div className="order-item__bottom-wrap">
          <div>
            {checkUserCommented() &&
              Array.isArray(commentByOrderId) &&
              (!(commentByOrderId?.length > 0) ? (
                <div
                  onClick={() => showModal(data?._id)}
                  className="order-item__review"
                >
                  <AiFillStar size={25} color="#fadb14" />
                  <span>Cho điểm và đánh giá </span>
                </div>
              ) : (
                <div className="order-item__review">
                  <AiFillStar size={25} />
                  <span>Đã hoàn thành đánh giá </span>
                </div>
              ))}
            {!checkUserCommented() &&
              !seller &&
              orderStatus === ORDER_STATUS.approved.en && (
                <div className="order-item__review">
                  <AiFillStar size={25} color="#B15200" />
                  <span>
                    Đợi đến ngày {moment(data?.start).format('DD/MM/YYYY')} để
                    được đánh giá
                  </span>
                </div>
              )}
          </div>
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
        </div>
      </Card>

      {visibleFormReview && (
        <FormAssessmentHomestay
          handleSetCommentOrderId={handleSetCommentOrderId}
          homestay={data?.homestay_id}
          orderId={orderId}
          visible={visibleFormReview}
          loading={loading}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
      )}
    </Fragment>
  );
}
