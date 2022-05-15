import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import {
  Button,
  Collapse,
  Image, Popconfirm,
  Tabs,
  Tooltip
} from 'antd';
import { CommentList } from 'common/CommentList/CommentList';
import HeaderImageLayout from 'common/HeaderImageLayout/HeaderImageLayout';
import { TableProduct } from 'common/TableProduct/TableProduct';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import {
  setOpenPopupChatBox,
  setReceiver
} from 'features/ChatBox/ChatBoxSlice';
import {
  toggleModalLogin
} from 'features/commonSlice';
import {
  getHomestay,
  useHomestaySelector
} from 'features/Homestay/HomestaySlice';
import { fetchAllRooms, useRoomsSelector } from 'features/Rooms/RoomsSlice';
import { groupBy } from 'helpers/groupBy';
import queryString from 'query-string';
import React, { createElement, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import './_HomestayDetail.scss';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const HomestayDetailPage = () => {
  let location = useLocation();
  let { id } = useParams();
  let dispatch = useDispatch();

  const currentUser = useSelector(useCurrentUserSelector);
  const homestay = useSelector(useHomestaySelector);
  const dataHomestay = useMemo(() => homestay?.data, [homestay]);

  const rooms = useSelector(useRoomsSelector);

  const [dataGroupByCategory, setDataGroupByCategory] = useState([]);
  useEffect(() => {
    if (rooms) {
      const data = rooms?.data?.map((room) => {
        return { ...room, categoryId: room?.category_id?._id };
      });
      const groupByCategory = groupBy('categoryId');
      const dataGroupByCategory = groupByCategory(data);
      setDataGroupByCategory(dataGroupByCategory);
    }
  }, [rooms]);

  const querySearch = queryString.parse(location?.search);

  // get data detail
  useEffect(() => {
    if (id) {
      const payload = {
        ...querySearch,
        filters: {
          homestay_id: id,
        },
      };
      dispatch(fetchAllRooms(payload));
      dispatch(getHomestay(id));
    }
  }, [id, location]);

  //end get data detail
  //get list room

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

  // open chat box
  const [visiblePopupNotification, setVisiblePopupNotification] =
    useState(false);
  function confirmNotification(e) {
    // message.success('Click on Yes');
    setVisiblePopupNotification(false);
    dispatch(toggleModalLogin());
  }

  function cancelNotification(e) {
    // message.error('Click on No');
    setVisiblePopupNotification(false);
  }

  const handleOpenChatBox = () => {
    if (!currentUser) {
      return setVisiblePopupNotification(true);
    }
    dispatch(setReceiver(dataHomestay));
    dispatch(setOpenPopupChatBox(true));
  };
  return (
    <div className="ProductsDetailsPage">
      <HeaderImageLayout title_ul={rooms?.data?.[0]?.homestay_id?.name} />
      <div
        style={{
          maxWidth: '1192px',
          margin: '0 auto',
          padding: '5rem 1.5rem',
        }}
      >
        <div className="homestay-detail__header">
          <h1>{rooms?.data?.[0]?.homestay_id?.name}</h1>
          <Popconfirm
            visible={visiblePopupNotification}
            title="Bạn cần đăng nhập để thực hiện chức năng này ?"
            onConfirm={confirmNotification}
            onCancel={cancelNotification}
            okText="Yes"
            cancelText="No"
          >
            <Button onClick={handleOpenChatBox} type="primary" danger>
              Chat Ngay
            </Button>
          </Popconfirm>
        </div>
        <div className="gallery">
          <Image
            style={{ objectFit: 'cover' }}
            height="400px"
            width="100%"
            src={
              rooms?.data?.homestay_id?.images?.[0] ||
              'https://dulichkhampha24.com/wp-content/uploads/2019/12/hang-mua-ninh-binh.jpg'
            }
            fallback="https://doanhnhanplus.vn/wp-content/uploads/2017/12/DN-Anh-chup-Da-Lat-BaiDN-221217-1.jpg"
          />
        </div>

        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Mô tả" key="1">
            <div className="tabPane tab1">
              <div className="tabPane__title">Mô tả</div>
              <div className="tab1__content">
                <p>{rooms?.data?.homestay_id?.description}</p>
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
                <Panel header="1. Thu thập thông tin cá nhân" key="1">
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
                <Panel header="2. Bảo mật" key="2">
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
                <Panel header="3. Quyền lợi khách hàng" key="3">
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

              {new Array(3).fill(null).map((item) => (
                <Comment
                  key={item}
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
          <h1 className="related__title">Các phòng của Homestay</h1>
          <TableProduct
            data={dataGroupByCategory}
            nameHomestay={rooms?.data?.[0]?.homestay_id?.name}
            homestay_id={id}
          />
          {/* <Row gutter={[24, 24]}>
            {rooms?.data?.length === 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Alert
                  message="Hiện tại không còn phòng khác của homestay"
                  type="info"
                  showIcon
                />
              </div>
            )}
          </Row> */}
        </div>
        <CommentList />
      </div>
    </div>
  );
};

export default HomestayDetailPage;
