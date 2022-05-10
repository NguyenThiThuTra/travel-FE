import { unwrapResult } from '@reduxjs/toolkit';
import { Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchHomestayInDestination } from '../../features/Destinations/DestinationsSlice';
import ButtonUI from '../ButtonUI/ButtonUI';
import { useHistory, useLocation } from 'react-router-dom';
import './_TravelDestinationBox.scss';
const TravelDestinationBox = (props) => {
  const {
    _id,
    homestay_id,
    images,
    avatar,
    province,
    createdAt,
    updatedAt,
    description,
  } = props.TravelDestination;
  const [dataListHomestayInDestination, setDataListHomestayInDestination] =
    useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    async function getHomestayInDestination() {
      if (_id) {
        const resultAction = await dispatch(fetchHomestayInDestination(_id));
        const originalPromiseResult = await unwrapResult(resultAction);
        setDataListHomestayInDestination(originalPromiseResult?.data);
      }
    }
    getHomestayInDestination();
  }, [_id]);

  // location
  let history = useHistory();
  let location = useLocation();
  function handlePushRoute(path) {
    const search = location.search; // could be '?time=...'
    const params = new URLSearchParams(search);
    const time = params.get('time');
    if (time) {
      if (!path) {
        return history.push(`/destinations/${_id}${location.search}`);
      }
      return history.push(path);
    }
    let inputTime = document.querySelector(
      '.ant-picker-range.form-filters__input'
    );
    if (inputTime) {
      inputTime.click();
    }
  }

  return (
    <div className="travel_destination">
      <Image
        style={{ objectFit: 'cover' }}
        height={235}
        className="travel_destination__img"
        src={avatar || ''}
        fallback="https://res.cloudinary.com/dulich/image/upload/v1619010475/travel/destination-11_ewvbau.jpg"
        alt="avatar"
      />

      <div className="travel_destination__tag">
        <div className="travel_destination__tag__text">
          {province?.name || 'Tag name '}
        </div>
      </div>
      <div className="travel_destination__description">
        <h3>{province?.name}</h3>
        <h6>{homestay_id?.length} Packages</h6>
      </div>
      <div className="travel_destination__packages">
        <div className="travel_destination__content">
          <h3 className="travel_destination__content--title">Packages</h3>
          <div className="travel_destination__content--wrapItem">
            {dataListHomestayInDestination?.homestay_id?.map((homestay) => (
              <div
                key={homestay?._id}
                className="travel_destination__content--item"
                onClick={() =>
                  handlePushRoute(
                    `/homestays/${homestay?._id}${location.search}`
                  )
                }
              >
                {/* <Link to={`/packages/${id}/${name.toLowerCase()}`}> */}
                <Link to="#">
                  <span>{homestay?.name}</span>
                </Link>
              </div>
            ))}
          </div>
          {/* will delete  */}
          {/* <div className="travel_destination__content--item">
            <Link to="/packages">
              <span>iceland</span>
            </Link>
          </div>
          <div className="travel_destination__content--item">
            <Link to="/packages">
              <span>berlin</span>
            </Link>
          </div> */}
          {/*end delete  */}
          <ButtonUI onClick={handlePushRoute} />
        </div>
      </div>
    </div>
  );
};

export default TravelDestinationBox;
