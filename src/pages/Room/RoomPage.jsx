import { Col, Pagination, Row } from 'antd';
import React, { useEffect } from 'react';
import HeaderImageLayout from '../../common/HeaderImageLayout/HeaderImageLayout';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import { fetchAllRooms } from '../../features/Rooms/RoomsSlice';
import ProductItemBox from 'components/Products/ProductItemBox/ProductItemBox';
const RoomPage = () => {
  let history = useHistory();
  let match = useRouteMatch();
  let location = useLocation();
  const querySearch = queryString.parse(location.search);
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.room.rooms);
  const onShowSizeChange = (current, pageSize) => {
    let query = {
      ...querySearch,
      page: current,
      limit: pageSize,
    };
    history.push(`${match.path}?${queryString.stringify(query)}`);
  };
  React.useEffect(() => {
    dispatch(
      fetchAllRooms({
        ...querySearch,
        // activeCategory: true,
      })
    );
    /* eslint-disable */
  }, [location]);

  return (
    <div className="ProductsPage">
      <HeaderImageLayout _namePage="our products" />
      <div
        className="list-products"
        style={{
          maxWidth: '1192px',
          margin: '0 auto',
          padding: '5rem 1.5rem',
        }}
      >
        <Row gutter={[24, 24]}>
          {rooms?.data?.map((room) => (
            <Col
              key={room?._id}
              className="gutter-row"
              span={4}
              xs={24}
              sm={24}
              md={12}
              lg={8}
              xl={6}
              xxl={6}
            >
              <ProductItemBox room={room} href={`/products/${room?._id}`} />
            </Col>
          ))}
        </Row>
        <Pagination
          style={{ marginTop: '5rem', textAlign: 'center' }}
          showQuickJumper
          // defaultCurrent={2}
          // total={500}
          onChange={onShowSizeChange}
          total={rooms?.paging?.total}
          defaultCurrent={Number(querySearch?.page) || 1}
          defaultPageSize={Number(querySearch?.limit) || 10}
        />
      </div>
    </div>
  );
};

export default RoomPage;
