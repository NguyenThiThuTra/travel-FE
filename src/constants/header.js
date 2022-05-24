import { BiUser } from 'react-icons/bi';
import { RouteConstant } from './RouteConstant';
export const HEADER = {
  ListItemNavbar: [
    { id: 1, text: 'Trang chủ', route: RouteConstant.HomePage.path },
    { id: 2, text: 'Homestays', route: RouteConstant.HomestayPage.path },
    { id: 3, text: 'Review điểm đến', route: RouteConstant.ReviewsPage.path },
    // { id: 4, text: 'Hot', route: '/rooms' },
    // { id: 5, text: 'Tin tức', route: '/news' },
    // { id: 6, text: 'Liên hệ', route: '/contact' },
  ],
  ListItemIcon: [
    // { id: 1, text: 'Search', icon: BsSearch },
    { id: 2, text: 'User', icon: BiUser },
    // { id: 3, text: 'Favourite', icon: AiOutlineStar },
    // { id: 4, text: 'Cart', icon: BiShoppingBag },
  ],
};
