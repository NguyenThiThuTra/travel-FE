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
              status: ORDER_STATUS.holding.en,
              payment: 'vnpay',
            })
          ).unwrap();
          // console.log({ result });
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
              message="Thanh toán đa dạng, bảo mật 100%.
"
              type="info"
              showIcon
            />
          </div>

          <Row gutter={[24, 24]}>
            <Col className="gutter-row" span={16}>
              {!bookingStatus && (
                <div className="payment-methods">
                  <Title level={4}> Phương thức thanh toán</Title>
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
                              Thanh toán VNPAY
                            </div>
                          </div>
                          {paymentMethod === 'vnpay' && (
                            <div>
                              <Form.Item
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      'Xin vui lòng nhập chọn ngân hàng!',
                                  },
                                ]}
                                name="bankCode"
                                label="Chọn ngân hàng"
                              >
                                <Select>
                                  <Select.Option value="NCB">NCB</Select.Option>
                                </Select>
                              </Form.Item>

                              <Form.Item
                                name="orderDescription"
                                label="Nội dung chuyển khoản"
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      'Xin vui lòng nhập nội dung chuyển khoản!',
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
                              //     message: 'Xin vui lòng nhập số tiền!',
                              //   },
                              // ]}
                            >
                              <Input />
                            </Form.Item> */}
                            </div>
                          )}
                        </Radio>
                        <Radio value="visa-card">Thẻ thanh toán quốc tế</Radio>
                      </Space>
                    </Radio.Group>
                  </div>
                </div>
              )}
              {bookingStatus && 'Đặt xử lí đơn hàng !'}
            </Col>
            <Col className="gutter-row" span={8}>
              <div className="payment-contact">
                <Title level={4}> Phương thức thanh toán</Title>
                <div className="payment-methods__main">
                  <div className="booking-info">
                    <div className="booking-info__item">
                      <div className="booking-info__label"> Họ và tên</div>
                      <div className="booking-info__value">
                        {' '}
                        {orderDataForm?.name}
                      </div>
                    </div>
                    <div className="booking-info__item">
                      <div className="booking-info__label"> Số điện thoại</div>
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
                      <div className="booking-info__label"> Thời gian</div>
                      <div className="booking-info__value">
                        {`Từ ${orderDataForm?.from_date} đến ${orderDataForm?.to_date}`}
                      </div>
                    </div>
                    <div className="booking-info__item">
                      <List
                        className="booking-info-orders"
                        size="small"
                        header={
                          <div className="booking-info-orders__item">
                            <div className="booking-info-orders__label">
                              Số lượng phòng :
                            </div>
                            <div className="booking-info-orders__value">
                              {orders.totalSelectedRooms}
                            </div>
                          </div>
                        }
                        footer={
                          <div className="booking-info-orders__item">
                            <div className="booking-info-orders__label booking-info-orders__label--totalPrice">
                              Tổng giá tiền :
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
                                  Tên :
                                </div>
                                <div className="booking-info-orders__value">
                                  {item?.name}
                                </div>
                              </div>
                              <div className="booking-info-orders__item">
                                <div className="booking-info-orders__label">
                                  Số lượng :
                                </div>
                                <div className="booking-info-orders__value">
                                  {item?.select_room}
                                </div>
                              </div>
                              <div className="booking-info-orders__item">
                                <div className="booking-info-orders__label">
                                  Giá :
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
              Thanh toán bảo mật
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PaymentPage;
