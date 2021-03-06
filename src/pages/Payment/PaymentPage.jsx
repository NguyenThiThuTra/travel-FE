import {
  Alert,
  Button,
  Col,
  Typography,
  Form,
  Input,
  Radio,
  Row,
  Space,
  Select,
  List,
} from 'antd';
import { createVNPayment } from 'features/Payment/PaymentSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import VNPAY from 'assets/images/vnpay/vnpay.png';

import './_PaymentPage.scss';
import { addOrder } from 'features/Order/OrderSlice';
import { ORDER_STATUS } from 'constants/order';

const { Title } = Typography;

const PaymentPage = () => {
  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();

  const [componentSize, setComponentSize] = useState('default');
  const [paymentMethod, setPaymentMethod] = useState('');

  const [bookingStatus, setBookingStatus] = useState(false);

  const orderDataForm = location?.state?.orderDataForm;
  const orders = orderDataForm?.orders;

  const onChangePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleGoPayment = async (values) => {
    if (!orderDataForm) {
      return;
    }
    switch (paymentMethod) {
      case 'vnpay':
        const { bankCode, orderDescription } = values;
        // const payload = { amount, bankCode, orderDescription, orderType };

        try {
          const { orders, ...payloadAddOrder } = orderDataForm;
          const result = await dispatch(
            addOrder({
              ...payloadAddOrder,
              status: ORDER_STATUS.pending.en,
              payment: 'vnpay',
            })
          ).unwrap();
          console.log({ result });
          const payload = {
            amount: orders.totalPriceOrders,
            bankCode,
            orderDescription,
            orderType: 'other',
            language: 'vn',
            orderId: result?.data?._id,
          };
          const response = await dispatch(createVNPayment(payload)).unwrap();
          setBookingStatus(true);
          window.location.href = response?.vnpUrl;
          // window.open(response?.vnpUrl);
        } catch (error) {
          console.log(error);
        }
        break;

      default:
        break;
    }
  };

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo);
  };

  return (
    <div className="payment-page">
      <div className="section-container">
        <Form
          layout="vertical"
          onFinish={handleGoPayment}
          onFinishFailed={onFinishFailed}
          initialValues={{
            size: componentSize,
          }}
          onValuesChange={onFormLayoutChange}
          size={componentSize}
        >
          <div className="payment-info">
            <Alert
              message="Thanh to??n ??a d???ng, b???o m???t 100%.
"
              type="info"
              showIcon
            />
          </div>

          <Row gutter={[24, 24]}>
            <Col className="gutter-row" span={16}>
              {!bookingStatus && (
                <div className="payment-methods">
                  <Title level={4}> Ph????ng th???c thanh to??n</Title>
                  <div className="payment-methods__main">
                    <Radio.Group
                      style={{ width: '100%' }}
                      onChange={onChangePaymentMethod}
                      value={paymentMethod}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Radio value="vnpay">
                          <div className="payment-methods__item">
                            <span className="payment-methods__img">
                              <img src={VNPAY} width="80px" alt="vnpay" />
                            </span>
                            <div className="payment-methods__name">
                              Thanh to??n VNPAY
                            </div>
                          </div>
                          {paymentMethod === 'vnpay' && (
                            <div>
                              <Form.Item
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      'Xin vui l??ng nh???p ch???n ng??n h??ng!',
                                  },
                                ]}
                                name="bankCode"
                                label="Ch???n ng??n h??ng"
                              >
                                <Select>
                                  <Select.Option value="NCB">NCB</Select.Option>
                                </Select>
                              </Form.Item>

                              <Form.Item
                                name="orderDescription"
                                label="N???i dung chuy???n kho???n"
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      'Xin vui l??ng nh???p n???i dung chuy???n kho???n!',
                                  },
                                ]}
                              >
                                <Input />
                              </Form.Item>
                              {/* <Form.Item
                              name="orderType"
                              label="OrderType"
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: 'Xin vui l??ng nh???p s??? ti???n!',
                              //   },
                              // ]}
                            >
                              <Input />
                            </Form.Item> */}
                            </div>
                          )}
                        </Radio>
                        <Radio value="visa-card">Th??? thanh to??n qu???c t???</Radio>
                      </Space>
                    </Radio.Group>
                  </div>
                </div>
              )}
              {bookingStatus && '?????t x??? l?? ????n h??ng !'}
            </Col>
            <Col className="gutter-row" span={8}>
              <div className="payment-contact">
                <Title level={4}> Ph????ng th???c thanh to??n</Title>
                <div className="payment-methods__main">
                  <div className="booking-info">
                    <div className="booking-info__item">
                      <div className="booking-info__label"> H??? v?? t??n</div>
                      <div className="booking-info__value">
                        {' '}
                        {orderDataForm?.name}
                      </div>
                    </div>
                    <div className="booking-info__item">
                      <div className="booking-info__label"> S??? ??i???n tho???i</div>
                      <div className="booking-info__value">
                        {orderDataForm?.phone_number}
                      </div>
                    </div>
                    <div className="booking-info__item">
                      <div className="booking-info__label"> Email</div>
                      <div className="booking-info__value">
                        {orderDataForm?.email}
                      </div>
                    </div>
                    <div className="booking-info__item">
                      <div className="booking-info__label"> Th???i gian</div>
                      <div className="booking-info__value">
                        {`T??? ${orderDataForm?.from_date} ?????n ${orderDataForm?.to_date}`}
                      </div>
                    </div>
                    <div className="booking-info__item">
                      <List
                        className="booking-info-orders"
                        size="small"
                        header={
                          <div className="booking-info-orders__item">
                            <div className="booking-info-orders__label">
                              S??? l?????ng ph??ng :
                            </div>
                            <div className="booking-info-orders__value">
                              {orders.totalSelectedRooms}
                            </div>
                          </div>
                        }
                        footer={
                          <div className="booking-info-orders__item">
                            <div className="booking-info-orders__label booking-info-orders__label--totalPrice">
                              T???ng gi?? ti???n :
                            </div>
                            <div className="booking-info-orders__value booking-info-orders__value--totalPrice">
                              {orders.totalPriceOrders}
                            </div>
                          </div>
                        }
                        bordered
                        dataSource={orders?.orders}
                        renderItem={(item) => (
                          <List.Item>
                            <div>
                              <div className="booking-info-orders__item">
                                <div className="booking-info-orders__label">
                                  T??n :
                                </div>
                                <div className="booking-info-orders__value">
                                  {item?.name}
                                </div>
                              </div>
                              <div className="booking-info-orders__item">
                                <div className="booking-info-orders__label">
                                  S??? l?????ng :
                                </div>
                                <div className="booking-info-orders__value">
                                  {item?.select_room}
                                </div>
                              </div>
                              <div className="booking-info-orders__item">
                                <div className="booking-info-orders__label">
                                  Gi?? :
                                </div>
                                <div className="booking-info-orders__value ">
                                  {item?.price * item?.select_room}
                                </div>
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="payment-methods__btn-payment">
            <Button type="primary" htmlType="submit" disabled={!paymentMethod}>
              Thanh to??n b???o m???t
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PaymentPage;
