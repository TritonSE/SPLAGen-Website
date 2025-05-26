"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

import type { Counselor } from "@/api/directory";
import type { APIResult } from "@/api/requests";

import { getPublicDirectory } from "@/api/directory";
import env from "@/util/validateEnv";

type MarkerData = { lat: number; lng: number; name: string };
type GeoLocation = { lat: number; lng: number };

type GeocodeApiResponse = {
  results: {
    geometry?: { location: GeoLocation };
  }[];
  status: string;
};

const containerStyle = { width: "100%", height: "100vh" } as const;
const center = { lat: 23.0, lng: -90.0 } as const;
const worldHemisphereZoom = 3;

const geocodeAddress = async (address: string): Promise<GeoLocation> => {
  const resp = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address,
    )}&key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  );
  const data: GeocodeApiResponse = (await resp.json()) as GeocodeApiResponse;
  const loc = data.results?.[0]?.geometry?.location;
  return loc ?? { lat: 0, lng: 0 };
};

export default function DirectoryMapPage() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarkers = async () => {
      const result: APIResult<Counselor[]> = await getPublicDirectory();

      if (!result.success) {
        setError(result.error);
        return;
      }
      try {
        const geocoded = await Promise.all(
          result.data.map(async (c) => {
            const loc = await geocodeAddress(c.address);
            return { ...loc, name: c.name } as MarkerData;
          }),
        );
        setMarkers(geocoded);
      } catch (e) {
        setError(`Geocoding failed: ${(e as Error).message}`);
      }
    };

    void loadMarkers();
  }, []);

  if (error) {
    return <p className="text-red-600 p-4">Error loading map: {error}</p>;
  }

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={worldHemisphereZoom}>
      {markers.map((m, i) => (
        <Marker key={i} position={{ lat: m.lat, lng: m.lng }} label={m.name} />
      ))}
    </GoogleMap>
  ) : (
    <p className="p-4">Loading map…</p>
  );
}
