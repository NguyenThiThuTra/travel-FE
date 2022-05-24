import axiosClient from './axiosClient';

const reviewApi = {
  postReview(payload) {
    const url = '/reviews';
    return axiosClient.post(url, payload);
  },
};
export default reviewApi;
