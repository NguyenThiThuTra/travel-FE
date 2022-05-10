import React from 'react';
import './_Footer.scss';
import Newsletter from './Newsletter/Newsletter';
import FooterInfo from './FooterInfo/FooterInfo';
const Footer = ({ showNewsletter = true, showFooterInfo = true }) => {
  return (
    <div className="footer">
      {showNewsletter && <Newsletter />}
      {showFooterInfo && <FooterInfo />}
    </div>
  );
};

export default Footer;
