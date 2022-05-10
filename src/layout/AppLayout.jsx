import { BackTop } from 'antd';
import Header from 'common/Header/Header';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUpOutlined } from '@ant-design/icons';
import Footer from 'common/Footer/Footer';
import { flagPathname } from 'utils/flagPathname';
import {
  HIDDEN_FOOTER,
  HIDDEN_FOOTER_INFO,
  HIDDEN_HEADER,
  HIDDEN_NEWSLETTER,
} from 'constants/pathnameSpecial';

export default function AppLayout({ children }) {
  let location = useLocation();
  return (
    <React.StrictMode>
      <div className="App">
      {!flagPathname(HIDDEN_HEADER, location.pathname) && (
          <Header />
        )}
       
        {/* LIST_ROUTE    */}
        {children}
        {/*End LIST_ROUTE    */}
        {!flagPathname(HIDDEN_FOOTER, location.pathname) && (
          <Footer
            showNewsletter={!flagPathname(HIDDEN_NEWSLETTER, location.pathname)}
            showFooterInfo={
              !flagPathname(HIDDEN_FOOTER_INFO, location.pathname)
            }
          />
        )}

        <BackTop>
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
              bottom: '100px',
              position: 'absolute',
            }}
          >
            <ArrowUpOutlined />
          </div>
        </BackTop>
      </div>
    </React.StrictMode>
  );
}
