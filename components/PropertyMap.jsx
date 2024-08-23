"use client";

import { geocode } from "@/utils/osm";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
    height: "500px",
  });
  const [loading, setLoading] = useState(true);
  const [geoError, setGeoError] = useState(false);
  const position = [lat, lng];
  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await geocode(
          `${property.location.city}, ${property.location.state}`
        );

        if (res.length === 0) {
          setGeoError(true);
          return;
        }
        const { lat, lon } = res[0];
        setLat(lat);
        setLng(lon);
        setViewport((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
        }));
      } catch (error) {
        console.log(error);
        setGeoError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCoords();
  }, []);
  if (loading) return <Spinner />;
  if (geoError)
    return (
      <div className="text-xl">No Location data found</div>
    );

  return (
    !loading && (
      <MapContainer
        center={position}
        zoom={14}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            A pretty popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    )
  );
};
export default PropertyMap;
