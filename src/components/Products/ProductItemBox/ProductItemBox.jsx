import { Image, InputNumber, Rate } from 'antd';
import React, { Fragment, useEffect } from 'react';
import { AiFillThunderbolt } from 'react-icons/ai';
import { GoLocation } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import ButtonUI from '../../../common/ButtonUI/ButtonUI';
import { getHomestay } from '../../../features/Homestay/HomestaySlice';
import CurrencyFormatting from '../../../helpers/CurrencyFormatting';
import './_ProductItemBox.scss';
const ProductItemBox = ({ room, href, getData }) => {
  let history = useHistory();
  let { id } = useParams();

  const dispatch = useDispatch();
  const homestay = useSelector((state) => state.homestay.homestay);
  useEffect(() => {
    if (id) {
      dispatch(getHomestay(id));
    }
  }, [id]);
  function onChange(value) {
    // console.log('changed', value);
  }
  const redirectRoute = () => {
    // history.push(href);
  };
  return (
    <Fragment>
      <div className="product-item">
        <div>
          <Image
            style={{ objectFit: 'cover' }}
            height={220}
            className="travel_destination__img"
            src={room?.avatar || ''}
            fallback="https://res.cloudinary.com/dulich/image/upload/v1619010475/travel/destination-11_ewvbau.jpg"
            alt="avatar"
          />
        </div>
        <div className="product-item__content">
          <div style={{ flexGrow: 1 }} onClick={() => redirectRoute()}>
            <p className="product-item__location">
              <GoLocation style={{ position: 'relative', top: '1px' }} />
              <span>{homestay?.data?.addresses?.province?.name}</span>
            </p>
            <h4 className="product-item__title">{room?.description}</h4>
            <div className="product-item__review">
              <Rate
                style={{ fontSize: '1.6rem' }}
                className="product-item__rating"
                allowHalf
                defaultValue={room?.rate !== 0 ? room?.rate : 5}
              />
              <span className="review">{room?.comments_count} Reviews</span>
            </div>
          </div>
          <div className="product-item__footer">
            <AiFillThunderbolt
              style={{ position: 'relative', top: '3px' }}
              color="#FF4136"
            />
            {/* <span style={{ marginLeft: '.5rem', marginRight: '1rem' }}>
              from
            </span> */}
            <span className="product-item__price">
              {room?.price > 0 && CurrencyFormatting(room?.price)}
            </span>
          </div>
          <InputNumber
            min={1}
            max={room?.quantity}
            defaultValue={1}
            onChange={onChange}
          />
          <div style={{ marginTop: '2rem' }}>
            <ButtonUI bg="#1bbc9b" color="#fff" text="Đặt phòng" />
          </div>
        </div>
      </div>
      {/* </Link> */}
    </Fragment>
  );
};

export default ProductItemBox;
