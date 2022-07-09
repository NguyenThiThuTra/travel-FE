import React, { useEffect } from 'react';
import CarouselCpn from '../../components/Home/Carousel/Carousel';
// import Products from '../../components/HomePageComponents/Products';
// import Promotions from '../../components/Home/Promotions/Promotions';
import './_Home.scss';
const HomePage = () => {
  return (
    <div className="HomePage">
      <CarouselCpn />
      <div className="container">
        {/* <Banner /> */}
        {/* <Promotions /> */}
        {/* <Products /> */}
      </div>
    </div>
  );
};

export default HomePage;
