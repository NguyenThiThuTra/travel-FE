import { getVNPAYReturnUrlStatus } from 'constants/vnp_ResponseCode';
import { ipnVNPayment, returnVNPayment } from 'features/Payment/PaymentSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Typography, Alert, message } from 'antd';
import { RouteConstant } from 'constants/RouteConstant';
import { toast } from 'react-toastify';
import { ORDER_STATUS } from 'constants/order';
import { updateOrder } from 'features/Order/OrderSlice';
const querystring = require('querystring');

const { Title } = Typography;

export default function PaymentVnPayReturn() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [responseVNPayment, setResponseVNPayment] = useState(null);

  useEffect(() => {
    (async () => {
      const payload = { query: location.search };
      const querySearch = querystring.parse(location.search);
      const order_id = querySearch?.vnp_TxnRef;
      console.log({ querySearch });
      const response = await dispatch(returnVNPayment(payload)).unwrap();
      setResponseVNPayment(response);
      if (response?.code === '00') {
        // history.push(RouteConstant.HistoryPage);
        message.success(getVNPAYReturnUrlStatus(response?.code));

        const formOrder = { status: ORDER_STATUS.approved.en };
        await dispatch(
          updateOrder({
            id: order_id,
            order: formOrder,
          })
        ).unwrap();
        await history.push(RouteConstant.HistoryPage.path);
      } else {
        message.error(getVNPAYReturnUrlStatus(response?.code));
        await history.go(-3);
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
