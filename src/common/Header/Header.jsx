import { Col, Dropdown, Menu, Row, Tooltip } from 'antd';
import { resetAction } from 'app/store';
import { HEADER } from 'constants/header';
import { PERMISSIONS } from 'constants/permissions';
import { RouteConstant } from 'constants/RouteConstant';
import { logout } from 'features/Auth/AuthSlice';
import {
  toggleModalLogin,
  useVisibleModalLoginSelector,
} from 'features/commonSlice';
import { useDetectScroll } from 'hooks/useDetectScroll';
import React, { useState } from 'react';
import { HiOutlineMenu } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import NavbarItem from '../NavbarItem/NavbarItem';
import ModalLogin from './ModalLogin/ModalLogin';
import UserProfile from './UserProfile/UserProfile';
import './_Header.scss';

const Header = () => {
  let location = useLocation();
  let history = useHistory();
  let dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const loading = useSelector((state) => state.auth.loading);
  const [isActiveMenuMobile, setIsActiveMenuMobile] = useState(false);
  const handleCloseMenuMobile = () => {
    setIsActiveMenuMobile(false);
  };
  const handleToggleMenuMobile = () => {
    setIsActiveMenuMobile(!isActiveMenuMobile);
  };

  //show info
  const [visibleUserProfile, setVisibleUserProfile] = useState(false);
  const showUserProfile = () => {
    setVisibleUserProfile(true);
  };
  const onCloseUserProfile = () => {
    setVisibleUserProfile(false);
  };
  const handleClickIcon = (id) => {
    if (id === 2) {
      showUserProfile();
    }
    if (id === 4) {
      history.push('/cart');
    }
  };

  //end show info
  //modal login
  const visibleModalLogin = useSelector(useVisibleModalLoginSelector);
  const handleToggleModalLogin = () => {
    dispatch(toggleModalLogin());
  };

  const handleLogout = async () => {
    try {
      dispatch(resetAction());
      dispatch(logout());
      history.push('/');
    } catch (e) {
      console.error(e);
    }
  };
  const menu = isLoggedIn ? (
    <Menu>
      <Menu.Item onClick={showUserProfile}>
        <div>Thông tin cá nhân</div>
      </Menu.Item>
      {currentUser?.data?.roles === PERMISSIONS.user && (
        <React.Fragment>
          <Menu.Item onClick={() => history.push('/history')}>
            <div>Lịch sử đặt phòng</div>
          </Menu.Item>
          <Menu.Item onClick={() => history.push('/my-homestay/homestays')}>
            <div>Homestay của tôi</div>
          </Menu.Item>
        </React.Fragment>
      )}
      <Menu.Item onClick={handleLogout}>
        <div>Đăng xuất</div>
      </Menu.Item>
    </Menu>
  ) : (
    <Menu>
      <Menu.Item onClick={handleToggleModalLogin}>
        <div>Đăng nhập / Đăng ký</div>
      </Menu.Item>
    </Menu>
  );
  //end modal
  //detect scroll
  const { scrollingUp, top, setTop } = useDetectScroll();
  //end detect scroll
  const handleActiveNavItem = (item) => {
    const path = item?.route;
    const id = item?.id;
    if (location.pathname === path) {
      return id;
    }
    const isActive =
      RouteConstant.HomePage.path !== path &&
      location.pathname.includes(path) &&
      id;
    if (isActive) {
      return id;
    } else {
      return false;
    }
  };
  return (
    <div
      className="header"
      // className={`header ${!scrollingUp ? 'none' : ''} ${!top ? 'top' : ''}`}
      style={{
        backgroundColor:
          // flagPathname(HEADER_BACKGROUND_DARK, location.pathname) &&
          isActiveMenuMobile ? 'rgb(11 47 78 / 100%)' : 'rgb(11 47 78 / 85%)',
        zIndex: isActiveMenuMobile ? 10000 : 99,
      }}
      onMouseEnter={() => setTop(false)}
      onMouseLeave={() => setTop(true)}
    >
      <Row style={{ flex: 1 }}>
        <Col xs={6} sm={6} md={6} lg={10} span={10}>
          <div onClick={handleToggleMenuMobile} className="toggle_menu">
            <HiOutlineMenu color="#fff" fontSize="2rem" />
          </div>
          {isActiveMenuMobile && (
            <div className="menu-mobile">
              <ul className="navbar-mobile">
                {HEADER.ListItemNavbar.map((item) => (
                  <li
                    key={item.id}
                    className="navbar__item"
                    onClick={handleCloseMenuMobile}
                  >
                    <NavbarItem
                      isActive={handleActiveNavItem(item)}
                      item={item}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="navbarMain">
            <ul className="navbar">
              {HEADER.ListItemNavbar.map((item) => (
                <li
                  key={item.id}
                  className="navbar__item"
                  onClick={handleCloseMenuMobile}
                >
                  <NavbarItem
                    isActive={handleActiveNavItem(item)}
                    item={item}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={4} span={4}>
          <div className="logo">
            {/* <img
              src={top ? LOGO.light : LOGO.dark}
              alt="logo"
              width={200}
              height={25}
            /> */}
          </div>
        </Col>
        <Col xs={6} sm={6} md={6} lg={10} span={10}>
          <ul className="navbar_icon">
            {HEADER.ListItemIcon.map((item) => (
              <li
                onClick={handleCloseMenuMobile}
                key={item.id}
                className="navbar_icon__item"
              >
                {item.id !== 2 ? (
                  <Tooltip key={item.id} placement="bottom" title={item.text}>
                    <item.icon
                      onClick={() => handleClickIcon(item.id)}
                      fontSize="2rem"
                    />
                  </Tooltip>
                ) : (
                  <Dropdown overlay={menu} placement="bottomRight" arrow>
                    <item.icon fontSize="2rem" />
                  </Dropdown>
                )}
              </li>
            ))}
            {visibleUserProfile && (
              <UserProfile
                loading={loading}
                onCloseUserProfile={onCloseUserProfile}
                visibleUserProfile={visibleUserProfile}
              />
            )}
            {visibleModalLogin && (
              <ModalLogin
                title="Title"
                visible={visibleModalLogin}
                hideModalLogin={handleToggleModalLogin}
              />
            )}
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default Header;
