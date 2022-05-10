import NotFount from 'common/NotFount/NotFount';
import Admin from 'pages/Admin/AdminPage';
import CartPage from 'pages/Cart/CartPage';
import DestinationsPage from 'pages/Destinations/DestinationPage';
import DestinationsDetailsPage from 'pages/DestinationsDetail/DestinationDetailPage';
import HistoryPage from 'pages/History/HistoryPage';
import HomePage from 'pages/Home/HomePage';
import LoginPage from 'pages/Login/LoginPage';
import HomestayPage from 'pages/Homestays/HomestayPage';
import HomestayDetailPage from 'pages/HomestayDetail/HomestayDetailPage';
import RoomPage from 'pages/Room/RoomPage';
import ProductsDetailsPage from 'pages/ProductsDetails/ProductDetailPage';
import TestPage from 'pages/Test/TestPage';
import PaymentPage from 'pages/Payment/PaymentPage';
import PaymentVnPayReturn from 'pages/PaymentVnPayReturn/PaymentVnPayReturn';

export const appRoutes = {
  ADMIN_ROUTES: [{ id: 0, path: '/admin', component: <Admin /> }],
  PRIVATE_ROUTES: [
    {
      id: 1,
      path: '/history',
      component: <HistoryPage />,
    },
    {
      id: 0,
      path: '/my-homestay',
      component: <Admin />,
    },
  ],
  PUBLIC_ROUTES: [
    { id: 9999, path: '/test', component: <TestPage /> },
    { id: 9998, path: '/payment', component: <PaymentPage /> },
    { id: 9997, path: '/VnPayReturn', component: <PaymentVnPayReturn /> },
    {
      id: 9,
      path: '/login',
      component: <LoginPage />,
    },
    {
      id: 8,
      path: '/homestays/:id',
      component: <HomestayDetailPage />,
    },
    { id: 7, path: '/homestays', component: <HomestayPage /> },
    {
      id: 6,
      path: '/destinations/:id',
      component: <DestinationsDetailsPage />,
    },
    {
      id: 5,
      path: '/destinations',
      component: <DestinationsPage />,
    },
    {
      id: 4,
      path: '/products/:id',
      component: <ProductsDetailsPage />,
    },
    { id: 3, path: '/rooms', component: <RoomPage /> },
    { id: 2, path: '/cart', component: <CartPage /> },
    { id: 1, path: '/', component: <HomePage /> },
    { id: 0, path: '*', component: <NotFount /> },
  ],
};
