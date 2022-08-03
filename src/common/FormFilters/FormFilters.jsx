import { Button, Col, DatePicker, Row, Select } from 'antd';
import provincesOpenApi from 'api/provincesOpenApi';
import { RouteConstant } from 'constants/RouteConstant';
import moment from 'moment';
import queryString from 'query-string';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { openInNewTab } from 'utils/openInNewTab';
import './_FormFilters.scss';
const { RangePicker } = DatePicker;
const FormFilters = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();

  const nameHomestayRef = useRef('');

  const querySearch = queryString.parse(location.search);

  // lấy danh sách các tỉnh thành
  const [provinces, setProvinces] = useState(null);
  useEffect(() => {
    async function getProvinces() {
      const response = await provincesOpenApi.getAllProvinces();
      setProvinces(response);
    }
    getProvinces();
  }, []);
  // default value
  const [provinceCode, setProvinceCode] = useState(null);
  const [rangePickerValue, setRangePickerValue] = useState([null, null]);

  // default filter query search
  useEffect(() => {
    if (!querySearch) return;

    if (querySearch?.province_code) {
      setProvinceCode(+querySearch.province_code);
    }
    if (querySearch?.from_date && querySearch?.to_date) {
      setRangePickerValue([
        moment(querySearch.from_date),
        moment(querySearch.to_date),
      ]);
    }
  }, [location]);
  // end default value
  function onChangeProvince(value) {
    console.log(`selected ${value}`);
    setProvinceCode(value);
  }

  function Search() {
    const { sort } = querySearch;
    const from_date = moment(rangePickerValue[0]).format('YYYY-MM-DD');
    const to_date = moment(rangePickerValue[1]).format('YYYY-MM-DD');
    const query = { sort };

    if (nameHomestayRef.current.value) {
      query.search = nameHomestayRef.current.value;
    }
    if (provinceCode) {
      query.province_code = provinceCode;
    }
    if (from_date !== 'Invalid date' && from_date !== 'Invalid date') {
      query.from_date = from_date;
      query.to_date = to_date;
    }

    const searchParams = queryString.stringify(query);
    if (match.url === RouteConstant.HomestayDetailPage.path) {
      return window.open(RouteConstant.HomestayPage.path + '?' + searchParams);
    }

    if (match.path === RouteConstant.HomestayDetailPage.path) {
      const url = `${RouteConstant.HomestayPage.path}?${searchParams}`;
      openInNewTab(url);
    } else {
      history.push({
        pathname: match.url,
        search: searchParams,
      });
    }
  }

  function onBlurProvince() {
    console.log('blur');
  }

  function onFocusProvince() {
    console.log('focus');
  }

  function onSearchProvince(val) {
    console.log('search:', val);
  }
  // change filter time
  async function onChangeDate(dates, dateStrings) {
    console.log({ dates, dateStrings });
    if (!dates) {
      setRangePickerValue([null, null]);
      return;
    }
    if (!dates || !dateStrings) {
      return;
    }
    setRangePickerValue([moment(dateStrings[0]), moment(dateStrings[1])]);
  }

  function disabledDate(current) {
    return current && current < moment().startOf('day');
  }

  return (
    <div style={{ position: 'relative' }} className="form-filters">
      <Row gutter={[24, 24]}>
        <Col span={8} xs={24} sm={24} md={24} lg={8}>
          <div className="form-filters__col">
            <div className="form-filters__title">Chọn địa điểm bạn muốn :</div>
            <Select
              allowClear
              value={provinceCode}
              className="form-filters__input"
              onChange={onChangeProvince}
              onFocus={onFocusProvince}
              onBlur={onBlurProvince}
              onSearch={onSearchProvince}
              showSearch
              style={{ width: 200 }}
              placeholder="Tìm kiếm... "
              options={provinces?.map((province) => ({
                value: province.code,
                label: province.name,
              }))}
              optionFilterProp="children"
              filterOption={(input, option) => {
                console.log({ option });
                return (
                  option?.label?.toLowerCase()?.indexOf(input?.toLowerCase()) >=
                  0
                );
              }}
              filterSort={(optionA, optionB) =>
                optionA?.label
                  ?.toLowerCase()
                  ?.localeCompare(optionB?.label?.toLowerCase())
              }
            />
          </div>
        </Col>
        {/* <Col span={8} xs={24} sm={24} md={24} lg={8}>
          <div className="form-filters__col">
            <div className="form-filters__title">{`Tên homestay`}</div>
            <Input
              onChange={(e) => handleOnChangeName(e.target.value)}
              placeholder="Tên homestay"
            />
          </div>
        </Col> */}
        <Col span={8} xs={24} sm={24} md={24} lg={8}>
          <div className="form-filters__col">
            <div className="form-filters__title">{`Ngày check in và check out:`}</div>
            <RangePicker
              value={rangePickerValue}
              disabledDate={disabledDate}
              placeholder={['Ngày check-in ', 'Ngày check-out ']}
              className="form-filters__input"
              ranges={{
                Today: [moment(), moment()],
                'This Month': [
                  moment().startOf('month'),
                  moment().endOf('month'),
                ],
              }}
              onChange={onChangeDate}
            />
          </div>
        </Col>
        <Col span={8} xs={24} sm={24} md={24} lg={8}>
          <div className="form-filters__col">
            <div className="form-filters__title">Tìm kiếm Homestay</div>
            <input
              className="form-filters__search"
              ref={nameHomestayRef}
              placeholder="Tìm kiếm homestay ?"
            />
          </div>
        </Col>
        {/* <Col span={8} xs={24} sm={24} md={24} lg={8}>
          <div className="form-filters__col">
            <div style={{ display: 'flex' }}>
              <div
                className="form-filters__title"
                style={{ marginBottom: '0' }}
              >
                Price :
              </div>
              <div className="form-filters__input-price-wrap">
                <InputNumber
                  className="form-filters__input-price"
                  value={price.min}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                  max={999}
                  onChange={onChangeMinPrice}
                />
                <span> - </span>
                <InputNumber
                  className="form-filters__input-price"
                  value={price.max}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  onChange={onChangeMaxPrice}
                  min={0}
                  max={999}
                />
              </div>
            </div>
            <Slider
              range
              value={[price.min, price.max]}
              onChange={onChangePrice}
              min={0}
              max={999}
              style={{ margin: '1rem .5rem 1.5rem' }}
            />
            <Checkbox onChange={onChangeCheckOnlyPromotions}>
              <label className="form-filters__label">See only promotions</label>
            </Checkbox>
          </div>
        </Col> */}
      </Row>
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: 'calc(50% - 50px)',
        }}
      >
        <Button onClick={Search} style={{ width: '100px' }} type="primary">
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default FormFilters;
