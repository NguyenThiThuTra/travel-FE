import { Alert, Col, Row } from 'antd';
import React from 'react';
import PackageBox from '../../../common/HomestayItem/HomestayItem';
import TitleSection from '../../../common/TitleSection/TitleSection';
const RelateProducts = ({ data }) => {
  return (
    <div className="RelateProducts" style={{ marginTop: '5rem' }}>
      <TitleSection
        title="Hot Vacation"
        title_ul="Packages"
        colorUnderline="#3fd0d4"
        suggest="DEAL HOT, ĐẶT NGAY KẺO LỠ!"
        colorSuggest="#ff4136"
      />
      <div style={{ marginTop: '3rem' }}>
        <Row gutter={[24, 24]}>
          {data?.map((homestay) => (
            <Col
              key={homestay?._id}
              className="gutter-row"
              span={4}
              xs={24}
              sm={24}
              md={12}
              lg={8}
              xl={6}
              xxl={6}
            >
              <PackageBox homestay={homestay} size="small" />
            </Col>
          ))}
          {data?.length === 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Alert
                message="Hiện tại không có data"
                type="info"
                showIcon
              />
            </div>
          )}
        </Row>
      </div>
    </div>
  );
};

export default RelateProducts;
