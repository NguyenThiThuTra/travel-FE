import { AppstoreOutlined } from '@ant-design/icons';
import { Divider, Menu, Switch } from 'antd';
import React, { Fragment, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
const { SubMenu } = Menu;

export function AdminMenu() {
  const [mode, setMode] = React.useState('inline');
  const [theme, setTheme] = React.useState('light');

  const changeMode = (value) => {
    setMode(value ? 'vertical' : 'inline');
  };

  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light');
  };

  const match = useRouteMatch();
  const location = useLocation();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const ListMenuCategory = useMemo(() => {
    return [
      {
        path: 'homestays',
        name: 'Homestays',
      },
      // {
      //   path: 'rooms',
      //   name: 'Rooms',
      // },
      {
        path: 'orders',
        name: 'Booking',
      },
      {
        path: 'category',
        name: 'Rooms',
      },
    ];
  }, []);
  const defaultSelectedKeys = useMemo(() => {
    return ListMenuCategory?.find((item) =>
      location.pathname.includes(item.path)
    );
  }, [ListMenuCategory]);
  return (
    <Fragment>
      {/* <div style={{ padding: '1rem' }}>
        <Switch onChange={changeMode} /> Thay đổi chế dộ
      </div> */}
      <Divider type="vertical" />
      <div
        style={{
          padding: '0 1rem',
          position: 'relative',
          top: '-1rem',
          marginBottom: '1rem',
        }}
      >
        <Switch onChange={changeTheme} /> Thay đổi phong cách
      </div>

      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={[defaultSelectedKeys?.path || 'orders']}
        defaultOpenKeys={['sub1']}
        mode={mode}
        theme={theme}
      >
        <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Danh mục">
          {ListMenuCategory.map((item) => {
            return (
              <Menu.Item key={item.path}>
                <Link to={`${match.url}/${item.path}`}>{item.name}</Link>
              </Menu.Item>
            );
          })}
        </SubMenu>
      </Menu>
    </Fragment>
  );
}
