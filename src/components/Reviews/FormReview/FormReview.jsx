import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Typography,
  Upload,
  message,
} from 'antd';
import orderApi from 'api/orderApi';
import provincesOpenApi from 'api/provincesOpenApi';
import { RouteConstant } from 'constants/RouteConstant';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { useLoadingAppSelector } from 'features/commonSlice';
import { postReview } from 'features/Reviews/ReviewsSlice';
import { objectToFormData } from 'helpers/ConvertObjectToFormData';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getBase64 } from 'utils/getBase64';
import './_FormReview.scss';

const { TextArea } = Input;
const { Title } = Typography;

export default function FormReview({
  handleOk,
  visible,
  handleCancel,
  loading,
}) {
  const history = useHistory();
  const dispatch = useDispatch();

  const currentUser = useSelector(useCurrentUserSelector);
  const loadingApp = useSelector(useLoadingAppSelector);

  const onFinish = async (values) => {
    let { schedule, ...rest } = values;
    const payload = { ...rest, user_id: currentUser?.data?._id };

    let formData = objectToFormData(payload);
    const filesImage = fileListImageReview.map((file) => file.originFileObj);
    filesImage.forEach((file) => {
      formData.append('images', file);
    });
    if (schedule) {
      schedule = schedule
        .map((item) => {
          return Object.values(item);
        })
        .flat();
      for (let i = 0; i < schedule.length; i++) {
        formData.append(`schedule[day${i + 1}]`, schedule[i]);
      }
    }

    try {
      await dispatch(postReview(formData)).unwrap();
      await handleCancel();
      history.push(`/reviews/${values?.province}`);
      await message.success('Đăng bài thành công');
    } catch (error) {
      await message.error('Đăng bài review thất bại !');
      console.error(error);
    }
  };

  // lấy danh sách các tỉnh thành
  const [provinces, setProvinces] = useState(null);
  const [provinceCode, setProvinceCode] = useState(null);
  const [provinceBooking, setProvinceBooking] = useState(null);

  useEffect(() => {
    async function getProvinces() {
      const response = await provincesOpenApi.getAllProvinces();
      setProvinces(response);
    }
    getProvinces();
  }, []);

  const [destinationOrderByUser, setDestinationOrderByUser] = useState(null);
  useEffect(() => {
    if (!provinces) return;

    if (!currentUser) {
      setDestinationOrderByUser(null);
      return;
    }
    async function getProvinces() {
      const user_id = currentUser?.data?._id;
      try {
        const response = await orderApi.getDestinationsOrderByUser(user_id);
        setDestinationOrderByUser(response);
      } catch (error) {
        setDestinationOrderByUser(null);
      }
    }
    getProvinces();
  }, [provinces, currentUser]);
  useEffect(() => {
    if (!provinces) return;
    if (!destinationOrderByUser) {
      return setProvinceBooking(null);
    }
    const arrProvinceHomestay = destinationOrderByUser?.data?.map(
      (order) => order?.addresses?.province?.code
    );
    const dataProvinceBooking = provinces?.filter((province) =>
      arrProvinceHomestay.includes(province?.code)
    );
    setProvinceBooking(dataProvinceBooking);
  }, [provinces, destinationOrderByUser]);

  function onChangeProvince(value) {
    console.log(`selected ${value}`);
    setProvinceCode(value);
  }

  function onBlurProvince() {
    console.log('blur');
  }

  function onFocusProvince() {
    console.log('focus');
  }

  function onSearchProvince(val) {
    console.log('search:', val);
  }

  // upload file
  const [previewVisibleImageReview, setPreviewVisibleImageReview] =
    useState(false);
  const [previewImageImageReview, setPreviewImageImageReview] = useState('');
  const [previewTitleImageReview, setPreviewTitleImageReview] = useState('');
  const [fileListImageReview, setFileListImageReview] = useState([]);

  const handleCancelImageReview = () => setPreviewVisibleImageReview(false);

  const handlePreviewImageReview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImageImageReview(file.url || file.preview);
    setPreviewVisibleImageReview(true);
    setPreviewTitleImageReview(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const handleChangeImageReview = ({ fileList: newFileList }) => {
    setFileListImageReview(newFileList);
    // set value images antd
  };

  const uploadButtonImageReview = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <Modal
      className="form-review"
      visible={visible}
      title={<h3 className="form-review__title">Review của bạn</h3>}
      onCancel={handleCancel}
      width={800}
      footer={null}
      // footer={[
      //   <Button key="back" onClick={handleCancel}>
      //     Return
      //   </Button>,
      //   <Button
      //     key="submit"
      //     type="primary"
      //     loading={loading}
      //     onClick={handleOk}
      //   >
      //     Submit
      //   </Button>,
      //   <Button
      //     key="link"
      //     href="https://google.com"
      //     type="primary"
      //     loading={loading}
      //     onClick={handleOk}
      //   >
      //     Search on Google
      //   </Button>,
      // ]}
    >
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Chọn địa điểm"
          name="province"
          rules={[{ required: true, message: 'Vui lòng chọn địa điểm' }]}
        >
          <Select
            onChange={onChangeProvince}
            onFocus={onFocusProvince}
            onBlur={onBlurProvince}
            onSearch={onSearchProvince}
            showSearch
            style={{ width: 343 }}
            placeholder="Search to Select "
            options={provinceBooking?.map((province) => ({
              value: province.code,
              label: province.name,
            }))}
            optionFilterProp="children"
            filterOption={(input, option) => {
              console.log({ option });
              return (
                option?.label?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
              );
            }}
            filterSort={(optionA, optionB) =>
              optionA?.label
                ?.toLowerCase()
                ?.localeCompare(optionB?.label?.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          label="Review của bạn"
          name="review"
          rules={[{ required: true, message: 'Vui lòng review điểm đến' }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Thêm ảnh">
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileListImageReview}
            onPreview={handlePreviewImageReview}
            onChange={handleChangeImageReview}
            beforeUpload={() => false}
          >
            {fileListImageReview.length >= 8 ? null : uploadButtonImageReview}
          </Upload>
          <Modal
            visible={previewVisibleImageReview}
            title={previewTitleImageReview}
            footer={null}
            onCancel={handleCancelImageReview}
          >
            <img
              alt="example"
              style={{
                width: '100%',
              }}
              src={previewImageImageReview}
            />
          </Modal>
        </Form.Item>

        <Title level={5}>Lịch trình của bạn</Title>

        <Form.List name="schedule">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    label={`Ngày ${index + 1}`}
                    name={[name, `day${index + 1}`]}
                    rules={[
                      {
                        required: false,
                        message: `Nhập lịch trình ngày ${index + 1}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm review
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button loading={loadingApp} type="primary" htmlType="submit">
            Đăng bài
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
