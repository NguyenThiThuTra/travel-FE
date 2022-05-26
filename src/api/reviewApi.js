import axiosClient from './axiosClient';

const reviewApi = {
  postReview(payload) {
    const url = '/reviews';
    return axiosClient.post(url, payload);
  },
  getAllReviews(params) {
    const url = '/reviews';
    return axiosClient.get(url, { params });
  },
  getReview(id) {
    const url = `/reviews/${id}`;
    return axiosClient.get(url);
  },
};
export default reviewApi;
