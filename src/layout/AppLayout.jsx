import { ArrowUpOutlined } from '@ant-design/icons';
import { BackTop } from 'antd';
import Header from 'common/Header/Header';
import PopupChat from 'common/PopupChat/PopupChat';
import { HIDDEN_HEADER } from 'constants/pathnameSpecial';
import {
  getCurrentUser,
  useCurrentUserSelector,
} from 'features/Auth/AuthSlice';
import {
  setOpenPopupChatBox,
  setReceiver,
  toggleOpenPopupChatBox,
} from 'features/ChatBox/ChatBoxSlice';
import { useLoadingAppSelector } from 'features/commonSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { flagPathname } from 'utils/flagPathname';

export default function AppLayout({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const loadingApp = useSelector(useLoadingAppSelector);
  const currentUser = useSelector(useCurrentUserSelector);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [isLoggedIn]);

  const [detectOwnerHomestay] = useState(['/my-homestay', 'admin']);
  const isOwnerHomestay = detectOwnerHomestay.some((path) =>
    location.pathname.includes(path)
  );

  useEffect(() => {
    dispatch(setOpenPopupChatBox(false));
    dispatch(setReceiver(null));
  }, [isOwnerHomestay]);

  return (
    <React.StrictMode>
      <div className="App">
        {!flagPathname(HIDDEN_HEADER, location.pathname) && <Header />}

        {/* LIST_ROUTE    */}
        {children}
        {/*End LIST_ROUTE    */}
        {/* {!flagPathname(HIDDEN_FOOTER, location.pathname) && (
            <Footer
              showNewsletter={
                !flagPathname(HIDDEN_NEWSLETTER, location.pathname)
              }
              showFooterInfo={
                !flagPathname(HIDDEN_FOOTER_INFO, location.pathname)
              }
            />
          )} */}

        {/* popup chat admin */}
        {!isOwnerHomestay && currentUser && <PopupChat />}

        <BackTop style={{ bottom: '100px' }}>
          <div
            style={{
              height: 40,
              width: 40,
              lineHeight: '40px',
              borderRadius: 4,
              backgroundColor: '#23232c',
              color: '#fff',
              textAlign: 'center',
              fontSize: 14,
            }}
          >
            <ArrowUpOutlined />
          </div>
        </BackTop>
      </div>
    </React.StrictMode>
  );
}
