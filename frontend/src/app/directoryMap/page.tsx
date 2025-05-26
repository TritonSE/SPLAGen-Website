"use client";

import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

import type { Counselor } from "@/api/directory";
import type { APIResult } from "@/api/requests";

import { getPublicDirectory } from "@/api/directory";
import env from "@/util/validateEnv";

type GeoLocation = { lat: number; lng: number };
type CounselorMarker = { location: GeoLocation; counselor: Counselor };

type GeocodeApiResponse = {
  results: { geometry?: { location: GeoLocation } }[];
};

const MAP_CONTAINER = { width: "70vw", height: "100vh" } as const;
const SIDEBAR_STYLE = "w-[30vw] h-screen overflow-y-auto p-4 border-l";
const CENTER: GeoLocation = { lat: 23, lng: -90 }; // Gulf of Mexico
const ZOOM = 3;

const geocodeAddress = async (address: string): Promise<GeoLocation> => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address,
    )}&key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  );

  const data = (await res.json()) as GeocodeApiResponse;
  return data.results?.[0]?.geometry?.location ?? { lat: 0, lng: 0 };
};

const formatSpecialties = (specs: string[]) => (specs.length ? specs.join(", ") : "—");

export default function DirectoryMapPage() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [markers, setMarkers] = useState<CounselorMarker[]>([]);
  const [selected, setSelected] = useState<CounselorMarker | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const result: APIResult<Counselor[]> = await getPublicDirectory();
      if (!result.success) {
        setError(result.error);
        return;
      }

      try {
        const all = await Promise.all(
          result.data.map(async (c) => ({
            location: await geocodeAddress(c.address),
            counselor: c,
          })),
        );
        setMarkers(all);
      } catch (e) {
        setError(`Geocoding failed: ${(e as Error).message}`);
      }
    })();
  }, []);

  if (!isLoaded) return <p className="p-4">Loading map…</p>;
  if (error) return <p className="text-red-600 p-4">Error: {error}</p>;

  return (
    <div className="flex">
      {/* Map */}
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER}
        center={CENTER}
        zoom={ZOOM}
        onClick={() => {
          setSelected(null);
        }}
      >
        {markers.map((m, i) => (
          <Marker
            key={i}
            position={m.location}
            title={m.counselor.name}
            onClick={() => {
              setSelected(m);
            }}
          />
        ))}

        {selected && (
          <InfoWindow
            position={selected.location}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div className="space-y-1">
              <h2 className="font-semibold">
                {selected.counselor.name}{" "}
                <span className="text-gray-500">({selected.counselor.title})</span>
              </h2>

              <p>📍 {selected.counselor.address}</p>
              <p>🏢 {selected.counselor.organization}</p>
              <p>🌐 {selected.counselor.email}</p>
              <p>☎️ {selected.counselor.phone ?? "—"}</p>
              <p>📚 {formatSpecialties(selected.counselor.specialties)}</p>
              <p>🗣 {selected.counselor.languages.join(", ")}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Sidebar */}
      <aside className={SIDEBAR_STYLE}>
        {markers.map(({ counselor, location }, i) => (
          <div
            key={i}
            className="mb-4 cursor-pointer"
            onClick={() => {
              setSelected({ counselor, location });
              google.maps.event.trigger(window, "resize");
            }}
          >
            <h3 className="font-medium">{counselor.name}</h3>
            <p className="text-sm">📍 {counselor.address}</p>
            <p className="text-sm">🏢 {counselor.organization}</p>
            <p className="text-sm">📚 {formatSpecialties(counselor.specialties)}</p>
            <hr className="my-2" />
          </div>
        ))}
      </aside>
    </div>
  );
}
