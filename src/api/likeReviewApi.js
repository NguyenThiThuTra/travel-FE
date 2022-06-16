import axiosClient from './axiosClient';

const likeReviewApi = {
  getLikeReviewByUserId(payload) {
    const url = '/likeReview/review';
    return axiosClient.post(url, payload);
  },
};
export default likeReviewApi;
