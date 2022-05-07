import { Button, Modal, Select, Table } from 'antd';
import queryString from 'query-string';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  fetchAllCategoryInHomestay,
  useRoomsSelector,
} from '../../features/Rooms/RoomsSlice';
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
  console.log({ data });

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
  const showModalOrders = () => {
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
          previousValue +
          currentValue.select_room * currentValue.price,
        0
      ),
    [orders]
  );

  const columns = React.useMemo(
    () => [
      {
        key: '123',
        title: 'Loại chỗ nghỉ	',
        dataIndex: '',
        align: 'left',
        render: (n, record) => {
          const category = record?.[0]?.category_id;
          return (
            <div>
              <Link to="#" className="room-type"></Link>
              <div className="bed-type">{category?.name}</div>
            </div>
          );
        },
      },
      {
        key: 'category.type',
        title: 'Phù hợp cho	',
        dataIndex: 'category.type',
        render: (n, record) => {
          const category = record?.[0]?.category_id;
          return <div className="room_seperator"> {category?.type} </div>;
        },
      },
      {
        title: 'Giá hôm nay	',
        dataIndex: 'category.price',
        render: (n, record) => {
          const category = record?.[0]?.category_id;
          return (
            <div>
              <div className="price-wrap">
                {/* <div className="old_price">VND 5.555.555 </div> */}
                <div className="new_price">{category?.price} vnd</div>{' '}
              </div>
              <div className="maker-helper">Đã bao gồm thuế và phí</div>
              <div className="desc-helper"> Ưu Đãi Trong Thời Gian Có Hạn</div>
            </div>
          );
        },
      },
      // {
      //   title: 'Các lựa chọn',
      //   dataIndex: 'name',
      //   render: (n, record) => {
      //     return (
      //       <div className="options">
      //         <div className="options__eat">
      //           <span>Bao gồm</span> bữa sáng tuyệt vời
      //         </div>
      //         <strong className="">Không hoàn tiền</strong>
      //         <div className="options__description">
      //           Chỉ còn 4 phòng trên trang của chúng tôi
      //         </div>
      //       </div>
      //     );
      //   },
      // },
      {
        key: 'count_empty_room',
        title: 'Chọn phòng',
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
                      <div className="booking-des__item">{`Số lượng phòng đặt : ${totalSelectedRooms}`}</div>
                      <div className="booking-des__item">{`Giá tiền : ${totalPriceOrders}`}</div>
                    </div>
                    <Button
                      onClick={showModalOrders}
                      style={{ width: '100px' }}
                      type="primary"
                    >
                      Tôi sẽ đặt
                    </Button>
                    <ul className="booking-ticker">
                      <li> Xác nhận tức thời</li>
                      <li> Không cần đăng ký</li>
                      <li> Không mất phí đặt phòng hay phí thẻ tín dụng!</li>
                    </ul>
                  </div>
                ) : (
                  <div>Chưa chọn phòng</div>
                )
              ) : null}
            </Fragment>
          );
        },
      },
    ],
    [orders]
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
    </div>
  );
}
