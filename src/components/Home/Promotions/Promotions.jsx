import { Col, Row } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DividerShort from '../../../common/DividerShort/DividerShort';
import PackageBox from '../../../common/HomestayItem/HomestayItem';
import TitleSection from '../../../common/TitleSection/TitleSection';
import { fetchAllHomestays } from '../../../features/Homestay/HomestaySlice';
import Countdown from '../../Home/Promotions/Countdown/Countdown';
const Promotions = () => {
  const dispatch = useDispatch();
  const homestays = useSelector((state) => state.homestay.homestays);
  React.useEffect(() => {
    dispatch(fetchAllHomestays({ limit: 2 }));
    /* eslint-disable */
  }, []);
  return (
    <div
      className="promotions"
      style={{ padding: '2rem 0 5rem', maxWidth: '1192px', margin: '0 auto' }}
    >
      <TitleSection
        title="Siêu"
        title_ul="Khuyến mãi"
        suggest="CÁC GÓI DU LỊCH TỐT NHẤT"
      />
      <DividerShort m="0 0 3rem " />
      <div className="packages">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} lg={24} xl={8}>
            <Countdown />
          </Col>
          <Col xs={24} sm={24} lg={24} xl={16}>
            <div className="packages">
              <Row gutter={[24, 24]}>
                {homestays?.data?.map((homestay) => (
                  <Col
                    key={homestay?._id}
                    className="gutter-row"
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <PackageBox homestay={homestay} />
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Promotions;
