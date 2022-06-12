import { Col, Pagination, Row } from 'antd';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import HeaderImageLayout from '../../common/HeaderImageLayout/HeaderImageLayout';
import TravelDestinationBox from '../../common/TravelDestinationBox/TravelDestinationBox';
import { fetchAllDestinations } from '../../features/Destinations/DestinationsSlice';
const DestinationsPage = () => {
  let history = useHistory();
  let match = useRouteMatch();
  let location = useLocation();
  const querySearch = queryString.parse(location.search);
  const dispatch = useDispatch();
  const destinations = useSelector((state) => state.destination.destinations);
  //end querySearch

  const onShowSizeChange = (current, pageSize) => {
    let query = {
      ...querySearch,
      page: current,
      limit: pageSize,
    };
    history.push(`${match.path}?${queryString.stringify(query)}`);
  };
  //list destinations
  React.useEffect(() => {
    dispatch(fetchAllDestinations(querySearch));
    /* eslint-disable */
  }, [location]);
  return (
    <div className="DestinationsPage">
      <HeaderImageLayout _namePage="our destinations" />
      <div
        className="list-destinations"
        style={{
          maxWidth: '1192px',
          margin: '0 auto',
          padding: '5rem 1.5rem',
        }}
      >
        <Row gutter={[24, 24]}>
          {destinations?.data?.map((TravelDestination) => (
            <Col
              key={TravelDestination._id}
              className="gutter-row"
              span={4}
              xs={24}
              sm={24}
              md={12}
              lg={8}
              xl={8}
              xxl={8}
            >
              <TravelDestinationBox TravelDestination={TravelDestination} />
            </Col>
          ))}
        </Row>
        <Pagination
          style={{ marginTop: '5rem', textAlign: 'center' }}
          showQuickJumper
          onChange={onShowSizeChange}
          total={destinations?.paging?.total}
          defaultCurrent={Number(querySearch?.page) || 1}
          defaultPageSize={Number(querySearch?.limit) || 10}
        />
      </div>
    </div>
  );
};

export default DestinationsPage;
