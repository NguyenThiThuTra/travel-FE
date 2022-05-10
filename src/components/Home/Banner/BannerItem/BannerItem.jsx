// import { Link } from 'react-router-dom';
import React from 'react';
import './_BannerItem.scss';
import ButtonUI from '../../../../common/ButtonUI/ButtonUI';
const BannerItem = (props) => {
  return (
    <div
      className="banner_item"
      style={{
        padding: props.p || '6rem 0',
        margin: props.m || '0',
        backgroundImage: `url(${props.banner.src})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {/* <Link
        to={props.banner.route || '/packages'}
        className="banner_item__link"
      > */}
      <h3 className="banner_item__text">
        {props.banner.text
          ? `0${props.index + 1} ${props.banner.text}`
          : '01. PROMOTIONS'}
      </h3>
      <h2 className="banner_item__title">
        {props.banner.title || 'Discover Cities'}
      </h2>
      <ButtonUI
        href={props.banner.route || 'homestays'}
        color={props.index === 0 ? '#f3a46b' : '#1bbc9b'}
        paddingButton="1.4rem 2rem"
        borderRadius="5rem"
        text="details"
      />
      {/* </Link> */}
    </div>
  );
};

export default BannerItem;
