import { Button, Form, Input, Select, Typography, Avatar, Upload } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import {
  addUser,
  getUser,
  updateUser,
} from '../../../features/Users/UsersSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  formItemLayout,
  tailFormItemLayout,
} from '../../../constants/FormLayoutAnt';
import { getCurrentUser } from '../../../features/Auth/AuthSlice';
import { objectToFormData } from '../../../helpers/ConvertObjectToFormData';
const { Title } = Typography;
const { Option } = Select;

export default function ActionFormUser() {
  let { action, id } = useParams();
  const [form] = Form.useForm();
  const history = useHistory();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.users.loading);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const onFinish = async (values) => {
    const { _id, prefix, ...user } = values;
    if (action === 'add') {
      let formData = objectToFormData(user);
      fileAvatar && formData.append('avatar', fileAvatar);
      dispatch(addUser(formData));
    }
    if (action !== 'add' && id) {
      let formData = objectToFormData(user);
      fileAvatar && formData.append('avatar', fileAvatar);
      await dispatch(
        updateUser({
          id: id,
          user: formData,
        })
      ).unwrap();
      // if (currentUser?.data?._id === id) {
      //   await dispatch(getCurrentUser());
      // }
    }
    // form.resetFields();
    history.push('/admin/users');
  };
  const [avatar, setAvatar] = useState('');
  React.useEffect(() => {
    async function defaultForm() {
      if (id) {
        try {
          const resultAction = await dispatch(getUser(id));
          const originalPromiseResult = unwrapResult(resultAction);
          // handle result here
          form.setFieldsValue({
            _id: originalPromiseResult?.data._id,
            email: originalPromiseResult?.data.email,
            name: originalPromiseResult?.data.name,
            phone_number: originalPromiseResult?.data.phone_number,
            gender: originalPromiseResult?.data.gender,
            roles: originalPromiseResult.data.roles,
          });
          setAvatar(originalPromiseResult?.data?.avatar);
        } catch (rejectedValueOrSerializedError) {
          // handle error here
          console.error({ rejectedValueOrSerializedError });
        }
      }
    }
    defaultForm();
    /* eslint-disable */
  }, [id]);

  //handle image
  const [fileAvatar, setFileAvatar] = useState();
  const [fileList, setFileList] = useState([]);
  const onChange = ({ file, fileList }) => {
    setFileList((prev) => fileList);
    let originFileObj = file;
    if (fileList?.length > 0) {
      originFileObj.preview = URL.createObjectURL(originFileObj);
      setFileAvatar((prev) => originFileObj);
    }
  };
  //previewImage
  useEffect(() => {
    return () => {
      fileAvatar && URL.revokeObjectURL(fileAvatar.preview);
    };
  }, [fileAvatar]);
  const onRemove = () => {
    setFileAvatar(null);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="84">+84</Option>
      </Select>
    </Form.Item>
  );
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Button
          onClick={() => history.goBack()}
          style={{ alignSelf: 'flex-end' }}
          type="primary"
          icon={
            <IoIosArrowBack
              style={{ top: '2.5px', left: '-5px', position: 'relative' }}
            />
          }
          size="large"
        >
          Quay l???i
        </Button>
        <Title level={3} align="center">
          {action === 'add' ? 'Th??m m???i ng?????i d??ng' : 'C???p nh???t ng?????i d??ng'}
        </Title>
      </div>

      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          prefix: '84',
        }}
        scrollToFirstError
      >
        <div style={{ textAlign: 'center', margin: '2rem 1rem 3rem' }}>
          <Avatar
            size={{ xs: 80, sm: 80, md: 80, lg: 80, xl: 80, xxl: 100 }}
            style={{ backgroundColor: '#87d068' }}
            icon={<UserOutlined />}
            src={fileAvatar ? fileAvatar?.preview : avatar}
          />
        </div>
        {action !== 'add' && (
          <Form.Item name="_id" label="ID">
            <Input disabled />
          </Form.Item>
        )}
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
              message: 'Vui l??ng nh???p E-mail c???a b???n!',
            },
          ]}
        >
          <Input disabled={action !== 'add'} />
        </Form.Item>
        {action === 'add' && (
          <Fragment>
            <Form.Item
              name="password"
              label="M???t kh???u"
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng nh???p m???t kh???u!',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="passwordConfirm"
              label="X??c nh???n m???t kh???u"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Vui l??ng x??c nh???n ????ng m???t kh???u!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        'The two passwords that you entered do not match!'
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Fragment>
        )}

        <Form.Item
          name="name"
          label="T??n c???a b???n"
          tooltip="B???n mu???n ng?????i kh??c g???i b???n l?? g???"
          rules={[
            {
              required: false,
              message: 'Please input your nickname!',
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
              pattern:
                /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
              message: 'Vui l??ng ??i???n s??? ??i???n tho???i h???p l???',
            },
          ]}
        >
          <Input
            addonBefore={prefixSelector}
            style={{
              width: '100%',
            }}
          />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gi???i t??nh"
          rules={[
            {
              required: false,
              message: 'Ch???n gi???i t??nh c???a b???n!',
            },
          ]}
        >
          <Select placeholder="Ch???n gi???i t??nh c???a b???n">
            <Option value="male">Nam</Option>
            <Option value="female">N???</Option>
            <Option value="other">Kh??c</Option>
          </Select>
        </Form.Item>
       
        <Form.Item
          label="???nh ?????i di???n"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <ImgCrop id="avatar" rotate>
            <Upload
              onRemove={onRemove}
              fileList={fileList}
              listType="picture-card"
              onChange={onChange}
              onPreview={onPreview}
              beforeUpload={() => false}
            >
              {fileList.length < 1 && '+ Upload'}
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            disabled={loading}
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            {action === 'add' ? ' Th??m m???i' : 'C???p nh???t'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
