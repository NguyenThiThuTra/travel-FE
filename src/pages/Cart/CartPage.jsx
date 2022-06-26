import {
  Button,
  Empty,
  notification,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';
import HeaderImageLayout from '../../common/HeaderImageLayout/HeaderImageLayout';
import { AddCartForm } from '../../common/AddCartForm/AddCartForm';
const { Column, ColumnGroup } = Table;
const axios = require('axios');
const CartPage = () => {

  const [state, setState] = useState(false);

  //onChangeQuantityFavourite
  const [quantityRoom, setQuantityRoom] = useState(null);
  const [onChangeQuantityFavourite, setOnChangeQuantityFavourite] =
    useState(true);
  async function PatchFavourites(record_id, favourite) {
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/favourites/${record_id}`,
        favourite
      );
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'update số lượng phòng thất bại !',
        duration: 1.5,
        style: { backgroundColor: '#f8d7da' },
      });
    }
  }
  async function handleOnChangeQuantityRoom(record, quantity) {
    if (quantity == '') {
      return;
    }
    if (Number(quantity) === 0) {
      let newData = [...dataFavourite];

      const favourite = {
        quantity_room: 1,
      };
      let data = newData.map((item) => {
        if (item._id === record._id) {
          item.quantity_room = 1;
          PatchFavourites(record._id, favourite);
        }
        return item;
      });
      setDataFavourite(data);
    }

    if (record.quantity_room > 0 && Number(quantity)) {
      debugger;
      if (Number(quantity) < 99) {
        let newData = [...dataFavourite];

        const favourite = {
          quantity_room: Number(quantity),
        };
        let data = newData.map((item) => {
          if (item._id === record._id) {
            item.quantity_room = Number(quantity);
            PatchFavourites(record._id, favourite);
          }
          return item;
        });
        setDataFavourite(data);
      } else if (Number(quantity) >= 99) {
        let newData = [...dataFavourite];

        const favourite = {
          quantity_room: 99,
        };
        let data = newData.map((item) => {
          if (item._id === record._id) {
            item.quantity_room = 99;
            PatchFavourites(record._id, favourite);
          }
          return item;
        });
        setDataFavourite(data);
      }
    }
  }

  async function handleDecreaseOnChangeQuantityFavourite(record) {
    if (record.quantity_room > 1) {
      let newData = [...dataFavourite];
      const favourite = {
        quantity_room: record.quantity_room - 1,
      };
      let data = newData.map((item) => {
        if (item._id === record._id) {
          item.quantity_room = item.quantity_room - 1;
          PatchFavourites(record._id, favourite);
        }
        return item;
      });
      setDataFavourite(data);
    }
  }
  async function handleIncreaseOnChangeQuantityFavourite(record) {
    if (record.quantity_room < 99) {
      let newData = [...dataFavourite];
      const favourite = {
        quantity_room: Number(record.quantity_room) + 1,
      };
      let data = newData.map((item) => {
        if (item._id === record._id) {
          item.quantity_room = Number(item.quantity_room) + 1;
          PatchFavourites(record._id, favourite);
        }
        return item;
      });
      setDataFavourite(data);
    }
  }

  const [dataFavourite, setDataFavourite] = useState(null);
  useEffect(async () => {
    try {
      let userLocal = JSON.parse(window.localStorage.getItem('user'));

      if (userLocal) {
        const response = await axios.get(
          `http://localhost:5000/api/v1/favourites/user/${userLocal._id}`
        );
        setDataFavourite(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [state]);
  const deleteDataFavourite = async (value) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/favourites/${value._id}`
      );
      let dataFav = [...dataFavourite];
      let newDataFavourite = dataFav.filter((data) => data._id !== value._id);
      setDataFavourite(newDataFavourite);
      setState(!state);
      notification.success({
        message: 'Xoá phòng thành công !',
        duration: 1.5,
        style: { backgroundColor: '#d4edda' },
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Xoá phòng thất bại !',
        duration: 1.5,
        style: { backgroundColor: '#f8d7da' },
      });
    }
  };
  const TotalMoney = () => {
    let data = [...dataFavourite];

    // Getting sum of numbers
    var sum = data?.reduce(function (init, currenValue) {
      return init + currenValue.quantity_room * currenValue.room_ids.price;
    }, 0);
    return sum;
  };
  const [showContact, setShowContact] = useState(false);
  const submitFormOrder = () => {
    setDataFavourite([]);
  };
  return (
    <div className="CartPage">
      <HeaderImageLayout
        hideFilter={true}
        // src="https://avi.edu.vn/wp-content/uploads/2019/11/london-2393098.jpg"
        title_ul="CART"
      />
      <div
        style={{
          maxWidth: '1192px',
          margin: '0 auto',
          padding: '5rem 1.5rem',
          minHeight: '28vh',
        }}
      >
        {true ? (
          <div>
            <div>
              <Table dataSource={dataFavourite}>
                <Column
                  title="Homestay"
                  dataIndex="name_homestay"
                  key="name_homestay"
                />
                <Column
                  title="Tên phòng"
                  dataIndex="room_ids"
                  key="room_ids"
                  render={(room) => (
                    <>
                      <span color="blue">{room.name}</span>
                    </>
                  )}
                />
                <Column
                  title="Loại phòng"
                  dataIndex="room_ids"
                  key="room_ids"
                  render={(room) => (
                    <>
                      <Tag color="blue">{room.type}</Tag>
                    </>
                  )}
                />

                <Column
                  title="Số lượng"
                  render={(text, record) => (
                    <div>
                      <div style={{ display: 'flex' }}>
                        <div className="quantity">
                          <div
                            className="quantity__decrease quantity__key"
                            onClick={() => {
                              handleDecreaseOnChangeQuantityFavourite(record);
                            }}
                          >
                            -
                          </div>
                          <input
                            onChange={(e) => {
                              handleOnChangeQuantityRoom(
                                record,
                                e.target.value
                              );
                            }}
                            type="text"
                            value={record.quantity_room}
                            defaultValue={record.quantity_room}
                          />
                          <div
                            className="quantity__increase quantity__key"
                            onClick={() =>
                              handleIncreaseOnChangeQuantityFavourite(record)
                            }
                          >
                            +
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  dataIndex="room_ids"
                  key="room_ids"
                />
                <Column
                  title="Giá phòng"
                  dataIndex="room_ids"
                  key="room_ids"
                  render={(room) => (
                    <>
                      <span>{room.price}</span>
                    </>
                  )}
                />
                <Column
                  title="Thao tác"
                  key="action"
                  render={(text, record) => (
                    <div>
                      <Space size="middle">
                        <Popconfirm
                          placement="topRight"
                          title="Bạn có đồng ý xoá phòng đã chọn không ?"
                          onConfirm={() => deleteDataFavourite(record)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <span
                            style={{ color: '#096dd9', fontSize: '1.6rem' }}
                          >
                            Delete
                          </span>
                        </Popconfirm>
                      </Space>
                    </div>
                  )}
                />
              </Table>
            </div>
            <div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <div style={{ marginRight: '17rem' }}>
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: 'red',
                      marginBottom: '1rem',
                    }}
                  >
                    Tổng tiền :
                    <span style={{ margin: '0 .5rem 0 1rem' }}>
                      {dataFavourite && TotalMoney()}
                    </span>
                    VND
                  </div>
                  {!showContact && (
                    <Button
                      onClick={() => setShowContact(true)}
                      style={{ fontWeight: 'bold' }}
                      size="large"
                      type="primary"
                    >
                      Đặt phòng
                    </Button>
                  )}
                </div>
              </div>
              {showContact && <AddCartForm />}
            </div>
          </div>
        ) : (
          <Empty description="No products in the cart" />
        )}
      </div>
    </div>
  );
};

export default CartPage;
