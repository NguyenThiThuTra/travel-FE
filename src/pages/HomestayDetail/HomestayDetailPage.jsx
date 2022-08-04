import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import { Button, Collapse, Image, Popconfirm, Rate, Tabs, Tooltip } from 'antd';
import { CommentList } from 'common/CommentList/CommentList';
import HeaderImageLayout from 'common/HeaderImageLayout/HeaderImageLayout';
import { TableProduct } from 'common/TableProduct/TableProduct';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import {
  setOpenPopupChatBox,
  setReceiver,
} from 'features/ChatBox/ChatBoxSlice';
import { toggleModalLogin } from 'features/commonSlice';
import {
  getHomestay,
  useHomestaySelector,
} from 'features/Homestay/HomestaySlice';
import { fetchAllRooms, useRoomsSelector } from 'features/Rooms/RoomsSlice';
import { groupBy } from 'helpers/groupBy';
import queryString from 'query-string';
import React, { createElement, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
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
  // visiblePreviewGroup
  const [visiblePreviewGroup, setVisiblePreviewGroup] = useState(false);
  // end visiblePreviewGroup
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
        activeCategory: true,
        limit: 9999,
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
    setVisiblePopupNotification(false);
    dispatch(toggleModalLogin());
  }

  function cancelNotification(e) {
    setVisiblePopupNotification(false);
  }

  const handleOpenChatBox = () => {
    if (!currentUser) {
      return setVisiblePopupNotification(true);
    }
    dispatch(setReceiver(dataHomestay));
    dispatch(setOpenPopupChatBox(true));
  };

  // render comments
  const renderCommentList = useMemo(
    () => <CommentList dataHomestay={dataHomestay} />,
    [dataHomestay]
  );

  const renderAddressHomestay = () => {
    if (!homestay) {
      return '';
    }
    const addresses = homestay?.data?.addresses;
    const address = addresses?.address;
    const district = addresses?.district?.name;
    const province = addresses?.province?.name;
    const ward = addresses?.ward?.name;
    return `${address}, ${ward}, ${district}, ${province}`;
  };
  return (
    <div className="ProductsDetailsPage">
      <HeaderImageLayout title_ul={homestay?.data?.name} />
      <div
        style={{
          maxWidth: '1192px',
          margin: '0 auto',
          padding: '5rem 1.5rem',
        }}
      >
        <div className="homestay-detail__header">
          <h1 style={{ marginBottom: '0' }}>{homestay?.data?.name}</h1>

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
        <div style={{ marginBottom: '1rem' }}>
          {dataHomestay?.comments_count === 0 ? (
            <span> Chưa được đánh giá </span>
          ) : (
            <span>
              <Rate allowHalf disabled value={dataHomestay?.rate} />
            </span>
          )}
        </div>
        <div className="homestay-detail__address">
          <span>Địa chỉ:</span> {renderAddressHomestay()}
        </div>
        <div
          className="gallery"
          onClick={() =>
            dataHomestay?.images?.length > 1 && setVisiblePreviewGroup(true)
          }
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <Image
            style={{ filter: 'brightness(80%)', objectFit: 'cover' }}
            preview={{ visible: false, mask: null }}
            height="400px"
            width="100%"
            src={
              dataHomestay?.avatar ||
              dataHomestay?.images?.[0] ||
              'https://dulichkhampha24.com/wp-content/uploads/2019/12/hang-mua-ninh-binh.jpg'
            }
            fallback="https://doanhnhanplus.vn/wp-content/uploads/2017/12/DN-Anh-chup-Da-Lat-BaiDN-221217-1.jpg"
          />
          {dataHomestay?.images?.length > 1 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                background: 'rgba(0,0,0,0.3)',
              }}
            >
              <AiOutlinePlus fontSize="35px" color="white" />
              <span
                style={{
                  fontSize: '30px',
                  color: 'white',
                  fontWeight: '500',
                }}
              >
                {dataHomestay?.images?.length}
              </span>
            </div>
          )}
        </div>
        <div style={{ display: 'none' }}>
          <Image.PreviewGroup
            preview={{
              visible: visiblePreviewGroup,
              onVisibleChange: (vis) => setVisiblePreviewGroup(vis),
            }}
          >
            {dataHomestay?.images?.map((image, index) => (
              <Image key={index} src={image} alt={`preview ${index}`} />
            ))}
          </Image.PreviewGroup>
        </div>

        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Mô tả" key="1">
            <div className="tabPane tab1">
              {/* <div className="tabPane__title">Mô tả</div> */}
              <div className="tab1__content">
                <p>{dataHomestay?.description}</p>
              </div>
            </div>
          </TabPane>
        
        </Tabs>
        <div className="related">
          <h1 className="related__title">Các phòng của Homestay</h1>
          <TableProduct
            data={dataGroupByCategory}
            nameHomestay={rooms?.data?.[0]?.homestay_id?.name}
            homestay_id={id}
          />
        </div>
        {renderCommentList}
      </div>
    </div>
  );
};

export default HomestayDetailPage;
