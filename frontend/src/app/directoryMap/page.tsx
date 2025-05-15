"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

import { getPublicDirectory } from "@/api/directory";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

/*
const mockCounselors = [
  {
    id: 1,
    name: "Test1",
    clinic: {
      location: {
        address: "123 Main St, San Francisco, CA",
      },
    },
  },
  {
    id: 2,
    name: "Test2",
    clinic: {
      location: {
        address: "456 Market St, San Francisco, CA",
      },
    },
  },
];
*/

const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  );
  const data = await response.json();
  const location = data.results[0]?.geometry?.location;
  return location || { lat: 0, lng: 0 };
};

export default function DirectoryMapPage() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [markers, setMarkers] = useState<{ lat: number; lng: number; name: string }[]>([]);

  // Inside useEffect:
  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const counselors = await getPublicDirectory();
        const results = await Promise.all(
          counselors.map(async (c) => {
            const loc = await geocodeAddress(c.address);
            return { ...loc, name: c.name };
          }),
        );
        setMarkers(results);
      } catch (err) {
        console.error("Failed to fetch counselors:", err);
      }
    };
    loadMarkers();
  }, []);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      {markers.map((marker, index) => (
        <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} label={marker.name} />
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
}
