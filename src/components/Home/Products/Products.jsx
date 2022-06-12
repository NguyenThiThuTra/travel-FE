import { Col, Row, Tabs } from 'antd';
import { LIST_TABS_PRODUCT } from 'constants/product';
import React from 'react';
import ProductItem from './ProductItem/ProductItem';
import './_Products.scss';
// import ButtonUI from '../../common/ButtonUI';
const { TabPane } = Tabs;

const Products = () => {
  const getKey = (key) => {
    console.log('key:', key);
  };
  return (
    <div className="product">
      <Tabs defaultActiveKey="1" onChange={(key) => getKey(key)}>
        {LIST_TABS_PRODUCT.map((tabProduct) => (
          <TabPane tab={tabProduct.name} key={tabProduct.id}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {new Array(8).fill(null).map((item, index) => (
                <Col
                  key={index}
                  className="gutter-row"
                  span={4}
                  xs={24}
                  sm={24}
                  md={8}
                  lg={6}
                  xl={6}
                  xxl={4}
                >
                  <div className="product_wrap">
                    <ProductItem />
                  </div>
                </Col>
              ))}
            </Row>
          </TabPane>
        ))}
      </Tabs>
      {/* <div className={styles.btn_loadmore}>
        <span>Load more</span>
      </div> */}
      <div
        className="load-more_wrap"
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '4rem',
        }}
      >
        <div className="btn_load_more">
          {/* <ButtonUI /> */}
          <span>Xem thêm</span>
        </div>
      </div>
    </div>
  );
};

export default Products;
