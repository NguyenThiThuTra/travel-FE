import { Image, Popconfirm, Rate, Switch } from 'antd';
import { ActionTable } from 'common/Table/ActionTable';
import CustomTable from 'common/Table/CustomTable';
import CustomTitleTable from 'common/Table/CustomTitleTable';
import { PERMISSIONS } from 'constants/permissions';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import {
  deleteHomestay,
  fetchAllHomestays, handleActiveHomestay, useHomestayRemovedSelector,
  useHomestaysSelector, useHomestayUpdatedSelector
} from 'features/Homestay/HomestaySlice';
import moment from 'moment';
import queryString from 'query-string';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
const expandable = {
  expandedRowRender: (record) => <p>description</p>,
};

export default function AdminHomestaysPage(props) {
  let history = useHistory();
  let match = useRouteMatch();
  let location = useLocation();
  const querySearch = queryString.parse(location.search);
  const dispatch = useDispatch();
  const homestays = useSelector(useHomestaysSelector);
  const loading = useSelector((state) => state.homestay.loading);
  const currentUser = useSelector(useCurrentUserSelector);
  const homestayRemoved = useSelector(useHomestayRemovedSelector);
  const homestayUpdated = useSelector(useHomestayUpdatedSelector);

  useEffect(() => {
    const role = currentUser?.data?.roles;
    if (role) {
      let query = { ...querySearch };
      if (role === PERMISSIONS.user) {
        query = {
          ...querySearch,
          filters: {
            user_id: currentUser?.data?._id,
          },
        };
      }
      dispatch(fetchAllHomestays(query));
    }
    /* eslint-disable */
  }, [location, homestayRemoved, currentUser, homestayUpdated]);
  const onChangePagination = (pagination) => {
    let query = {
      ...querySearch,
      page: pagination.current,
      limit: pagination.pageSize,
    };
    history.push(`${match.url}?${queryString.stringify(query)}`);
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
      //   title: 'Id ng?????i d??ng',
      //   dataIndex: 'user_id',
      //   key: 'user_id',
      //   width: 220,
      // },
      {
        title: 'T??n ',
        width: 220,
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      },
      {
        title: '?????a ch???',
        dataIndex: 'addresses',
        key: 'addresses',
        width: 150,
        render: (n, record) => {
          return (
            <div>{`${record?.addresses?.address} ${record?.addresses?.ward?.name} ${record?.addresses?.district?.name} ${record?.addresses?.province?.name} `}</div>
          );
        },
      },
      {
        title: 'M?? t???',
        width: 220,
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '????nh gi??',
        dataIndex: 'rate',
        key: 'rate',
        width: 150,
        render: (n, record) => {
          return (
            <div>
              {record?.rate ? (
                <Rate
                  style={{
                    fontSize: '15px',
                  }}
                  allowHalf
                  disabled
                  defaultValue={record?.rate}
                />
              ) : (
                'Ch??a c?? ????nh gi??'
              )}
            </div>
          );
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
              console.log('hihi');
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
      {
        title: 'S??? b??nh lu???n',
        dataIndex: 'comments_count',
        key: 'comments_count',
        width: 100,
      },
      // {
      //   title: '????nh gi??',
      //   dataIndex: 'rate',
      //   key: 'rate',
      //   width: 100,
      // },
      // {
      //   title: 'L?????t xem',
      //   dataIndex: 'view',
      //   key: 'view',
      //   width: 100,
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
                  ? 'B???n mu???n d???ng ho???t ?????ng c???a homestay?'
                  : 'B???n mu???n m??? l???i ho???t ?????ng c???a homestay?'
              }
              onConfirm={() =>
                dispatch(
                  handleActiveHomestay({
                    id: record?._id,
                    homestay: { active: !record?.active },
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
            dataDetail={homestays}
            funcDelete={deleteHomestay}
            showActionDelete={false}
          />
        ),
      },
    ],
    [homestays]
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
          dataSource={homestays?.data || null}
          pagination={{
            showSizeChanger: true,
            total: homestays?.paging?.total,
            defaultCurrent: Number(querySearch?.page) || 1,
            defaultPageSize: Number(querySearch?.limit) || 10,
          }}
          // expandable={expandable}
          title={() => (
            <CustomTitleTable
              hideAdd={
                currentUser?.data?.roles === PERMISSIONS.user &&
                homestays?.data?.length > 0
              }
              title="Danh s??ch homestay"
            />
          )}
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
