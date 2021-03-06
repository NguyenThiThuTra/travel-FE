import { Image, Popconfirm, Switch } from 'antd';
import { ActionTable } from 'common/Table/ActionTable';
import CustomTable from 'common/Table/CustomTable';
import CustomTitleTable from 'common/Table/CustomTitleTable';
import { PERMISSIONS } from 'constants/permissions';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { AiFillEye } from 'react-icons/ai';
import {
  deleteRoom,
  fetchAllCategory,
  handleActiveCategory,
  updateCategory,
  useCategorySelector,
  useCategoryUpdatedSelector,
  useRoomRemovedSelector,
  useRoomsLoadingSelector,
  useRoomsSelector,
} from 'features/Rooms/RoomsSlice';
import moment from 'moment';
import queryString from 'query-string';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
const expandable = {
  expandedRowRender: (record) => <p>description</p>,
};

export default function AdminCategoryPage(props) {
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const querySearch = queryString.parse(location.search);
  const dispatch = useDispatch();
  const rooms = useSelector(useRoomsSelector);
  const loading = useSelector(useRoomsLoadingSelector);
  const currentUser = useSelector(useCurrentUserSelector);
  const roomRemoved = useSelector(useRoomRemovedSelector);
  const category = useSelector(useCategorySelector);
  const categoryUpdated = useSelector(useCategoryUpdatedSelector);

  useEffect(() => {
    const role = currentUser?.data?.roles;
    // const payload = {
    //   ...querySearch,
    // };
    // if (role === PERMISSIONS.admin ) {
    //   return dispatch(fetchAllCategory(payload));
    // }
    if (role === PERMISSIONS.user) {
      const payload = {
        ...querySearch,
        filters: {
          user_id: currentUser?.data?._id,
        },
      };
      dispatch(fetchAllCategory(payload));
    }
    /* eslint-disable */
  }, [location, roomRemoved, currentUser, categoryUpdated]);

  const onChangePagination = (pagination) => {
    let query = {
      ...querySearch,
      page: pagination.current,
      limit: pagination.pageSize,
    };
    history.push(`${match.url}?${queryString.stringify(query)}`);
  };

  const showListRoomInHomestay = (category_id) => {
    return history.push(`${match.url}/detail/${category_id}/rooms`);
  };
  
  const columns = useMemo(
    () => [
      // {
      //   title: 'ID',
      //   dataIndex: '_id',
      //   key: '_id',
      //   width: 220,
      // },
      // {
      //   title: 'Homestay id',
      //   dataIndex: 'homestay_id',
      //   key: 'homestay_id',
      //   width: 220,
      //   render: (n, record) => {
      //     return <div>{record?.homestay_id}</div>;
      //   },
      // },
      {
        title: 'T??n ',
        width: 220,
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        render: (n, record) => {
          return <div>{record?.name}</div>;
        },
      },
      {
        title: 'Lo???i ph??ng',
        width: 150,
        dataIndex: 'type',
        key: 'type',
        render: (n, record) => {
          return <div>{record?.type}</div>;
        },
      },
      {
        title: 'Gi?? ph??ng',
        width: 150,
        dataIndex: 'price',
        key: 'price',
        render: (n, record) => {
          return <div>{record?.price}</div>;
        },
      },
      {
        title: 'S??? l?????ng ph??ng',
        width: 150,
        dataIndex: 'quantity',
        key: 'description',
        render: (n, record) => {
          return <div>{record?.quantity}</div>;
        },
      },
      {
        title: 'M?? t??? ',
        width: 250,
        dataIndex: 'description',
        key: 'description',
        render: (n, record) => {
          return <div>{record?.description}</div>;
        },
      },
      {
        title: '???nh ?????i di???n',
        dataIndex: 'avatar',
        key: 'avatar',
        width: 250,
        render: (n, record) => {
          return (
            <div>
              {(record?.avatar || record?.images?.[0]) && (
                <Image
                  style={{
                    maxWidth: '235px',
                    maxHeight: '170px',
                    width: '235px',
                    height: '170px',
                    objectFit: 'cover',
                  }}
                  preview={{ visible: false, mask: null }}
                  src={record?.avatar || record?.images?.[0]}
                  alt="image preview"
                />
              )}
            </div>
          );
        },
      },
      {
        title: 'B??? s??u t???p ???nh',
        dataIndex: 'images',
        key: 'gallery',
        width: 250,
        render: (n, record) => {
          const visiblePreviewImageGallery = () => {
            if (record?.images?.length > 1) {
              setImageGallery(record.images);
              setVisiblePreviewGroup(true);
            }
          };
          return (
            <Fragment>
              {record?.images?.length ? (
                <div
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onClick={visiblePreviewImageGallery}
                >
                  <Image
                    style={{
                      filter: 'brightness(80%)',
                      maxWidth: '235px',
                      maxHeight: '170px',
                      width: '235px',
                      height: '170px',
                      objectFit: 'cover',
                    }}
                    preview={{ visible: false }}
                    src={record?.images?.[0]}
                    alt="image preview"
                  />
                  {record?.images?.length > 1 && (
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
                        {record?.images?.length}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                ''
              )}
            </Fragment>
          );
        },
      },
      {
        title: 'S??? l?????ng h??nh ???nh',
        dataIndex: 'images',
        key: 'images',
        width: 100,
        render: (n, record) => {
          return <div>{record?.images?.length}</div>;
        },
      },
      // {
      //   title: 'S??? b??nh lu???n',
      //   dataIndex: 'comments_count',
      //   key: 'comments_count',
      //   width: 100,
      //   render: (n, record) => {
      //     return <div>{record?.homestay_id?.comments_count ?? 0}</div>;
      //   },
      // },

      // {
      //   title: '????nh gi??',
      //   dataIndex: 'rate',
      //   key: 'rate',
      //   width: 100,
      //   render: (n, record) => {
      //     return <div>{record?.homestay_id?.rate ?? 0}</div>;
      //   },
      // },
      // {
      //   title: 'L?????t xem',
      //   dataIndex: 'view',
      //   key: 'view',
      //   width: 100,
      //   render: (n, record) => {
      //     return <div>{record?.homestay_id?.view ?? 0}</div>;
      //   },
      // },
      {
        title: 'Ng??y t???o',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: (time) => {
          return <div>{moment(time).format('DD/MM/YYYY')} </div>;
        },
      },
      {
        title: 'Ng??y c???p nh???t',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 150,
        render: (time) => {
          return <div>{moment(time).format('DD/MM/YYYY')} </div>;
        },
      },
      {
        title: 'Ho???t ?????ng',
        dataIndex: 'active',
        key: 'active',
        width: 150,
        render: (n, record) => {
          return (
            <Popconfirm
              title={
                record.active
                  ? 'B???n mu???n d???ng ho???t ?????ng c???a ph??ng n??y kh??ng?'
                  : 'B???n mu???n m??? l???i ho???t ?????ng c???a ph??ng n??y kh??ng?'
              }
              onConfirm={() =>
                dispatch(
                  handleActiveCategory({
                    id: record?._id,
                    category: { active: !record?.active },
                  })
                )
              }
              okText="?????ng ??"
              cancelText="Kh??ng"
            >
              <Switch
                style={{ opacity: 1 }}
                // defaultChecked
                checked={record.active}
                // disabled={true}
              />
            </Popconfirm>
          );
        },
      },
      {
        title: 'Thao t??c',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (r) => (
          <ActionTable
            id={r._id}
            dataDetail={category}
            funcDelete={deleteRoom}
            showActionDelete={false}
            showActionCustom={
              <AiFillEye
                onClick={() => showListRoomInHomestay(r._id)}
                style={{ marginRight: '15px' }}
                cursor="pointer"
                fontSize="20px"
                color="#1890ff"
              />
            }
          />
        ),
      },
    ],
    [rooms]
  );

  // visiblePreviewGroup
  const [visiblePreviewGroup, setVisiblePreviewGroup] = useState(false);
  const [imageGallery, setImageGallery] = useState([]);
  return (
    <Fragment>
      <div style={{ backgroundColor: '#fff' }}>
        <CustomTable
          rowKey={(r) => r._id}
          onChange={onChangePagination}
          loading={loading}
          columns={columns}
          dataSource={category?.data || null}
          pagination={{
            showSizeChanger: true,
            total: category?.paging?.total,
            defaultCurrent: Number(querySearch?.page) || 1,
            defaultPageSize: Number(querySearch?.limit) || 10,
          }}
          // expandable={expandable}
          title={() => <CustomTitleTable title="Danh s??ch lo???i ph??ng" />}
          // footer={() => <CustomFooterTable title="Here is footer" />}
        />
      </div>

      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible: visiblePreviewGroup,
            onVisibleChange: (vis) => setVisiblePreviewGroup(vis),
          }}
        >
          {imageGallery?.map((image, index) => (
            <Image key={index} src={image} alt={`preview ${index}`} />
          ))}
        </Image.PreviewGroup>
      </div>
    </Fragment>
  );
}
