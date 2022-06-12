import { UserOutlined } from '@ant-design/icons';
import { Avatar, Image, Rate } from 'antd';
import { ORDER_STATUS } from 'constants/order';
import { getAllOrder, getAllOrderAction } from 'features/Order/OrderSlice';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { useDispatch } from 'react-redux';

export function ReviewItem({ review, handleLikeReview }) {
  const dispatch = useDispatch();

  const user = review?.user_id;

  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (!user) return;
    const getOrderByUserId = async () => {
      try {
        const response = await dispatch(
          getAllOrderAction({
            limit: 4,
            filters: { user_id: user?._id, status: ORDER_STATUS.approved.en },
          })
        ).unwrap();
        setOrders(response?.data);
      } catch (error) {
        console.error(error);
      }
    };
    getOrderByUserId();
  }, [user]);
  const arrNameHomestay = useMemo(() => {
    return orders
      ?.filter((order) => order?.homestay_id)
      ?.map((order) => order?.homestay_id?.name)
      ?.join(', ');
  }, [orders]);

  // visiblePreviewGroup
  const [visiblePreviewGroup, setVisiblePreviewGroup] = useState(false);
  return (
    <div className="review-box">
      <div className="review-box-main">
        <div className="review-box__header">
          <Avatar
            src={user?.avatar}
            style={{
              backgroundColor: '#87d068',
              minWidth: '35px',
              minHeight: '35px',
              marginRight: '10px',
            }}
            icon={<UserOutlined />}
          />
          <div className="review-box__name">{user?.name}</div>
        </div>
        <div className="review-box__location">
          Đã từng ở tại {arrNameHomestay}...
        </div>

        <div className="review-box__content">
          <div className="review-box__content-review">{review?.review}</div>
          <ul className="review-box__list-schedule">
            {review &&
              Object.values(review?.schedule || [])?.map((day, index) => (
                <li>
                  {`Ngày ${index + 1} : `} {day}
                </li>
              ))}
          </ul>
        </div>

        <div onClick={handleLikeReview} className="review-box__action">
          {review?.likeReview} <AiOutlineLike size={20} /> Thích
        </div>
      </div>
      <div>
        {review?.images?.length > 0 && (
          <Fragment>
            <Image
              style={{ marginTop: '2rem' }}
              preview={{ visiblePreviewGroup: false }}
              width={200}
              src={review?.images?.[0]}
              alt="image preview"
              onClick={() => setVisiblePreviewGroup(true)}
            />

            <div style={{ display: 'none' }}>
              <Image.PreviewGroup
                preview={{
                  visible: visiblePreviewGroup,
                  onVisibleChange: (vis) => setVisiblePreviewGroup(vis),
                }}
              >
                {review?.images?.map((image, index) => (
                  <Image key={index} src={image} alt={`preview ${index}`} />
                ))}
              </Image.PreviewGroup>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}
