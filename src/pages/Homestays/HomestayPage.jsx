import { Alert, Col, Pagination, Row } from 'antd';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import HeaderImageLayout from 'common/HeaderImageLayout/HeaderImageLayout';
import HomestayItem from 'common/HomestayItem/HomestayItem';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import {
  fetchAllHomestays,
  fetchAllHomestaySearch,
  useHomestaysSelector,
} from 'features/Homestay/HomestaySlice';
import { useState } from 'react';
import { BiSortAlt2 } from 'react-icons/bi';

const HomestayPage = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();

  const querySearch = queryString.parse(location.search);
  const dispatch = useDispatch();
  const homestays = useSelector(useHomestaysSelector);

  // SORT homestay
  const [sortHomestay, setSortHomestay] = useState('');

  const handleSortHomestay = (e) => {
    setSortHomestay(e.key);
    let query = { ...querySearch };
    let payload = {};
    if (e.key) {
      query.sort = e.key;
      payload = { ...query };
    } else {
      const { sort, ...rest } = query;
      payload = { ...rest };
    }

    const searchParams = queryString.stringify(payload);
    history.push({
      pathname: match.url,
      search: searchParams,
    });
  };

  const SORT_HOMESTAY = [
    {
      label: 'Mặc định',
      key: '',
    },
    {
      label: 'Giá tăng dần',
      key: 'minPrice',
    },
    {
      label: 'Giá giảm dần',
      key: '-minPrice',
    },
    {
      label: 'Sao tăng dần',
      key: 'rate',
    },
    {
      label: 'Sao giảm dần',
      key: '-rate',
    },
  ];
  const menu = <Menu onClick={handleSortHomestay} items={SORT_HOMESTAY} />;

  const pagingDefault = { limit: 9, page: 1 };
  useEffect(() => {
    // console.log({ querySearch });
    const payload = {
      limit: pagingDefault.limit,
      page: pagingDefault.page,
      filters: {
        active: true,
      },
      activeCategory: true,
      ...querySearch,
    };
    dispatch(fetchAllHomestaySearch(payload));
    /* eslint-disable */
  }, [location]);

  const handleRedirectHomestayDetail = (id) => {
    if (!querySearch || !querySearch?.from_date || !querySearch?.to_date) {
      const inputTime = document.querySelector(
        '.ant-picker-range.form-filters__input'
      );
      if (inputTime) {
        inputTime.click();
      }
      return;
    }
    const { page, limit, ...rest } = querySearch;
    const searchParams = queryString.stringify(rest);

    history.push({
      pathname: `${match.url}/${id}`,
      search: searchParams,
    });
  };

  const onShowSizeChange = (current, pageSize) => {
    // console.log({ current, pageSize, querySearch });
    const query = {
      ...querySearch,
      page: current,
      limit: pageSize,
    };
    const searchParams = queryString.stringify(query);
    history.push({
      pathname: match.url,
      search: searchParams,
    });
  };

  return (
    <div className="PackagesPage">
      <HeaderImageLayout />
      <div
        className="list-product"
        style={{
          maxWidth: '1192px',
          margin: '0 auto',
          padding: '5rem 1.5rem',
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <Space>
              <Space>
                <BiSortAlt2 />
                Sắp xếp theo : {!sortHomestay && 'Mặc định'}
                {sortHomestay &&
                  SORT_HOMESTAY.find((item) => item.key === sortHomestay)
                    ?.label}
              </Space>
              <DownOutlined />
            </Space>
          </Dropdown>
        </div>

        <Row gutter={[24, 24]}>
          {homestays?.data?.map((homestay) => (
            <Col
              key={homestay?._id}
              className="gutter-row"
              span={4}
              xs={24}
              sm={24}
              md={12}
              lg={8}
              xl={8}
              xxl={8}
            >
              <HomestayItem
                handleRedirectHomestayDetail={() =>
                  handleRedirectHomestayDetail(homestay?._id)
                }
                homestay={homestay}
              />
            </Col>
          ))}
          {homestays?.data?.length === 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Alert
                message="Hiện tại có homestay trong khu vực hoặc trong thời gian này hoạt động"
                type="info"
                showIcon
              />
            </div>
          )}
        </Row>
        <Pagination
          style={{ marginTop: '5rem', textAlign: 'center' }}
          showQuickJumper
          // defaultCurrent={2}
          // total={500}
          onChange={onShowSizeChange}
          total={homestays?.paging?.total || 1}
          defaultCurrent={Number(querySearch?.page) || pagingDefault.page}
          defaultPageSize={Number(querySearch?.limit) || pagingDefault.limit}
          current={Number(querySearch?.page) || pagingDefault.page}
          pageSize={Number(querySearch?.limit) || pagingDefault.limit}
        />
      </div>
    </div>
  );
};

export default HomestayPage;
