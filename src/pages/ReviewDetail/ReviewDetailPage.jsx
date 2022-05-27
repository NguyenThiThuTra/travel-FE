import { ReviewItem } from 'components/ReviewDetail/reviewItem';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import {
  getAllReviews,
  updateLikeReview,
  useDataReviewsSelector,
} from 'features/Reviews/ReviewsSlice';
import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './_ReviewDetailPage.scss';

export default function ReviewDetailPage() {
  const dispatch = useDispatch();

  const params = useParams();
  const { id } = params;

  const currentUser = useSelector(useCurrentUserSelector);
  const reviews = useSelector(useDataReviewsSelector);
  console.log({ reviews });

  useEffect(() => {
    if (!id) return;
    dispatch(
      getAllReviews({
        filters: { province: parseInt(id) },
      })
    );
  }, [id]);
  // updateLikeReview
  const handleLikeReview = (review) => {
    if (!currentUser || !review) return;
    const payload = {
      review_id: review._id,
      user_id: currentUser?.data?._id,
    };
    dispatch(updateLikeReview(payload));
  };
  return (
    <div className="review-detail-page">
      <div className="review-detail">
        {reviews?.data?.map((review) => (
          <Fragment key={review?._id}>
            <ReviewItem
              handleLikeReview={() => handleLikeReview(review)}
              review={review}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
