import { Select, Tag } from 'antd';
import {
  ORDER_STATUS,
  ORDER_STATUS_COLOR,
  ORDER_STATUS_VALUE,
} from 'constants/order';
import { PERMISSIONS } from 'constants/permissions';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { fetchAllHomestays } from 'features/Homestay/HomestaySlice';
import {
  getAllOrder,
  updateOrder,
  useDeleteOrderSelector,
  useOrderSelector,
} from 'features/Order/OrderSlice';
import moment from 'moment';
import queryString from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { ActionTable } from '../../../common/Table/ActionTable';
import CustomTable from '../../../common/Table/CustomTable';
import CustomTitleTable from '../../../common/Table/CustomTitleTable';
const expandable = {
  expandedRowRender: (record) => <p> {record.note} </p>,
};
const { Option } = Select;

export default function OrdersPage(props) {
  let history = useHistory();
  let match = useRouteMatch();
  let location = useLocation();
  const querySearch = queryString.parse(location.search);

  const dispatch = useDispatch();
  const order = useSelector(useOrderSelector);
  const currentUser = useSelector(useCurrentUserSelector);
  const loading = useSelector((state) => state.order.loading);
  const deleteOrder = useSelector(useDeleteOrderSelector);

  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const getOrderHomestayById = async () => {
      const role = currentUser?.data?.roles;
      if (role) {
        const queryAllHomestay = {
          ...querySearch,
          filters: {
            user_id: currentUser?.data?._id,
          },
        };
        const resultAction = await dispatch(
          fetchAllHomestays(queryAllHomestay)
        ).unwrap();
        const homestay_id = resultAction?.data?.[0]?._id;

        if (role === PERMISSIONS.user && homestay_id) {
          let payload = {
            ...querySearch,
            filters: {
              homestay_id: homestay_id,
            },
            sort: '-createdAt',
          };
          if (filterStatus?.length > 0) {
            payload = {
              ...payload,
              filters: { ...payload.filters, status: filterStatus },
            };
          }
          dispatch(getAllOrder(payload));
          return;
        }
        // if (role === PERMISSIONS.admin) {
        //   const payload = {
        //     ...querySearch,
        //   };
        //   dispatch(getAllOrder(payload));
        // }
      }
    };
    getOrderHomestayById();

    /* eslint-disable */
  }, [location, deleteOrder, currentUser, filterStatus]);

  const onChangePagination = (pagination, filters) => {
    setFilterStatus(filters?.status || []);

    let query = {
      ...querySearch,
      page: pagination.current,
      limit: pagination.pageSize,
    };
    history.push(`${match.url}?${queryString.stringify(query)}`);
  };
  const handleChangeStatus = async (status, record) => {
    // update status !rejected
    if (status === ORDER_STATUS.approved.en) {
      const formOrder = { status };

      return dispatch(
        updateOrder({
          id: record._id,
          order: formOrder,
        })
      );
    }
    // update status rejected
    if (status === ORDER_STATUS.rejected.en) {
      // update status rejected
      const formOrder = { status };
      dispatch(
        updateOrder({
          id: record._id,
          order: formOrder,
        })
      );
    }
  };
  const totalPayment = (data) => {
    return (
      data?.total_payment ||
      data?.order?.reduce((acc, item) => {
        return acc + item?.select_room * item?.category_id?.price;
      }, 0)
    );
  };
  const columns = useMemo(
    () => [
      {
        title: 'M?? ????n h??ng',
        dataIndex: '_id',
        key: '_id',
        width: 220,
      },
      {
        title: 'S??? l?????ng ',
        width: 100,
        dataIndex: 'totalSelectedRooms',
        key: 'totalSelectedRooms',
        sorter: (a, b) => a.totalSelectedRooms - b.totalSelectedRooms,
        render: (text, record) => {
          return <span>{`${record?.order?.length} ph??ng`}</span>;
        },
      },
      {
        title: 'T???ng ti???n',
        width: 150,
        dataIndex: 'totalPayment',
        key: 'totalPayment',
        render: (text, record) => {
          return <span>{totalPayment(record)} VND</span>;
        },
      },
      {
        title: 'Th???i gian',
        dataIndex: 'time',
        key: 'time',
        width: 200,
        render: (n, record) => {
          return (
            <div>
              <div>
                {moment(record.start).format('DD/MM/YYYY')}-
                {moment(record.end).format('DD/MM/YYYY')}
              </div>
            </div>
          );
        },
      },
      {
        title: 'Thanh to??n',
        dataIndex: 'payment',
        key: 'payment',
        width: 150,
      },
      {
        title: 'Ng??y t???o',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 120,
        render: (n, record) => {
          return (
            <div>{moment(record.createdAt).format('DD/MM/YYYY HH:mm ')}</div>
          );
        },
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      },
      {
        title: 'Ghi ch??',
        dataIndex: 'note',
        key: 'note',
        width: 150,
      },
      {
        title: 'Tr???ng th??i',
        dataIndex: 'status',
        key: 'status',
        fixed: 'right',
        width: 150,
        render: (n, record) => {
          return (
            <>
              <Tag
                style={{ borderRadius: '10px' }}
                color={ORDER_STATUS_COLOR?.[record.status]}
              >
                {ORDER_STATUS?.[record.status].vi}
              </Tag>

              {/* <Select
                defaultValue={record.status}
                // disabled={record.status !== ORDER_STATUS.pending.en}
                style={{ width: 120 }}
                onSelect={(status) => handleChangeStatus(status, record)}
              >
                <Option value="pending">
                  
                  <Tag
                    style={{ borderRadius: '10px' }}
                    color={ORDER_STATUS_COLOR?.pending}
                  >
                    {ORDER_STATUS?.pending.vi}
                  </Tag>
                </Option>
                <Option value="approved">
                  <Tag
                    style={{ borderRadius: '10px' }}
                    color={ORDER_STATUS_COLOR?.approved}
                  >
                    {ORDER_STATUS?.approved.vi}
                  </Tag>
                </Option>
                <Option value="rejected">
                  <Tag
                    style={{ borderRadius: '10px' }}
                    color={ORDER_STATUS_COLOR?.rejected}
                  >
                    {ORDER_STATUS?.rejected.vi}
                  </Tag>
                </Option>
              </Select> */}
            </>
          );
        },
        filters: [
          {
            text: ORDER_STATUS.pending.vi,
            value: ORDER_STATUS.pending.en,
          },
          {
            text: ORDER_STATUS.approved.vi,
            value: ORDER_STATUS.approved.en,
          },
          {
            text: ORDER_STATUS.rejected.vi,
            value: ORDER_STATUS.rejected.en,
          },
          {
            text: ORDER_STATUS.canceled.vi,
            value: ORDER_STATUS.canceled.en,
          },
        ],
        filterSearch: true,
        sorter: (a, b) =>
          ORDER_STATUS_VALUE[a.status] - ORDER_STATUS_VALUE[b.status],
      },
      {
        title: 'Thao t??c',
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (r) => (
          <ActionTable
            showActionView
            id={r._id}
            dataDetail={order}
            showActionDelete={false}
            showActionEdit={false}
          />
        ),
      },
    ],
    [order]
  );

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <CustomTable
        rowKey={(r) => r._id}
        onChange={onChangePagination}
        loading={loading}
        columns={columns}
        dataSource={order?.data || null}
        pagination={{
          showSizeChanger: true,
          total: order?.paging?.total,
          defaultCurrent: Number(querySearch?.page) || 1,
          defaultPageSize: Number(querySearch?.limit) || 10,
        }}
        // expandable={expandable}
        title={() => (
          <CustomTitleTable hideAdd={true} title="Danh s??ch order" />
        )}
        // footer={() => <CustomFooterTable title="Here is footer" />}
      />
    </div>
  );
}
