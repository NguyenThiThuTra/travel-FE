import { Button, Image, Modal, Popconfirm, Select, Table } from 'antd';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { toggleModalLogin } from 'features/commonSlice';
import queryString from 'query-string';
import React, { Fragment, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { AddCartForm } from '../AddCartForm/AddCartForm';
import './_TableProduct.scss';

const { Option } = Select;
function onChange(value) {
  console.log({ value });
}

function onSearch(val) {
  console.log('search:', val);
}

export function TableProduct({ nameHomestay, homestay_id, data }) {
  const location = useLocation();
  const querySearch = queryString.parse(location.search);
  // console.log({ data });
  const dispatch = useDispatch();

  const renderOptionRoom = (record) => {
    const options = [];
    for (let i = 0; i <= record.length; i++) {
      options.push(<Option value={i}>{i}</Option>);
    }
    return options;
  };

  const [orders, setOrders] = useState([]);
  const [isModalOrdersVisible, setIsModalOrdersVisible] = useState(false);

  const currentUser = useSelector(useCurrentUserSelector);
  // open booking
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

  const showModalOrders = () => {
    if (!currentUser) {
      return setVisiblePopupNotification(true);
    }
    setIsModalOrdersVisible(true);
  };

  const handleOkOrders = () => {
    setIsModalOrdersVisible(false);
  };

  const handleCancelOrders = () => {
    setIsModalOrdersVisible(false);
  };
  function handleSelectQuantityRoom(value, category) {
    // return console.log({ value, category });
    setOrders((prevOrders) => {
      const index = prevOrders.findIndex((obj) => obj._id === category._id);
      if (index === -1 && value) {
        return [...prevOrders, { ...category, select_room: value }];
      }
      if (!value) {
        let newOrders = [...prevOrders].filter(
          (item) => item._id !== category._id
        );
        return newOrders;
      }
      let newOrders = [...prevOrders];
      newOrders[index].select_room = value;
      return newOrders;
    });
  }

  const totalSelectedRooms = React.useMemo(
    () =>
      orders.reduce(
        (previousValue, currentValue) =>
          previousValue + currentValue.select_room,
        0
      ),
    [orders]
  );
  const totalPriceOrders = React.useMemo(
    () =>
      orders.reduce(
        (previousValue, currentValue) =>
          previousValue + currentValue.select_room * currentValue.price,
        0
      ),
    [orders]
  );

  // visiblePreviewGroup
  const [visiblePreviewGroup, setVisiblePreviewGroup] = useState(false);
  const [categoryImages, setCategoryImages] = useState([]);
  const handleVisiblePreviewGroup = (images) => {
    setVisiblePreviewGroup(true);
    setCategoryImages(images);
  };

  const columns = React.useMemo(
    () => [
      {
        key: '123',
        title: 'Lo???i ch??? ngh???	',
        dataIndex: '',
        width: 230,
        align: 'left',
        render: (n, record) => {
          const category = record?.[0]?.category_id;
          let images = [...category.images];
          if (category?.avatar) {
            images = [category.avatar, ...images];
          }
          return (
            <div>
              <Link to="#" className="room-type"></Link>
              <div className="bed-type">{category?.name}</div>
              {images?.length > 0 && (
                <Fragment>
                  <div
                    style={{
                      marginTop: '2rem',
                      position: 'relative',
                      cursor: 'pointer',
                      maxWidth: '250px',
                    }}
                    onClick={() => handleVisiblePreviewGroup(images)}
                  >
                    <Image
                      style={{ filter: 'brightness(80%)' }}
                      preview={{ visible: false, mask: null }}
                      src={images?.[0]}
                      alt="image preview"
                    />
                    {images?.length > 1 && (
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
                          {images?.length}
                        </span>
                      </div>
                    )}
                  </div>
                </Fragment>
              )}
            </div>
          );
        },
      },
      {
        key: 'category.description',
        title: 'M?? t???	',
        width: 230,
        dataIndex: 'category.description',
        render: (n, record) => {
          const category = record?.[0]?.category_id;
          return (
            <div className="room_seperator"> {category?.description} </div>
          );
        },
      },
      {
        key: 'category.type',
        title: 'Ph?? h???p cho	',
        dataIndex: 'category.type',
        render: (n, record) => {
          const category = record?.[0]?.category_id;
          return <div className="room_seperator"> {category?.type} </div>;
        },
      },
      {
        title: 'Gi?? h??m nay	',
        dataIndex: 'category.price',
        render: (n, record) => {
          const category = record?.[0]?.category_id;
          return (
            <div>
              <div className="price-wrap">
                {/* <div className="old_price">VND 5.555.555 </div> */}
                <div className="new_price">{category?.price} vnd</div>{' '}
              </div>
              <div className="maker-helper">???? bao g???m thu??? v?? ph??</div>
              <div className="desc-helper"> ??u ????i Trong Th???i Gian C?? H???n</div>
            </div>
          );
        },
      },
      // {
      //   title: 'C??c l???a ch???n',
      //   dataIndex: 'name',
      //   render: (n, record) => {
      //     return (
      //       <div className="options">
      //         <div className="options__eat">
      //           <span>Bao g???m</span> b???a s??ng tuy???t v???i
      //         </div>
      //         <strong className="">Kh??ng ho??n ti???n</strong>
      //         <div className="options__description">
      //           Ch??? c??n 4 ph??ng tr??n trang c???a ch??ng t??i
      //         </div>
      //       </div>
      //     );
      //   },
      // },
      {
        key: 'count_empty_room',
        title: 'Ch???n ph??ng',
        dataIndex: 'count_empty_room',
        render: (n, record) => {
          const category = record?.[0]?.category_id;
          return (
            <Select
              defaultValue="0"
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              onSelect={(value) => handleSelectQuantityRoom(value, category)}
              // onChange={onChange}
              //  onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {renderOptionRoom(record)}
            </Select>
          );
        },
      },
      {
        key: '1',
        title: '',
        dataIndex: 'name',
        render: (n, record, id) => {
          return (
            <Fragment>
              {id === 0 ? (
                orders?.length > 0 ? (
                  <div>
                    <div className="booking-des">
                      <div className="booking-des__item">{`S??? l?????ng ph??ng ?????t : ${totalSelectedRooms}`}</div>
                      <div className="booking-des__item">{`Gi?? ti???n : ${totalPriceOrders}`}</div>
                    </div>
                    <Popconfirm
                      visible={visiblePopupNotification}
                      title="B???n c???n ????ng nh???p ????? th???c hi???n ch???c n??ng n??y ?"
                      onConfirm={confirmNotification}
                      onCancel={cancelNotification}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        onClick={showModalOrders}
                        style={{ width: '100px' }}
                        type="primary"
                      >
                        T??i s??? ?????t
                      </Button>
                    </Popconfirm>
                    <ul className="booking-ticker">
                      <li> X??c nh???n t???c th???i</li>
                      <li> Kh??ng c???n ????ng k??</li>
                      <li> Kh??ng m???t ph?? ?????t ph??ng hay ph?? th??? t??n d???ng!</li>
                    </ul>
                  </div>
                ) : (
                  <div>Ch??a ch???n ph??ng</div>
                )
              ) : null}
            </Fragment>
          );
        },
      },
    ],
    [orders, visiblePopupNotification, currentUser, visiblePreviewGroup]
  );

  const dataTable = Object.values(data);
  return (
    <div id="table-product">
      <Table
        align="top"
        bordered
        columns={columns}
        dataSource={dataTable || null}
        size="middle"
      />
      <Modal
        visible={isModalOrdersVisible}
        footer={null}
        onOk={handleOkOrders}
        onCancel={handleCancelOrders}
      >
        <AddCartForm
          orders={{
            orders,
            totalSelectedRooms,
            totalPriceOrders,
            nameHomestay,
            homestay_id,
          }}
          onCloseModal={handleCancelOrders}
        />
      </Modal>

      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible: visiblePreviewGroup,
            onVisibleChange: (vis) => setVisiblePreviewGroup(vis),
          }}
        >
          {categoryImages?.map((image, index) => (
            <Image key={index} src={image} alt={`preview ${index}`} />
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  );
}
