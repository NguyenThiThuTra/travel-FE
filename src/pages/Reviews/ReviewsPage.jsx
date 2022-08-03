import { Button, Col, message, Popconfirm, Row, Select } from 'antd';
import provincesOpenApi from 'api/provincesOpenApi';
import TravelDestinationBox from 'common/TravelDestinationBox/TravelDestinationBox';
import FormReview from 'components/Reviews/FormReview/FormReview';
import { ORDER_STATUS } from 'constants/order';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { toggleModalLogin } from 'features/commonSlice';
import { getAllOrder, useOrderSelector } from 'features/Order/OrderSlice';
import {
  getAllReviewDestination,
  useReviewDestinationSelector,
} from 'features/Reviews/ReviewsSlice';
import moment from 'moment';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import './_Reviews.scss';

const ReviewsPage = () => {
  let history = useHistory();
  let location = useLocation();

  const dispatch = useDispatch();

  const currentUser = useSelector(useCurrentUserSelector);

  const orders = useSelector(useOrderSelector);
  const reviewDestination = useSelector(useReviewDestinationSelector);

  useEffect(() => {
    dispatch(getAllReviewDestination());
  }, []);

  useEffect(() => {
    const getOrderByUserId = async () => {
      if (currentUser?.data?._id) {
        dispatch(
          getAllOrder({
            filters: {
              user_id: currentUser?.data?._id,
              status: ORDER_STATUS.approved.en,
            },
            limit: 1,
            sort: '-start',
          })
        );
      }
    };
    getOrderByUserId();
  }, [currentUser]);

  // lấy danh sách các tỉnh thành
  const [provinces, setProvinces] = useState(null);

  const [provinceCode, setProvinceCode] = useState(null);

  const [destinations, setDestination] = useState(null);

  useEffect(() => {
    if (!provinces || !reviewDestination) return;
    setDestination(
      provinces.filter((item) => reviewDestination?.data.includes(item.code))
    );
  }, [provinces, reviewDestination]);

  const destinationsFilter = useMemo(() => {
    if (provinceCode) {
      return destinations?.filter(
        (destination) => destination.code === provinceCode
      );
    }
    return destinations;
  }, [provinceCode, destinations]);

  useEffect(() => {
    async function getProvinces() {
      const response = await provincesOpenApi.getAllProvinces();
      setProvinces(response);
    }
    getProvinces();
  }, []);

  function onChangeProvince(value) {
    if (provinceCode === value) return;
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

  const [loading, setLoading] = useState(false);
  const [visibleFormReview, setVisibleFormReview] = useState(false);

  // show modal review
  const [visiblePopupNotification, setVisiblePopupNotification] =
    useState(false);
  function confirmNotification(e) {
    setVisiblePopupNotification(false);
    dispatch(toggleModalLogin());
  }

  function cancelNotification(e) {
    setVisiblePopupNotification(false);
  }
  const showModal = () => {
    if (!currentUser) {
      return setVisiblePopupNotification(true);
    }

    if (!(orders?.data?.length > 0)) {
      message.info('Bạn chưa từng đến địa điểm nào');
      return false;
    }
    const order = orders?.data?.[0];

    const isTimeAfterNow = moment(
      moment(order?.start).format('YYYY-MM-DD'),
      'YYYY-MM-DD'
    ).isSameOrBefore(moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD'));
    
    if (isTimeAfterNow) {
      setVisibleFormReview(true);
    }else{
      message.info(` Đợi đến ngày ${moment(order?.start).format('DD/MM/YYYY')} để
      được review`);
    }
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisibleFormReview(false);
    }, 3000);
  };

  const handleCancel = () => {
    setVisibleFormReview(false);
  };

  return (
    <Fragment>
      <div className="reviews-page">
        <div className="form-review">
          <div className="form-filters__col">
            <div className="form-filters__title">Chọn địa điểm bạn muốn :</div>
            <Select
              allowClear
              value={provinceCode}
              onChange={onChangeProvince}
              onFocus={onFocusProvince}
              onBlur={onBlurProvince}
              onSearch={onSearchProvince}
              showSearch
              style={{ width: 343 }}
              placeholder="Tìm kiếm... "
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
          <Popconfirm
            visible={visiblePopupNotification}
            title="Bạn cần đăng nhập để thực hiện chức năng này ?"
            onConfirm={confirmNotification}
            onCancel={cancelNotification}
            okText="Yes"
            cancelText="No"
          >
            <Button
              onClick={showModal}
              className=" btn-review"
              type="primary"
              icon={<AiFillPlusCircle />}
            >
              Thêm review của bạn
            </Button>
          </Popconfirm>
        </div>

        <div>
          <Row gutter={[24, 24]}>
            {destinationsFilter?.map((destination, index) => (
              <Col
                key={destination?.code}
                className="gutter-row"
                span={4}
                xs={24}
                sm={24}
                md={12}
                lg={8}
                xl={8}
                xxl={8}
              >
                <TravelDestinationBox
                  destination={destination}
                  onClick={() => history.push(`/reviews/${destination?.code}`)}
                />
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* modal */}
      {visibleFormReview && (
        <FormReview
          visible={visibleFormReview}
          loading={loading}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
      )}
    </Fragment>
  );
};

export default ReviewsPage;
