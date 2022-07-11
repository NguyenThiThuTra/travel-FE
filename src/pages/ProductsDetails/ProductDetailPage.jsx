import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { Col, Collapse, Image, Rate, Row, Tabs, Tag, Tooltip } from 'antd';
import ProductItemBox from 'components/Products/ProductItemBox/ProductItemBox';
import queryString from 'query-string';
import React, { createElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ButtonUI from '../../common/ButtonUI/ButtonUI';
import HeaderImageLayout from '../../common/HeaderImageLayout/HeaderImageLayout';
import { fetchAllRooms, getRoom } from '../../features/Rooms/RoomsSlice';
import CurrencyFormatting from '../../helpers/CurrencyFormatting';
import './_ProductsDetails.scss';
const { TabPane } = Tabs;
const { Panel } = Collapse;
const ProductsDetailsPage = () => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const room = useSelector((state) => state.room.room);
  const homestay = useSelector((state) => state.homestay.homestay);
  useEffect(() => {
    if (id) {
      dispatch(getRoom(id));
    }
  }, [id]);
  const [allRoomsInHomestay, setAllRoomsInHomestay] = useState(null);
  useEffect(() => {
    async function getAllRooms() {
      if (room?.data?.homestay_id) {
        try {
          const resultAction = await dispatch(
            fetchAllRooms({
              filters: {
                homestay_id: room.data?.homestay_id,
              },
              activeCategory: true,
            })
          );
          const originalPromiseResult = await unwrapResult(resultAction);
          setAllRoomsInHomestay(originalPromiseResult);
          // handle result here
        } catch (rejectedValueOrSerializedError) {
          // handle error here
          console.error({ rejectedValueOrSerializedError });
        }
      }
    }
    getAllRooms();
  }, [room?.data?.homestay_id]);

  const [quantity, setQuantity] = useState(1);
  function callback(key) {
    console.log(key);
  }
  //review
  const [likes, setLikes] = useState(0);
  const [action, setAction] = useState(null);

  const like = () => {
    setLikes(1);
    setAction('liked');
  };

  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={like}>
        {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
        <span style={{ marginLeft: '.5rem' }} className="comment-action">
          {likes}
        </span>
      </span>
    </Tooltip>,
  ];

  //end review
  return (
    <div className="ProductsDetailsPage">
      <HeaderImageLayout hideFilter={true} title_ul={homestay?.data?.name} />
      <div
        style={{
          maxWidth: '1192px',
          margin: '0 auto',
          padding: '5rem 1.5rem',
        }}
      >
        <Row>
          <Col xs={24} sm={24} md={10} lg={10} span={10}>
            <Image
              width="100%"
              src="https://dulichkhampha24.com/wp-content/uploads/2019/12/hang-mua-ninh-binh.jpg"
            />
          </Col>
          <Col xs={24} sm={24} md={16} lg={14} span={14}>
            <div className="description">
              <h1>{room?.data?.name} </h1>
              <Rate disabled defaultValue={4} />
              <div className="price">
                {/* <div className="price__amount">
                  <span className="price__currencySymbol">$</span>
                  2,189.00
                </div> */}
                <div className="price__amount">
                  <span className="price__currencySymbol">$</span>
                  {room?.data?.price > 0 &&
                    CurrencyFormatting(room?.data?.price)}
                </div>
              </div>
              <div className="content">
                <p>{room?.data?.description}</p>
                {/* <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Laborum voluptatum tempora, deleniti praesentium nam quisquam
                  veritatis. Eius optio qui quo quae, adipisci maxime, officiis
                  nisi dolor, aspernatur quia officia odit.
                </p> */}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="quantity">
                  <div
                    className="quantity__decrease quantity__key"
                    onClick={() =>
                      quantity > 0 &&
                      setQuantity((prevQuantity) => prevQuantity - 1)
                    }
                  >
                    -
                  </div>
                  <input
                    onChange={(e) => setQuantity(e.target.value)}
                    type="text"
                    value={quantity < 1000 ? quantity : 999}
                    defaultValue={quantity}
                  />
                  <div
                    className="quantity__increase quantity__key"
                    onClick={() =>
                      setQuantity((prevQuantity) => prevQuantity + 1)
                    }
                  >
                    +
                  </div>
                </div>
                <div>
                  <ButtonUI bg="#1bbc9b" color="#fff" text="ADD TO CART" />
                </div>
              </div>
              <div className="product_meta">
                <div className="posted_in">
                  <span>Thể loại:</span>
                  <Tag color="magenta">{room?.data?.type}</Tag>
                  {/* <Tag color="red">red</Tag>
                  <Tag color="volcano">volcano</Tag> */}
                </div>
                {/* <div className="tagged_as">
                  <span>Tag:</span>
                  <Tag color="blue">blue</Tag>
                  <Tag color="geekblue">geekblue</Tag>
                  <Tag color="purple">purple</Tag>
                </div> */}
              </div>
            </div>
          </Col>
        </Row>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Mô tả" key="1">
            <div className="tabPane tab1">
              <div className="tabPane__title">Mô tả</div>
              <div className="tab1__content">
                <p>{homestay?.data?.description}</p>
              </div>
            </div>
          </TabPane>
          {/* <TabPane tab="Reviews (2)" key="3">
            <div className="reviews tabPane tab3">
              <div className="tabPane__title">Đánh Giá Homestay</div>

              {room?.data?.comments_count.map((item, index) => (
                <Comment
                  key={index}
                  actions={actions}
                  author={
                    <div>
                      <h3>Han Solo</h3>
                      <div className="reviews__rate">
                        <Rate
                          style={{ fontSize: '1.6rem' }}
                          disabled
                          defaultValue={4}
                        />
                      </div>
                    </div>
                  }
                  avatar={
                    <Avatar
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      alt="Han Solo"
                    />
                  }
                  content={
                    <p>
                      Không gian lại khá đẹp và lãng mạn, view đồi núi, thung
                      lũng phòng nghỉ tương đối rộng. Dịch vụ siêu tốt nha các
                      bạn 💛💛💛
                    </p>
                  }
                  datetime={
                    <Tooltip
                      title={moment(1622201687266).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )}
                    >
                      <span>{moment(1622201687266).fromNow()}</span>
                    </Tooltip>
                  }
                />
              ))}
            </div>
          </TabPane> */}
        </Tabs>
        <div className="related">
          <h1 className="related__title">Các phòng khác của Homestay</h1>
          <Row gutter={[24, 24]}>
            {allRoomsInHomestay?.data
              ?.filter((r) => r._id !== room?.data?._id)
              ?.map((room) => (
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
                  <ProductItemBox
                    room={room}
                    href={`/products/${room?._id}}`}
                  />
                </Col>
              ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetailsPage;
