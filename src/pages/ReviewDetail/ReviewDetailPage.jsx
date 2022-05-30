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
  const loadingAction = useSelector(useLoadingActionSelector);
  const likeReview = useSelector(useLikeReviewSelector);

  useEffect(() => {
    if (!id) return;
    dispatch(
      getAllReviews({
        filters: { province: parseInt(id) },
      })
    );
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
