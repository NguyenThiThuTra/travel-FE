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
import { BsCheck2 } from 'react-icons/bs';
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

    if (role === PERMISSIONS.user) {
      const payload = {
        ...querySearch,
        filters: {
          user_id: currentUser?.data?._id,
        },
        sort: "-createdAt"
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
      {
        title: 'Tên ',
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
        title: 'Loại phòng',
        width: 150,
        dataIndex: 'type',
        key: 'type',
        render: (n, record) => {
          return <div>{record?.type}</div>;
        },
      },
      {
        title: 'Giá phòng',
        width: 150,
        dataIndex: 'price',
        key: 'price',
        render: (n, record) => {
          return <div>{record?.price}</div>;
        },
      },
      {
        title: 'Số lượng phòng',
        width: 150,
        dataIndex: 'quantity',
        key: 'description',
        render: (n, record) => {
          return <div>{record?.quantity}</div>;
        },
      },
      {
        title: 'Mô tả ',
        width: 250,
        dataIndex: 'description',
        key: 'description',
        render: (n, record) => {
          const amenities = record?.amenities;
          return <div>
            <div>{record?.description}</div>
            {!!amenities.length && <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: '14px' }}>
              {amenities?.map((item, index) => <div style={{ paddingRight: '12px', display: 'flex' }} key={index}><BsCheck2 color='green' style={{ marginTop: '5px', marginRight: '5px' }} /> {item}</div>)}
            </div>}
          </div>
        },
      },
      {
        title: 'Ảnh đại diện',
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
        title: 'Bộ sưu tập ảnh',
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
        title: 'Số lượng hình ảnh',
        dataIndex: 'images',
        key: 'images',
        width: 100,
        render: (n, record) => {
          return <div>{record?.images?.length}</div>;
        },
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: (time) => {
          return <div>{moment(time).format('DD/MM/YYYY')} </div>;
        },
      },
      {
        title: 'Ngày cập nhật',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 150,
        render: (time) => {
          return <div>{moment(time).format('DD/MM/YYYY')} </div>;
        },
      },
      {
        title: 'Hoạt động',
        dataIndex: 'active',
        key: 'active',
        width: 150,
        render: (n, record) => {
          return (
            <Popconfirm
              title={
                record.active
                  ? 'Bạn muốn dừng hoạt động của phòng này không?'
                  : 'Bạn muốn mở lại hoạt động của phòng này không?'
              }
              onConfirm={() =>
                dispatch(
                  handleActiveCategory({
                    id: record?._id,
                    category: { active: !record?.active },
                  })
                )
              }
              okText="Đồng ý"
              cancelText="Không"
            >
              <Switch
                style={{ opacity: 1 }}
                checked={record.active}
              />
            </Popconfirm>
          );
        },
      },
      {
        title: 'Thao tác',
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
          title={() => <CustomTitleTable title="Danh sách loại phòng" />}
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
