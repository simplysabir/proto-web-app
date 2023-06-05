import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_MAPBOX_ACCESS_TOKEN;

export default function HistoricalCheckIns() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(77.5946);
  const [lat, setLat] = useState(12.9716);
  const [zoom, setZoom] = useState(9);
  const [data, setData] = useState([]);
  const wallet = useWallet();
  // let baseUrl = 'https://proto-api.onrender.com'; //  /checkin/all
  //url: `${baseUrl}/checkins`,
  let baseUrl = 'http://ec2-44-198-54-124.compute-1.amazonaws.com:3000/v1';
  const API_KEY = '8d3c6697-0ba1-42d4-b5c7-6727c04adce7';

  useEffect(() => {
    async function fetchCheckins() {
      if (wallet.publicKey) {
        let response = await axios({
          url: `${baseUrl}/checkin/all`,
          params: {
            user_wallet_address: wallet.publicKey.toString(),
          },
          headers: { authorization: API_KEY },
        });
        setData(response.data);
      }
    }
    fetchCheckins();
  }, [wallet]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      projection: {
        name: 'mercator',
        center: [lng, lat],
        parallels: [30, 30],
      },
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
      minZoom: 1,
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    // Add the control to the map.
    map.current.addControl(geolocate);
    map.current.on('load', () => {
      geolocate.trigger();
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
    console.log(data);
    const marker1 = data.map((d) => {
      new mapboxgl.Marker()
        .setLngLat([d.longitude, d.latitude])
        .setPopup(
          new mapboxgl.Popup()
            .setLngLat([d.longitude, d.latitude])
            .setText(d.message)
        )
        .addTo(map.current);
    });
  }, [data]);

  return (
    <div>
      <div
        className="mapContain"
        style={{ width: `100%`, height: 'calc(100vh - 122px)' }}
      >
        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}
