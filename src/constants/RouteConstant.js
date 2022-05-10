import NotFount from 'common/NotFount/NotFount';
import DestinationsPage from 'pages/Admin/Destinations/Destinations';
import CartPage from 'pages/Cart/CartPage';
import HomePage from 'pages/Home/HomePage';
import HomestayDetailPage from 'pages/HomestayDetail/HomestayDetailPage';
import HomestayPage from 'pages/Homestays/HomestayPage';
import LoginPage from 'pages/Login/LoginPage';
import RoomPage from 'pages/Room/RoomPage';
import Admin from 'pages/Admin/AdminPage';
import ProductsDetailsPage from 'pages/ProductsDetails/ProductDetailPage';
import HistoryPage from 'pages/History/HistoryPage';
import OrdersPage from 'components/Admin/Orders/Orders';
import OrderDetail from 'components/Admin/Orders/OrderDetail';
import ActionFormRoom from 'components/Admin/Rooms/ActionFormRoom';
import AdminHomestaysPage from 'components/Admin/Homestays/Homestays';
import ActionFormHomestay from 'components/Admin/Homestays/ActionFormHomestay';
import UsersPage from 'components/Admin/Users/Users';
import ActionFormUser from 'components/Admin/Users/ActionFormUser';
import TestPage from 'pages/Test/TestPage';
import AdminCategoryPage from 'components/Admin/Category/Category';
import PaymentPage from 'pages/Payment/PaymentPage';

export const RouteConstant = {
  TestPage: {
    path: '/test',
    component: <TestPage />,
  },
  NotFount: {
    path: '*',
    component: <NotFount />,
  },
  HomePage: {
    path: '/',
    component: <HomePage />,
  },
  CartPage: {
    path: '/cart',
    component: <CartPage />,
  },
  RoomPage: {
    path: '/rooms',
    component: <RoomPage />,
  },
  RoomDetailPage: {
    path: '/products/:id',
    component: <ProductsDetailsPage />,
  },
  DestinationPage: {
    path: '/destinations',
    component: <DestinationsPage />,
  },
  HomestayPage: {
    path: '/homestays',
    component: <HomestayPage />,
  },
  HomestayDetailPage: {
    path: '/homestays/:id',
    component: <HomestayDetailPage />,
  },
  LoginPage: {
    path: '/login',
    component: <LoginPage />,
  },
  // admin
  HistoryPage: {
    path: '/history',
    component: <HistoryPage />,
  },
  MyHomestay: {
    path: '/my-homestay',
    component: <Admin />,
  },
  AdminPage: {
    path: '/admin',
    component: <Admin />,
  },
  AdminOrders: {
    path: '/admin/orders',
    component: <OrdersPage />,
  },
  AdminOrderDetail: {
    path: '/admin/orders/:id',
    component: <OrderDetail />,
  },
  AdminActionFormRoomDetail: {
    path: '/admin/rooms/:action/:id',
    component: <ActionFormRoom />,
  },
  AdminRoom: {
    path: '/admin/rooms',
  },
  AdminActionFormRoom: {
    path: '/admin/rooms/:action',
    component: <ActionFormRoom />,
  },
  AdminHomestay: {
    path: '/admin/homestays',
    component: <AdminHomestaysPage />,
  },
  AdminActionFormHomestay: {
    path: '/admin/homestays/:action',
    component: <ActionFormHomestay />,
  },
  AdminActionFormHomestayDetail: {
    path: '/admin/homestays/:action/:id',
    component: <ActionFormHomestay />,
  },
  AdminUser: {
    path: '/admin/users',
    component: <UsersPage />,
  },
  AdminActionFormUser: {
    path: '/admin/users/:action',
    component: <ActionFormUser />,
  },
  AdminActionFormUserDetail: {
    path: '/admin/users/:action/:id',
    component: <ActionFormUser />,
  },
  AdminCategoryPage: {
    path: '/admin/category',
    component: <AdminCategoryPage />,
  },
  PaymentPage: {
    path: '/payment',
    component: <PaymentPage />,
  },
};
