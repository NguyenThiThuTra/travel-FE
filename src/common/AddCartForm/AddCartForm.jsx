import { Button, DatePicker, Form, Input, List } from 'antd';
import { RouteConstant } from 'constants/RouteConstant';
import moment from 'moment';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { addOrder } from '../../features/Order/OrderSlice';
import './_AddCartForm.scss';

const { RangePicker } = DatePicker;
export const AddCartForm = ({ orders, onCloseModal }) => {
  const history = useHistory();
  const location = useLocation();
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);

  const querySearch = queryString.parse(location.search);
  // default value
  const [rangePickerValue, setRangePickerValue] = useState([
    querySearch.from_date,
    querySearch.to_date,
  ]);
  
  // default filter query search
  useEffect(() => {
    if (!querySearch) return;

    if (querySearch?.from_date && querySearch?.to_date) {
      setRangePickerValue([querySearch.from_date, querySearch.to_date]);
    }
  }, [location]);
  // end default value
  //form
  useEffect(() => {
    form.setFieldsValue({
      email: currentUser?.data?.email,
      name: currentUser?.data?.name,
      phone_number:
        currentUser?.data?.phone_number?.length < 10
          ? `0${currentUser?.data?.phone_number} `
          : currentUser?.data?.phone_number,
      // check_in_check_out: time,
    });
  });

  const onFinish = async (values) => {
    const from_date = rangePickerValue?.[0];
    const to_date = rangePickerValue?.[1];

    const homestay_id = orders?.homestay_id;
    const user_id = currentUser?.data?._id;
    const booking = orders?.orders?.map((order) => {
      return { category_id: order?._id, select_room: order?.select_room };
    });

    const { email, name, phone_number, note } = values;
    const orderDataForm = {
      email,
      name,
      phone_number,
      note,
      from_date,
      to_date,
      homestay_id,
      user_id,
      order: booking,
      orders
    };
    try {
      // await dispatch(addOrder(orderDataForm)).unwrap();
      // history.replace('/history');
      history.push({
        pathname: RouteConstant.PaymentPage.path,
        state: { orderDataForm },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo);
  };
  function onChangeDate(dates, dateStrings) {
    // console.log(dates);
    // console.log('From: ', dates[0], ', to: ', dates[1]);
    // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }
  function disabledDate(current) {
    return current && current < moment().startOf('day');
    // return true;
  }
  function handleChangeSelect(value) {
    // console.log(`selected ${value}`);
  }
  //end form
  return (
    <Form
      form={form}
      layout="vertical"
      className="form-contact"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <h2 className="form-contact__title">Đặt phòng</h2>
      <div className="form-contact__content">
        <Form.Item
          label="Họ tên"
          name="name"
          rules={[
            {
              required: true,
              message: 'Xin vui lòng nhập tên của bạn!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'E-mail không hợp lệ!',
            },
            {
              required: true,
              message: 'Xin vui lòng điền E-mail của bạn!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone_number"
          label="Số điện thoại"
          rules={[
            {
              required: true,
              pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
              message: 'Vui lòng nhập số điện thoại',
            },
          ]}
        >
          <Input
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
        <Form.Item
          style={{ paddingTop: '8px' }}
          rules={[
            {
              required: false,
            },
          ]}
          label={`Ngày check in và check out:`}
        >
          {/* moment(rangePickerValue[0]), moment(rangePickerValue[1]) */}
          <RangePicker
            defaultValue={[
              moment(rangePickerValue[0], 'YYYY/MM/DD'),
              moment(rangePickerValue[1], 'YYYY/MM/DD'),
            ]}
            format={'YYYY/MM/DD'}
            value={[
              moment(rangePickerValue[0], 'YYYY/MM/DD'),
              moment(rangePickerValue[1], 'YYYY/MM/DD'),
            ]}
            disabledDate={disabledDate}
            disabled={true}
            placeholder={['Check-in date', 'Check-out date']}
            className="form-filters__input"
            ranges={{
              Today: [
                moment().format('YYYY/MM/DD'),
                moment().format('YYYY/MM/DD'),
              ],
              'This Month': [
                moment().startOf('month'),
                moment().endOf('month'),
              ],
            }}
            onChange={onChangeDate}
          />
        </Form.Item>
        <div>
          <List
            className="list-orders"
            size="small"
            header={
              <div>
                <div>{`Số lượng phòng : ${orders.totalSelectedRooms}`}</div>
              </div>
            }
            footer={
              <div>
                <div>{`Tổng giá tiền : ${orders.totalPriceOrders}`}</div>
              </div>
            }
            bordered
            dataSource={orders?.orders}
            renderItem={(item) => (
              <List.Item className="list-orders-item">
                <div>{`Tên : ${item?.name}`} </div>
                <div>{`Số lượng : ${item?.select_room}`}</div>
                <div>{`Giá : ${item?.price * item?.select_room}`}</div>
              </List.Item>
            )}
          />
        </div>
        <Form.Item
          name="note"
          label="Ghi chú"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input.TextArea
            style={{
              width: '100%',
            }}
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </Form.Item>
        <Button
          style={{ marginTop: '16px' }}
          type="primary"
          htmlType="submit"
          block
        >
          Đặt phòng
        </Button>
      </div>
    </Form>
  );
};
