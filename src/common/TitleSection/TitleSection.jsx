import React from 'react';
import './_TitleSection.scss';
const TitleSection = ({
  title,
  title_ul,
  suggest,
  hideSuggest,
  colorUnderline,
  color,
  fontWeight,
  fontSize,
  colorSuggest,
}) => {
  return (
    <div className="titleSection">
      <h1
        style={{
          color: `${color || '#5e6d81'}`,
          fontWeight: `${fontWeight || 'normal'}`,
          fontSize: `${fontSize || '3.6rem'}`,
        }}
        className="h1"
      >
        {title} <span>{title_ul || 'DESTINATIONS'}</span>
      </h1>
      <h3
        style={{
          display: `${hideSuggest && 'none'}`,
          color: `${colorSuggest || 'a4a4a4'}`,
        }}
        className="h3"
      >
        {suggest || 'CHOOSE YOUR NEXT DESTINATION'}
      </h3>
      <style jsx="true">
        {`
          .titleSection .h1 span::after {
            background-color: ${colorUnderline || '#1bbc9b'} !important;
          }
        `}
      </style>
    </div>
  );
};

export default TitleSection;
