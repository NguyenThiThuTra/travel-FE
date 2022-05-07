import { ipnVNPayment, returnVNPayment } from 'features/Payment/PaymentSlice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

export default function PaymentVnPayReturn() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const payload = { query: location.search };
      dispatch(ipnVNPayment(payload));
      dispatch(returnVNPayment(payload));
    })();
  }, []);
  return <div>PaymentVnPayReturn</div>;
}
