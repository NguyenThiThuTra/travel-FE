import { Col, Row } from 'antd';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DividerShort from '../../../common/DividerShort/DividerShort';
import TitleSection from '../../../common/TitleSection/TitleSection';
import TravelDestinationBox from '../../../common/TravelDestinationBox/TravelDestinationBox';
import { fetchAllDestinations } from '../../../features/Destinations/DestinationsSlice';
import './_Destinations.scss';

const Destinations = () => {
  let dispatch = useDispatch();
  const destinations = useSelector((state) => state.destination.destinations);
  React.useEffect(() => {
    dispatch(fetchAllDestinations({ limit: 6 }));
    /* eslint-disable */
  }, []);
  return (
    <div className="destinations">
      <TitleSection
        title="Các"
        title_ul="Điểm đến du lịch"
        suggest="CHỌN ĐIỂM ĐẾN TIẾP THEO CỦA BẠN"
      />
      <DividerShort />
      <div className="travel_destinations">
        <Row gutter={[24, 24]}>
          {destinations?.data?.map((destination) => (
            <Col
              key={destination?._id}
              className="gutter-row"
              span={4}
              xs={24}
              sm={24}
              md={12}
              lg={8}
              xl={8}
              xxl={8}
            >
              <TravelDestinationBox TravelDestination={destination} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Destinations;
