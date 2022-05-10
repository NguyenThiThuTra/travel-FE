import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import HeaderImageLayout from '../../common/HeaderImageLayout/HeaderImageLayout';
import OverView from '../../components/DestinationsDetails/OverView/OverView';
import RelateProducts from '../../components/DestinationsDetails/RelateProducts/RelateProducts';
import { fetchHomestayInDestination } from '../../features/Destinations/DestinationsSlice';
const DestinationsDetailsPage = () => {
  let dispatch = useDispatch();
  let { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchHomestayInDestination(id));
    }
    /* eslint-disable */
  }, []);
  const destinationDetail = useSelector(
    (state) => state.destination.destinationDetail
  );
  useState(null);

  return (
    <div className="DestinationsDetailsPage">
      <HeaderImageLayout _namePage="our Destinations" />
      <div
        className="destination"
        style={{
          maxWidth: '1192px',
          margin: '0 auto',
          padding: '5rem 1.5rem',
        }}
      >
        <OverView
          description={destinationDetail?.data?.description}
          url_image={destinationDetail?.data?.images?.[0]}
          images={destinationDetail?.data?.images}
        />
        <RelateProducts data={destinationDetail?.data?.homestay_id} />
      </div>
    </div>
  );
};

export default DestinationsDetailsPage;
