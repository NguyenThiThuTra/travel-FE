import { Col, Row } from 'antd';
import { PrivateRoute } from 'common/PrivateRoute';
import { AdminMenu } from 'components/Admin/AdminMenu';
import AdminCategoryPage from 'components/Admin/Category/Category';
import ActionFormHomestay from 'components/Admin/Homestays/ActionFormHomestay';
import HomestaysPage from 'components/Admin/Homestays/Homestays';
import OrderDetail from 'components/Admin/Orders/OrderDetail';
import OrdersPage from 'components/Admin/Orders/Orders';
import ActionFormRoom from 'components/Admin/Rooms/ActionFormRoom';
import RoomsPage from 'components/Admin/Rooms/Rooms';
import ActionFormUser from 'components/Admin/Users/ActionFormUser';
import UsersPage from 'components/Admin/Users/Users';
import { Switch, useRouteMatch } from 'react-router-dom';
export const MENU_ADMIN_ROUTES = [
  { id: 1, element: <UsersPage />, path: 'users' },
  { id: 2, element: <ActionFormUser />, path: 'users/:action' },
  { id: 3, element: <ActionFormUser />, path: 'users/:action/:id' },
  { id: 4, element: <HomestaysPage />, path: 'homestays' },
  { id: 4, element: <ActionFormHomestay />, path: 'homestays/:action' },
  { id: 5, element: <ActionFormHomestay />, path: 'homestays/:action/:id' },
  { id: 12, element: <RoomsPage />, path: 'rooms' },
  { id: 13, element: <ActionFormRoom />, path: 'rooms/:action' },
  {
    id: 14,
    element: <ActionFormRoom />,
    path: 'rooms/:action/:id',
  },
  // orders
  { id: 15, element: <OrdersPage />, path: 'orders' },
  { id: 16, element: <OrderDetail />, path: 'orders/:id' },
  // category
  { id: 17, element: <AdminCategoryPage />, path: 'category' },
  { id: 18, element: <ActionFormRoom />, path: 'category/:action' },
  {
    id: 19,
    element: <ActionFormRoom />,
    path: 'category/:action/:id',
  },
  {
    id: 20,
    element: <RoomsPage />,
    path: 'category/detail/:id/rooms',
  },
];
export default function AdminPage() {
  let match = useRouteMatch();
  return (
    <div style={{ paddingTop: '8rem' }}>
      <Row>
        <Col>
          <AdminMenu />
        </Col>
        <Col flex="auto" style={{ position: 'relative' }}>
          <div
            style={{ padding: '1.5rem', position: 'absolute', width: '100%' }}
          >
            <Switch>
              {MENU_ADMIN_ROUTES?.map((route) => (
                <PrivateRoute
                  key={route.id}
                  exact
                  path={`${match.url}/${route.path}`}
                >
                  {route.element}
                </PrivateRoute>
              ))}
            </Switch>
          </div>
        </Col>
      </Row>
    </div>
  );
}
