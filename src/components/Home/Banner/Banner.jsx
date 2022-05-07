import { Col, Row } from 'antd';
import { LIST_BANNER } from 'constants/banner';
import React from 'react';
import BannerItem from './BannerItem/BannerItem';

const Banner = () => {
  return (
    <div className="banner" style={{ padding: '4rem 0' }}>
      <Row>
        {LIST_BANNER.map((banner, index) => (
          <Col key={banner.id} xs={24} lg={12} span="12">
            <BannerItem banner={banner} index={index} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Banner;
