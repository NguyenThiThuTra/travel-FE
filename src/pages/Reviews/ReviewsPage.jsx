import { Button, Col, Row, Select } from 'antd';
import provincesOpenApi from 'api/provincesOpenApi';
import TravelDestinationBox from 'common/TravelDestinationBox/TravelDestinationBox';
import FormReview from 'components/Reviews/FormReview/FormReview';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import React, { Fragment, useEffect, useState } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import './_Reviews.scss';

const ReviewsPage = () => {
  let history = useHistory();
  let location = useLocation();

  const dispatch = useDispatch();

  const currentUser = useSelector(useCurrentUserSelector);

  function onChangeProvince(value) {
    console.log(`selected ${value}`);
    setProvinceCode(value);
  }

  // lấy danh sách các tỉnh thành
  const [provinces, setProvinces] = useState(null);
  const [provinceCode, setProvinceCode] = useState(null);
  useEffect(() => {
    async function getProvinces() {
      const response = await provincesOpenApi.getAllProvinces();
      setProvinces(response);
    }
    getProvinces();
  }, []);

  function onBlurProvince() {
    console.log('blur');
  }

  function onFocusProvince() {
    console.log('focus');
  }

  function onSearchProvince(val) {
    console.log('search:', val);
  }

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 3000);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <Fragment>
      <div className="reviews-page">
        <div className="form-review">
          <div className="form-filters__col">
            <div className="form-filters__title">Chọn địa điểm bạn muốn :</div>
            <Select
              value={provinceCode}
              className=""
              onChange={onChangeProvince}
              onFocus={onFocusProvince}
              onBlur={onBlurProvince}
              onSearch={onSearchProvince}
              showSearch
              style={{ width: 343 }}
              placeholder="Search to Select "
              options={provinces?.map((province) => ({
                value: province.code,
                label: province.name,
              }))}
              optionFilterProp="children"
              filterOption={(input, option) => {
                console.log({ option });
                return (
                  option?.label?.toLowerCase()?.indexOf(input?.toLowerCase()) >=
                  0
                );
              }}
              filterSort={(optionA, optionB) =>
                optionA?.label
                  ?.toLowerCase()
                  ?.localeCompare(optionB?.label?.toLowerCase())
              }
            />
          </div>
          <Button
            onClick={showModal}
            className=" btn-review"
            type="primary"
            icon={<AiFillPlusCircle />}
          >
            Thêm review của bạn
          </Button>
        </div>

        <div>
          <Row gutter={[24, 24]}>
            {new Array(6).fill(null).map((_, index) => (
              <Col
                key={index}
                className="gutter-row"
                span={4}
                xs={24}
                sm={24}
                md={12}
                lg={8}
                xl={8}
                xxl={8}
              >
                <TravelDestinationBox />
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* modal */}
      <FormReview
        visible={visible}
        loading={loading}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </Fragment>
  );
};

export default ReviewsPage;
