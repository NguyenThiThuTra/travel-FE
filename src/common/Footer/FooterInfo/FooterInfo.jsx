import { FOOTER } from 'constants/footer';
import React from 'react';
import './_FooterInfo.scss';

const FooterInfo = () => {
  return (
    <div className="footer_info">
      {/* <div className="footer_menu">
        {ListItemMenu.map((item) => (
          <div key={item.id} className="footer_menu__item">
            {item.text}
          </div>
        ))}
      </div> */}
      <div className="social_icons">
        {FOOTER.ListSocialIcon.map((item) => (
          <div key={item.id} className="social_icons__icon">
            <a href={item.route} target="_blank" rel="noopener noreferrer">
              <item.icon
                style={{
                  backgroundColor: item.bg,
                  color: '#fff',
                  padding: '1.2rem',
                  borderRadius: '.5rem',
                }}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterInfo;
