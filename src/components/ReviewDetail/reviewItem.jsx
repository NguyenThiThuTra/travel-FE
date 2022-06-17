import { UserOutlined } from '@ant-design/icons';
import { Avatar, Image, Rate } from 'antd';
import { ORDER_STATUS } from 'constants/order';
import { getAllOrder, getAllOrderAction } from 'features/Order/OrderSlice';
import { getLikeReviewByUserId } from 'features/Reviews/ReviewsSlice';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { useDispatch } from 'react-redux';

export function ReviewItem({ review, handleLikeReview }) {
  const dispatch = useDispatch();

  const user = review?.user_id;

  const [orders, setOrders] = useState(null);
  const [currentLikeReview, setCurrentLikeReview] = useState(null);

  useEffect(() => {
    if (!user) return;
    const getCurrentLikeReview = async () => {
      try {
        const response = await dispatch(
          getLikeReviewByUserId({
            user_id: user?._id,
            review_id: review?._id,
          })
        ).unwrap();
        setCurrentLikeReview(response?.data);
      } catch (error) {
        console.error(error);
      }
    };
    getCurrentLikeReview();
  }, [review?._id, user?._id]);

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

  // handle render review
  const numberSlice = 200;
  const [readMore, setReadMore] = useState(false);
  const renderReviewContent = () => {
    const reviewText = review?.review;
    const reviewTextLength = reviewText?.length;
    const reviewTextPreview = reviewText?.slice(0, numberSlice) || '';
    const reviewTextReadMore = reviewText?.slice(numberSlice) || '';
    const reviewTextReadMoreLength = reviewTextReadMore?.length || 0;

    if (reviewTextReadMoreLength) {
      return (
        <Fragment>
          <div className="review-box__content">
            <div className="review-box__content-review">
              {' '}
              <span>{reviewTextPreview}</span>
              <span>{readMore && reviewTextReadMore}</span>
            </div>
            {readMore && (
              <ul className="review-box__list-schedule">
                {review &&
                  Object.values(review?.schedule || [])?.map((day, index) => (
                    <li>
                      {`Ngày ${index + 1} : `} {day}
                    </li>
                  ))}
              </ul>
            )}

            <span
              onClick={() => setReadMore((pre) => !pre)}
              style={{
                color: '#1877F2',
                cursor: 'pointer',
                marginLeft: '10px',
              }}
            >
              {readMore ? 'Thu gọn' : 'Xem thêm...'}
            </span>
          </div>
        </Fragment>
      );
    }
    // schedules
    const schedules = Object.values(review?.schedule || []);

    let totalReviewUserIndex = null;
    const getTotalReviewUser = (total, data, index) => {
      const result = total + (data?.length || 0);
      if (result > numberSlice) {
        totalReviewUserIndex = index;
      }
      return result;
    };
    const allReviewUser = schedules.reduce(
      getTotalReviewUser,
      reviewTextLength
    );
    // if (!totalReviewUserIndex) {
    //   return (
    //     <div className="review-box__content">
    //       <div className="review-box__content-review">
    //         <span>{reviewText}</span>
    //       </div>
    //       <ul className="review-box__list-schedule">
    //         {review &&
    //           Object.values(review?.schedule || [])?.map((day, index) => (
    //             <li>
    //               {`Ngày ${index + 1} : `} {day}
    //             </li>
    //           ))}
    //       </ul>
    //     </div>
    //   );
    // }
    return (
      <div className="review-box__content">
        <div className="review-box__content-review">
          <span>{reviewText}</span>
        </div>
        <ul className="review-box__list-schedule">
          {review &&
            Object.values(review?.schedule || [])?.map((day, index) => (
              <li>
                {`Ngày ${index + 1} : `} {day}
              </li>
            ))}
        </ul>
      </div>
    );
  };

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

        {renderReviewContent()}

        <div onClick={handleLikeReview} className="review-box__action">
          <span style={{ marginRight: '1rem' }}>{review?.likeReview}</span>
          <AiOutlineLike
            color={currentLikeReview ? 'rgb(32, 120, 244)' : '#23232c'}
            size={20}
          />{' '}
          <span
            style={{
              color: currentLikeReview ? 'rgb(32, 120, 244)' : '#23232c',
            }}
          >
            Thích
          </span>
        </div>
      </div>
      <div>
        {review?.images?.length > 0 && (
          <Fragment>
            <Image
              style={{ marginTop: '2rem' }}
              preview={{ visible: false }}
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
