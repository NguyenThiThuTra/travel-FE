import { Alert, Col, Pagination, Row } from 'antd';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import HeaderImageLayout from 'common/HeaderImageLayout/HeaderImageLayout';
import HomestayItem from 'common/HomestayItem/HomestayItem';
import {
  fetchAllHomestays,
  fetchAllHomestaySearch,
  useHomestaysSelector,
} from 'features/Homestay/HomestaySlice';
const HomestayPage = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();

  const querySearch = queryString.parse(location.search);
  const dispatch = useDispatch();
  const homestays = useSelector(useHomestaysSelector);

  const pagingDefault = { limit: 9, page: 1 };
  useEffect(() => {
    dispatch(
      fetchAllHomestaySearch({
        limit: pagingDefault.limit,
        page: pagingDefault.page,
        filters: {
          active: true,
        },
        ...querySearch,
      })
    );
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
    history.push({
      pathname: `${match.url}/${id}`,
      search: location.search,
    });
  };

  const onShowSizeChange = (current, pageSize) => {
    console.log({ current, pageSize });
    const query = {
      ...querySearch,
      page: current,
      limit: pageSize,
    };
    const searchParams = queryString.stringify(query);
    history.push({
      pathname: match.path,
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
        />
      </div>
    </div>
  );
};

export default HomestayPage;
