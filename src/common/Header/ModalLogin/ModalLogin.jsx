import { unwrapResult } from '@reduxjs/toolkit';
import { Button, Checkbox, Form, Input, Modal, Select } from 'antd';
import {
  fetchAllHomestays,
  fetchAllHomestaySearch,
} from 'features/Homestay/HomestaySlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { login, signup } from '../../../features/Auth/AuthSlice';
const { Option } = Select;
const ModalLogin = (props) => {
  // const store = useContext(AuthContext);
  //end context
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  let dispatch = useDispatch();
  const [nameForm, setNameForm] = useState('sign-in');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const loading = useSelector((state) => state.auth.loading);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      props.hideModalLogin();
      setConfirmLoading(false);
    }, 1500);
  };
  const [form] = Form.useForm();

  //login
  const onFinish = async (values) => {
    try {
      if (nameForm === 'sign-in') {
        dispatch(login(values));
      }
      if (nameForm !== 'sign-in') {
        dispatch(signup(values));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      form.resetFields();
      props.hideModalLogin();
    }
  }, [currentUser]);

  return (
    <Modal
      maskClosable={false}
      visible={props.visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={props.hideModalLogin}
      footer={null}
    >
      <h1>
        <Button
          onClick={() => setNameForm('sign-up')}
          style={{
            borderColor: '#ffadd2',
            color: '#c41d7f',
            width: '11.5rem',
            backgroundColor: nameForm === 'sign-up' ? '#fff0f6' : '#fff',
            fontWeight: nameForm === 'sign-up' ? 'bold' : 'normal',
          }}
          size={20}
        >
          ????ng k??
        </Button>
        <Button
          onClick={() => setNameForm('sign-in')}
          style={{
            borderColor: '#ffadd2',
            color: '#c41d7f',
            width: '11.5rem',
            marginLeft: '2rem',
            backgroundColor: nameForm !== 'sign-up' ? '#fff0f6' : '#fff',
            fontWeight: nameForm !== 'sign-up' ? 'bold' : 'normal',
          }}
          size={20}
        >
          ????ng nh???p
        </Button>
      </h1>

      <Form
        layout="vertical"
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'E-mail kh??ng h???p l???!',
            },
            {
              required: true,
              message: 'Xin vui l??ng ??i???n E-mail c???a b???n!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="M???t kh???u"
          rules={[
            {
              required: true,
              message: 'M???t kh???u ??t nh???t 6 k?? t??? !',
              min: 6,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        {nameForm === 'sign-up' && (
          <div>
            <Form.Item
              name="passwordConfirm"
              label="X??c nh???n m???t kh???u"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng x??c nh???n m???t kh???u c???a b???n !',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error('Vui l??ng x??c nh???n ????ng m???t kh???u!!')
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="name"
              label="T??n c???a b???n"
              tooltip="B???n mu???n ng?????i kh??c g???i b???n l?? g???"
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng nh???p t??n c???a b???n!',
                  min: 2,
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone_number"
              label="S??? ??i???n tho???i"
              rules={[
                {
                  required: false,
                  pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
                  message: 'Vui l??ng nh???p s??? ??i???n tho???i',
                },
              ]}
            >
              <Input
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>

            <Form.Item name="gender" label="Gi???i t??nh">
              <Select placeholder="Ch???n gi???i t??nh c???a b???n">
                <Option value="male">Nam</Option>
                <Option value="female">N???</Option>
                <Option value="other">Kh??c</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error('Vui l??ng ?????c th???a thu???n')),
                },
              ]}
            >
              <Checkbox>
                T??i ???? ?????c
                <span
                  style={{
                    color: '#1890ff',
                    fontWeight: '600',
                    marginLeft: '5px',
                  }}
                >
                  th???a thu???n
                </span>
              </Checkbox>
            </Form.Item>
          </div>
        )}
        <Form.Item style={{ paddingTop: '1.5rem' }}>
          <Button disabled={loading} type="primary" htmlType="submit">
            {nameForm === 'sign-up' ? '  ????ng k??' : '????ng nh???p'}
          </Button>
        </Form.Item>
      </Form>
      {/* <style jsx="true">{`
        .ant-modal-wrap {
          background-image: linear-gradient(to right, #37ccff, #7b22ff);
        }
      `}</style> */}
    </Modal>
  );
};
export default ModalLogin;
