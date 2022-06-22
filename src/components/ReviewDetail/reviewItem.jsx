import { UserOutlined } from '@ant-design/icons';
import { Avatar, Image } from 'antd';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { AiOutlineLike, AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

export function ReviewItem({ review, handleLikeReview }) {
  const dispatch = useDispatch();

  const user = review?.user_id;
  const currentUser = useSelector(useCurrentUserSelector);

  const [orders, setOrders] = useState(null);
  const homestays = review?.homestays;
  const arrNameHomestay = useMemo(() => {
    return homestays?.map((homestay) => homestay?.name)?.join(', ');
  }, [homestays]);

  // visiblePreviewGroup
  const [visiblePreviewGroup, setVisiblePreviewGroup] = useState(false);

  // handle render review
  const numberSlice = 300;
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
                // marginLeft: '10px',
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
    let reviewUserSplit = 0;
    const getTotalReviewUser = (total, data, index) => {
      const result = total + (data?.length || 0);
      if (totalReviewUserIndex === null && result > numberSlice) {
        reviewUserSplit = numberSlice - total;
        totalReviewUserIndex = index;
      }
      return result;
    };
    const allReviewUser = schedules.reduce(
      getTotalReviewUser,
      reviewTextLength
    );
    // console.log({ totalReviewUserIndex, reviewUserSplit });

    if (totalReviewUserIndex !== null) {
      return (
        <div className="review-box__content">
          <div className="review-box__content-review">
            <span>{reviewText}</span>
          </div>
          <ul className="review-box__list-schedule">
            {review &&
              Object.values(review?.schedule || [])?.map((day, index) => {
                const renderHTML = [];
                if (index < totalReviewUserIndex) {
                  renderHTML.push(
                    <li>
                      {`Ngày ${index + 1} : `} {day}
                    </li>
                  );
                }
                if (index === totalReviewUserIndex) {
                  renderHTML.push(
                    <li>
                      {`Ngày ${index + 1} : `} {day.slice(0, reviewUserSplit)}
                      {readMore && day.slice(reviewUserSplit)}
                    </li>
                  );
                }
                if (readMore && index > totalReviewUserIndex) {
                  renderHTML.push(
                    <li>
                      {`Ngày ${index + 1} : `} {day}
                    </li>
                  );
                }
                if (
                  index ===
                  Object.values(review?.schedule || []).length - 1
                ) {
                  renderHTML.push(
                    <span
                      onClick={() => setReadMore((pre) => !pre)}
                      style={{
                        color: '#1877F2',
                        cursor: 'pointer',
                        // marginLeft: '10px',
                      }}
                    >
                      {readMore ? 'Thu gọn' : 'Xem thêm...'}
                    </span>
                  );
                }
                return renderHTML;
                // return (
                //   <li>
                //     {`Ngày ${index + 1} : `} {day}
                //   </li>
                // );
              })}
          </ul>
        </div>
      );
    }
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

  const renderLikeReview = useCallback(
    () => (
      <div onClick={handleLikeReview} className="review-box__action">
        <span
          style={{
            marginRight: '1rem',
            color: review?.isCurrentUserLike ? 'rgb(32, 120, 244)' : '#23232c',
          }}
        >
          {review?.likeReview}
        </span>
        <AiOutlineLike
          color={review?.isCurrentUserLike ? 'rgb(32, 120, 244)' : '#23232c'}
          size={20}
        />{' '}
        <span
          style={{
            color: review?.isCurrentUserLike ? 'rgb(32, 120, 244)' : '#23232c',
          }}
        >
          Thích
        </span>
      </div>
    ),
    [review?.isCurrentUserLike]
  );
  return (
    <div className="review-box">
      <div className="review-box-main">
        <div className="review-box__header">
          <div className="review-box__info">
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
          {moment(review.createdAt).format('DD/MM/YYYY HH:mm ')}
        </div>
        {arrNameHomestay && (
          <div className="review-box__location">
            Đã từng ở tại {arrNameHomestay}...
          </div>
        )}

        {renderReviewContent()}

        {renderLikeReview()}
      </div>
      <div>
        {review?.images?.length > 0 && (
          <Fragment>
            <div
              style={{
                marginTop: '2rem',
                position: 'relative',
                cursor: 'pointer',
              }}
              onClick={() => setVisiblePreviewGroup(true)}
            >
              <Image
                style={{ filter: 'brightness(80%)' }}
                preview={{ visible: false }}
                width={300}
                src={review?.images?.[0]}
                alt="image preview"
              />
              {review?.images?.length > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    background: 'rgba(0,0,0,0.3)',
                  }}
                >
                  <AiOutlinePlus fontSize="35px" color="white" />
                  <span
                    style={{
                      fontSize: '30px',
                      color: 'white',
                      fontWeight: '500',
                    }}
                  >
                    {review?.images?.length}
                  </span>
                </div>
              )}
            </div>

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
