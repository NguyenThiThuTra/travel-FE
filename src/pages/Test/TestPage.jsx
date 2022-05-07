import React from 'react';
import { MapCustom } from './MapCustom';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const mapCenter = {
  lat: 20.869806,
  lng: 105.8967356,
};

export default function TestPage() {
  const refInput = React.useRef(null);
  const [value, setValue] = React.useState('');
  const provider = new OpenStreetMapProvider();
  const handleSearch = async () => {
    const results = await provider.search({ query: value });
  };
  return (
    <div>
      <h1 onClick={()=>handleSearch()}>Google map integration</h1>
      <div style={{ margin: '20px' }}>
        SEARCH THONG TIN
        <input onChange={(e) => setValue(e.target.value)} />
      </div>
      <MapCustom />
    </div>
  );
}
