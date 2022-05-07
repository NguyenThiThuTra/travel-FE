import axiosClient from './axiosClient';

const paymentApi = {
  createVNPayment(payload) {
    const url = '/payment/VNPayment';
    return axiosClient.post(url, payload);
  },
};
export default paymentApi;
