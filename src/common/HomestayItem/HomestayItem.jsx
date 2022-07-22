import { Image, Rate } from 'antd';
import { GoLocation } from 'react-icons/go';
import ButtonUI from '../ButtonUI/ButtonUI';
import './_HomestayItem.scss';

const HomestayItem = ({ size, homestay, handleRedirectHomestayDetail }) => {

  return (
    <div className="package-box">
      <div className="package-box__top">
        <div style={{ overflow: 'hidden' }}>
          <Image
            style={{ objectFit: 'cover' }}
            height={235}
            className="travel_destination__img"
            src={homestay?.avatar || homestay?.images?.[0] || ''}
            preview={{ visible: false, mask: null }}
            fallback="https://res.cloudinary.com/dulich/image/upload/v1619010475/travel/destination-11_ewvbau.jpg"
            alt="avatar"
          />
        </div>
        {/* <div className="package-box__icon">
          <BsFillHeartFill />
        </div> */}
      </div>
      <div
        className="package-box__content"
        style={{ padding: `${size === 'small' && '1.5rem'}` }}
      >
        <div
          className="package-box__title"
          style={{ marginBottom: `${size === 'small' && '1rem'}` }}
        >
          <h3
            onClick={handleRedirectHomestayDetail}
            className="package-box__name"
            style={{ fontSize: `${size === 'small' && '1.6rem'}` }}
          >
            {homestay?.name}
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            {homestay?.comments_count === 0 ? (
              <span> Chưa được đánh giá </span>
            ) : (
              <Rate allowHalf disabled defaultValue={homestay?.rate} />
            )}
          </div>
          <h5
            onClick={handleRedirectHomestayDetail}
            className="package-box__destination"
            style={{ fontSize: `${size === 'small' && '1.4rem'}` }}
          >
            <span className="package-box__destination--icon">
              <GoLocation />
            </span>
            {homestay?.addresses?.province?.name}
          </h5>
        </div>
        <div className="package-box__description">
          {/* <div className="package-box__description--top">
            <div className="package-box__category">
              <div style={{ fontSize: `${size === 'small' && '1.2rem'}` }}>
                Cultural
              </div>
              <div style={{ fontSize: `${size === 'small' && '1.2rem'}` }}>
                <span>RELax</span>
                <Tag style={{ fontSize: '1rem' }} color="#f76570">
                  + 1
                </Tag>
              </div>
            </div>
            <h3 onClick={handleRedirectHomestayDetail} className="package-box__price">
              <span className="package-box__price--old">1000</span>
              700 <span>$</span>
            </h3>
          </div> */}
          <div
            className="package-box__description--text"
            style={{
              padding: `${size === 'small' && '1rem 0'}`,
              fontSize: `${size === 'small' && '1.3rem'}`,
            }}
          >
            {homestay?.description}
          </div>
        </div>
        {homestay?.minPrice && (
          <div style={{ marginTop: 'auto', width: '100%' }}>
            <div className="package-box__bottom">
              <ButtonUI
                onClick={handleRedirectHomestayDetail}
                text={`Chỉ từ ${
                  homestay?.minPrice &&
                  `${homestay?.minPrice?.toLocaleString()} đ`
                }`}
                color="#fff"
                bg="#f76570"
              />

              <div className="package-box__min-price">{}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomestayItem;
