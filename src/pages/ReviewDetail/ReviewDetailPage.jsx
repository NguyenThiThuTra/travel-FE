import { ReviewItem } from 'components/ReviewDetail/reviewItem';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import {
  useLoadingActionSelector,
  useLoadingAppSelector,
} from 'features/commonSlice';
import {
  getAllReviews,
  updateLikeReview,
  useDataReviewsSelector,
  useLikeReviewSelector,
} from 'features/Reviews/ReviewsSlice';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './_ReviewDetailPage.scss';

export default function ReviewDetailPage() {
  const dispatch = useDispatch();

  const params = useParams();
  const { id } = params;

  const currentUser = useSelector(useCurrentUserSelector);
  const reviews = useSelector(useDataReviewsSelector);
  const loadingAction = useSelector(useLoadingActionSelector);
  const likeReview = useSelector(useLikeReviewSelector);

  const [paging, setPaging] = useState({ limit: 1, page: 1 });
  const [dataReview, setDataReview] = useState([]);
  useEffect(() => {
    const getDataReview = async () => {
      if (!id) return;
      try {
        const res = await dispatch(
          getAllReviews({
            filters: { province: parseInt(id) },
            limit: paging.limit,
            page: paging.page,
          })
        ).unwrap();
        setDataReview(res.data);
        const data = res?.data;
        setDataReview(data);
      } catch (error) {
        console.error(error);
      }
    };
    getDataReview();
  }, [id, likeReview]);
  // updateLikeReview
  const handleLikeReview = async (review) => {
    if (loadingAction || !currentUser || !review) return;
    const payload = {
      review_id: review._id,
      user_id: currentUser?.data?._id,
    };
    dispatch(updateLikeReview(payload));
  };

  const loadMore = async () => {
    try {
      const res = await dispatch(
        getAllReviews({
          filters: { province: parseInt(id) },
          limit: paging.limit,
          page: paging.page + 1,
        })
      ).unwrap();
      setDataReview(res.data);
      const data = res?.data;
      setDataReview((preState) => [...dataReview, ...data]);
      setPaging((prevState) => ({ ...prevState, page: prevState.page + 1 }));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="review-detail-page">
      <div className="review-detail">
        {dataReview?.map((review) => (
          <Fragment key={review?._id}>
            <ReviewItem
              handleLikeReview={() => handleLikeReview(review)}
              review={review}
            />
          </Fragment>
        ))}

        {reviews?.paging?.current_page < reviews?.paging?.last_page && (
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
      </div>
    </div>
  );
}
