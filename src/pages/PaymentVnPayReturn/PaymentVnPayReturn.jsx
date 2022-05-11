import { getVNPAYReturnUrlStatus } from 'constants/vnp_ResponseCode';
import { ipnVNPayment, returnVNPayment } from 'features/Payment/PaymentSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Typography, Alert, message } from 'antd';
import { RouteConstant } from 'constants/RouteConstant';
import { toast } from 'react-toastify';

const { Title } = Typography;

export default function PaymentVnPayReturn() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [responseVNPayment, setResponseVNPayment] = useState(null);

  useEffect(() => {
    (async () => {
      const payload = { query: location.search };
      const response = await dispatch(returnVNPayment(payload)).unwrap();
      setResponseVNPayment(response);
      if (response?.code === '00') {
        history.push(RouteConstant.HistoryPage);
        message.success(getVNPAYReturnUrlStatus(response?.code));
      } else {
        message.error(getVNPAYReturnUrlStatus(response?.code));
      }
    })();
  }, []);
  return (
    <div
      className=""
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <div>

        <Title level={3}>PaymentVnPayReturn</Title>

        <Alert
          message={getVNPAYReturnUrlStatus(responseVNPayment?.code)}
          type="success"
        />
      </div>
    </div>
  );
}
