import NotFount from 'common/NotFount/NotFount';
import Admin from 'pages/Admin/AdminPage';
import HistoryPage from 'pages/History/HistoryPage';
import HomePage from 'pages/Home/HomePage';
import HomestayDetailPage from 'pages/HomestayDetail/HomestayDetailPage';
import HomestayPage from 'pages/Homestays/HomestayPage';
import LoginPage from 'pages/Login/LoginPage';
import PaymentPage from 'pages/Payment/PaymentPage';
import PaymentVnPayReturn from 'pages/PaymentVnPayReturn/PaymentVnPayReturn';
import ProductsDetailsPage from 'pages/ProductsDetails/ProductDetailPage';
import ReviewDetailPage from 'pages/ReviewDetail/ReviewDetailPage';
import ReviewsPage from 'pages/Reviews/ReviewsPage';
import RoomPage from 'pages/Room/RoomPage';
import TestPage from 'pages/Test/TestPage';

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
    {
      id: 9997,
      path: '/payment/vnpay_return',
      component: <PaymentVnPayReturn />,
    },
    { id: 9998, path: '/payment', component: <PaymentPage /> },
    {
      id: 11,
      path: '/reviews/:id',
      component: <ReviewDetailPage />,
    },
    {
      id: 10,
      path: '/reviews',
      component: <ReviewsPage />,
    },
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
      id: 4,
      path: '/products/:id',
      component: <ProductsDetailsPage />,
    },
    { id: 3, path: '/rooms', component: <RoomPage /> },
    { id: 1, path: '/', component: <HomePage /> },
    { id: 0, path: '*', component: <NotFount /> },
  ],
};
