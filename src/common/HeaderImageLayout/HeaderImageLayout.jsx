import { Menu, message } from 'antd';
import React from 'react';
import FormFilters from '../FormFilters/FormFilters';
import TitleSection from '../TitleSection/TitleSection';
import './_HeaderImageLayout.scss';

const HeaderImageLayout = (props) => {
  const onClickFiltersPrice = ({ key }) => {
    message.info(`Click on item price  ${key}`);
  };
  const menuPrice = (
    <Menu onClick={onClickFiltersPrice}>
      <Menu.Item key="1">All</Menu.Item>
      <Menu.Item key="2">LOWEST PRICE</Menu.Item>
      <Menu.Item key="3">HIGHEST PRICE</Menu.Item>
    </Menu>
  );

  const onClickFiltersName = ({ key }) => {
    message.info(`Click on item name ${key}`);
  };
  const menuName = (
    <Menu onClick={onClickFiltersName}>
      <Menu.Item key="1">All</Menu.Item>
      <Menu.Item key="2">DESC</Menu.Item>
      <Menu.Item key="3">ASC</Menu.Item>
    </Menu>
  );
  return (
    <div>
      <div
        className="HeaderImageLayout"
        style={{
          background: `url(${
            props.src ||
            'https://res.cloudinary.com/dulich/image/upload/v1619107721/travel/parallax-search-2_bz6h39.jpg'
          })  no-repeat center center`,
        }}
      >
        {/* props.hideFilter === true ( ẩn search ).
         !props.hideFilter check những màn có chức năng search    */}
        {!props.hideFilter ? (
          <div className="HeaderImageLayout__content">
            <div className="HeaderImageLayout__title">
              {/* <h3 className="HeaderImageLayout__title--sub">
                {props._namePage || 'CÁC GÓI CỦA CHÚNG TÔI'}
              </h3> */}
              <TitleSection
                color="#fff"
                fontWeight="700"
                fontSize="3.4rem"
                colorUnderline="#e27557"
                hideSuggest={true}
                title=""
                title_ul={props.title_ul}
              />
            </div>
            <div>
              <div className="FormFilters__top">
                <FormFilters />
              </div>
              {/* <div className="HeaderImageLayout__filters-wrap">
                <Dropdown overlay={menuPrice}>
                  <Link
                    to=""
                    className="ant-dropdown-link HeaderImageLayout__filters HeaderImageLayout__filtersPrice "
                    onClick={(e) => e.preventDefault()}
                  >
                    Price <DownOutlined />
                  </Link>
                </Dropdown>
                <Dropdown overlay={menuName}>
                  <Link
                    to=""
                    className="ant-dropdown-link  HeaderImageLayout__filters HeaderImageLayout__filtersName"
                    onClick={(e) => e.preventDefault()}
                  >
                    Name <DownOutlined />
                  </Link>
                </Dropdown>
              </div> */}
            </div>
          </div>
        ) : (
          <div className="HeaderImageLayout__content">
            <div className="HeaderImageLayout__title">
              <TitleSection
                color="#fff"
                fontWeight="700"
                fontSize="3.4rem"
                colorUnderline="#3399FF"
                hideSuggest={true}
                title_ul={props.title_ul}
                title=" "
              />
            </div>
          </div>
        )}
      </div>
      {/* screen >= lg - none  */}
      {!props.hideFilter && (
        <div className="FormFilters__bottom">
          <FormFilters />
        </div>
      )}
      {/* end- screen lg   */}
      <style jsx="true">
        {`
          .FormFilters__top {
            padding: 4rem 0;
          }
          .FormFilters__bottom {
            display: none;
          }
          @media screen and (max-width: 991.98px) {
            .FormFilters__top {
              display: none;
            }
            .FormFilters__bottom {
              display: block;
            }
          }
        `}
      </style>
    </div>
  );
};

export default HeaderImageLayout;
