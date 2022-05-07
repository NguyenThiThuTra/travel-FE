import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
} from 'antd';
import { createVNPayment } from 'features/Payment/PaymentSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Payment = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [componentSize, setComponentSize] = useState('default');

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const onFinish = async (values) => {
    const { amount, bankCode, orderDescription, orderType } = values;
    // const payload = { amount, bankCode, orderDescription, orderType };
    const payload = {
      amount: 100000,
      bankCode: 'NCB',
      orderDescription: 'Noi dung ck',
      orderType: 'billpayment',
      language:'vn'
    };
    try {
      const response = await dispatch(createVNPayment(payload)).unwrap();
      await window.open(response?.vnpUrl);
      // history.replace('/history');
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ padding: '6rem' }}>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          size: componentSize,
        }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
      >
        <Form.Item label="Form Size" name="size">
          <Radio.Group>
            <Radio.Button value="small">Small</Radio.Button>
            <Radio.Button value="default">Default</Radio.Button>
            <Radio.Button value="large">Large</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          // rules={[
          //   {
          //     required: true,
          //     message: 'Xin vui lòng nhập số tiền!',
          //   },
          // ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          // rules={[
          //   {
          //     required: true,
          //     message: 'Xin vui lòng nhập chọn ngân hàng!',
          //   },
          // ]}
          name="bankCode"
          label="BankCode"
        >
          <Select>
            <Select.Option value="NCB">NCB</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="orderDescription"
          label="OrderDescription"
          // rules={[
          //   {
          //     required: true,
          //     message: 'Xin vui lòng nhập số tiền!',
          //   },
          // ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
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
        </Form.Item>
        <Form.Item label="Button">
          <Button
            style={{ marginTop: '16px' }}
            type="primary"
            htmlType="submit"
            block
          >
            Đặt phòng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Payment;
