import { Image } from 'antd';
import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import ButtonUI from '../ButtonUI/ButtonUI';
import './_TravelDestinationBox.scss';
const TravelDestinationBox = ({ onClick, destination }) => {
  // location
  let history = useHistory();
  let location = useLocation();

  function handleRedirectReviewDetail() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <div className="travel_destination">
      <Image
        style={{ objectFit: 'cover' }}
        height={235}
        className="travel_destination__img"
        src={''}
        fallback="https://res.cloudinary.com/dulich/image/upload/v1619010475/travel/destination-11_ewvbau.jpg"
        alt="avatar"
      />

      <div className="travel_destination__tag">
        <div className="travel_destination__tag__text">{destination?.name}</div>
      </div>
      <div className="travel_destination__description">
        <h3>{destination?.name}</h3>
        {/* <h6>{2} Packages</h6> */}
      </div>
      <div className="travel_destination__packages">
        <div className="travel_destination__content">
          <h3 className="travel_destination__content--title">Review</h3>

          <ButtonUI text="View Review" onClick={handleRedirectReviewDetail} />
        </div>
      </div>
    </div>
  );
};

export default TravelDestinationBox;
