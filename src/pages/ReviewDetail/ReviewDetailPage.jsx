import { Typography } from 'antd';
import provincesOpenApi from 'api/provincesOpenApi';
import { ReviewItem } from 'components/ReviewDetail/reviewItem';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { useLoadingActionSelector } from 'features/commonSlice';
import {
  getAllReviews,
  updateLikeReview,
  useDataReviewsSelector,
} from 'features/Reviews/ReviewsSlice';
import { Fragment, useEffect, useState } from 'react';
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

  const [paging, setPaging] = useState({ limit: 10, page: 1 });
  const [dataReview, setDataReview] = useState([]);
  const [province, setProvince] = useState(null);
  useEffect(() => {
    const getProvince = async () => {
      const res = await provincesOpenApi.getDistricts(id);
      setProvince(res);
    };
    getProvince();
  }, [id]);
  useEffect(() => {
    const getDataReview = async () => {
      if (!id) return;
      try {
        const res = await dispatch(
          getAllReviews({
            filters: { province: parseInt(id) },
            limit: paging.limit,
            page: paging.page,
            sort: '-createdAt',
          })
        ).unwrap();
        setDataReview(res?.data);
        const data = res?.data;
        setDataReview(data);
      } catch (error) {
        console.error(error);
      }
    };
    getDataReview();
  }, [id, currentUser]);
  // updateLikeReview
  const handleLikeReview = async (review) => {
    if (loadingAction || !currentUser || !review) return;
    const payload = {
      review_id: review._id,
      user_id: currentUser?.data?._id,
    };
    try {
      const response = await dispatch(updateLikeReview(payload)).unwrap();
      const resultUpdate = await response?.data;
      setDataReview((prevState) => {
        return prevState.map((item) => {
          if (item._id === review._id) {
            const newData = { ...item };
            newData.isCurrentUserLike = !newData.isCurrentUserLike;
            // newData.active = !item?.active;
            newData.likeReview = resultUpdate?.likeReview;
            return newData;
          }
          return item;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const loadMore = async () => {
    try {
      const res = await dispatch(
        getAllReviews({
          filters: { province: parseInt(id) },
          limit: paging.limit,
          page: paging.page + 1,
          sort: '-createdAt',
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
        <Typography.Title
          level={3}
          style={{
            padding: '2rem 0',
            position: 'sticky',
            top: '60px',
            backgroundColor: '#fafafa',
            zIndex: 10,
          }}
        >
          Review: {province?.name}
        </Typography.Title>
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
