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
          <TabPane tab="Chính sách" key="2">
            <div className="tabPane tab2">
              <div className="tabPane__title">Chính sách</div>
              <p>
                Cám ơn quý khách đã quan tâm và truy cập vào website. Chúng tôi
                tôn trọng và cam kết sẽ bảo mật những thông tin mang tính riêng
                tư của Quý khách. Chính sách bảo mật sẽ giải thích cách chúng
                tôi tiếp nhận, sử dụng và (trong trường hợp nào đó) tiết lộ
                thông tin cá nhân của Quý khách. Bảo vệ dữ liệu cá nhân và gây
                dựng được niềm tin cho quý khách là vấn đề rất quan trọng với
                chúng tôi. Vì vậy, chúng tôi sẽ dùng tên và các thông tin khác
                liên quan đến quý khách tuân thủ theo nội dung của Chính sách
                bảo mật. Chúng tôi chỉ thu thập những thông tin cần thiết liên
                quan đến giao dịch mua bán. Chúng tôi sẽ giữ thông tin của khách
                hàng trong thời gian luật pháp quy định hoặc cho mục đích nào
                đó. Quý khách có thể truy cập vào website và trình duyệt mà
                không cần phải cung cấp chi tiết cá nhân. Lúc đó, Quý khách đang
                ẩn danh và chúng tôi không thể biết bạn là ai nếu Quý khách
                không đăng nhập vào tài khoản của mình.
              </p>
              <Collapse onChange={callback}>
                <Panel header={<h4>1. Thu thập thông tin cá nhân</h4>} key="1">
                  <div>
                    <p>
                      - Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn
                      cho quá trình mua hàng và cho những thông báo sau này liên
                      quan đến đơn hàng, và để cung cấp dịch vụ, bao gồm một số
                      thông tin cá nhân: danh hiệu, tên, giới tính, ngày sinh,
                      email, địa chỉ, địa chỉ giao hàng, số điện thoại, fax, chi
                      tiết thanh toán, chi tiết thanh toán bằng thẻ hoặc chi
                      tiết tài khoản ngân hàng.
                    </p>
                    <p>
                      - Chúng tôi sẽ dùng thông tin quý khách đã cung cấp để xử
                      lý đơn đặt hàng, cung cấp các dịch vụ và thông tin yêu cầu
                      thông qua website và theo yêu cầu của bạn.
                    </p>
                    <p>
                      - Hơn nữa, chúng tôi sẽ sử dụng các thông tin đó để quản
                      lý tài khoản của bạn; xác minh và thực hiện giao dịch trực
                      tuyến, nhận diện khách vào web, nghiên cứu nhân khẩu học,
                      gửi thông tin bao gồm thông tin sản phẩm và dịch vụ. Nếu
                      quý khách không muốn nhận bất cứ thông tin tiếp thị của
                      chúng tôi thì có thể từ chối bất cứ lúc nào.
                    </p>
                    <p>
                      - Chi tiết đơn đặt hàng của bạn được chúng tôi lưu giữ
                      nhưng vì lí do bảo mật nên chúng tôi không công khai trực
                      tiếp được. Tuy nhiên, quý khách có thể tiếp cận thông tin
                      bằng cách đăng nhập tài khoản trên web. Tại đây, quý khách
                      sẽ thấy chi tiết đơn đặt hàng của mình, những sản phẩm đã
                      nhận và những sản phẩm đã gửi và chi tiết email, ngân hàng
                      và bản tin mà bạn đặt theo dõi dài hạn.
                    </p>
                    <p>
                      - Quý khách cam kết bảo mật dữ liệu cá nhân và không được
                      phép tiết lộ cho bên thứ ba. Chúng tôi không chịu bất kỳ
                      trách nhiệm nào cho việc dùng sai mật khẩu nếu đây không
                      phải lỗi của chúng tôi.
                    </p>
                    <p>
                      - Chúng tôi có thể dùng thông tin cá nhân của bạn để
                      nghiên cứu thị trường. mọi thông tin chi tiết sẽ được ẩn
                      và chỉ được dùng để thống kê. Quý khách có thể từ chối
                      không tham gia bất cứ lúc nào.
                    </p>
                  </div>
                </Panel>
                <Panel header={<h4>2. Bảo mật</h4>} key="2">
                  <div>
                    <p>
                      - Chúng tôi có biện pháp thích hợp về kỹ thuật và an ninh
                      để ngăn chặn truy cập trái phép hoặc trái pháp luật hoặc
                      mất mát hoặc tiêu hủy hoặc thiệt hại cho thông tin của
                      bạn.
                    </p>
                    <p>
                      - Chúng tôi khuyên quý khách không nên đưa thông tin chi
                      tiết về việc thanh toán với bất kỳ ai bằng e-mail, chúng
                      tôi không chịu trách nhiệm về những mất mát quý khách có
                      thể gánh chịu trong việc trao đổi thông tin của quý khách
                      qua internet hoặc email.
                    </p>
                    <p>
                      - Quý khách tuyệt đối không sử dụng bất kỳ chương trình,
                      công cụ hay hình thức nào khác để can thiệp vào hệ thống
                      hay làm thay đổi cấu trúc dữ liệu. Nghiêm cấm việc phát
                      tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào nhằm can
                      thiệp, phá hoại hay xâm nhập vào dữ liệu của hệ thống
                      website. Mọi vi phạm sẽ bị tước bỏ mọi quyền lợi cũng như
                      sẽ bị truy tố trước pháp luật nếu cần thiết.
                    </p>
                    <p>
                      - Mọi thông tin giao dịch sẽ được bảo mật nhưng trong
                      trường hợp cơ quan pháp luật yêu cầu, chúng tôi sẽ buộc
                      phải cung cấp những thông tin này cho các cơ quan pháp
                      luật.
                    </p>
                    <p>
                      Các điều kiện, điều khoản và nội dung của trang web này
                      được điều chỉnh bởi luật pháp Việt Nam và tòa án Việt Nam
                      có thẩm quyền xem xét.
                    </p>
                  </div>
                </Panel>
                <Panel header={<h4>3. Quyền lợi khách hàng</h4>} key="3">
                  <div>
                    <p>
                      - Quý khách có quyền yêu cầu truy cập vào dữ liệu cá nhân
                      của mình, có quyền yêu cầu chúng tôi sửa lại những sai sót
                      trong dữ liệu của bạn mà không mất phí. Bất cứ lúc nào bạn
                      cũng có quyền yêu cầu chúng tôi ngưng sử dụng dữ liệu cá
                      nhân của bạn cho mục đích tiếp thị.
                    </p>
                  </div>
                </Panel>
              </Collapse>
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
