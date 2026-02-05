"use client";

import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useCallback, useEffect, useState } from "react";

import type { Counselor } from "@/api/directory";
import type { APIResult } from "@/api/requests";

import { getPublicDirectory } from "@/api/directory";
import env from "@/util/validateEnv";

type GeoLocation = { lat: number; lng: number };
type CounselorMarker = { location: GeoLocation; counselor: Counselor };

type GeocodeApiResponse = {
  results: { geometry?: { location: GeoLocation } }[];
};

const MAP_CONTAINER = { width: "55vw", height: "100vh" } as const;
const SIDEBAR_STYLE = "w-[30vw] h-screen overflow-y-auto p-4 border-l";
const LEFT_SIDEBAR_STYLE = "w-[15vw] h-screen overflow-y-auto p-4 border-r bg-gray-50";
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

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const formatList = (arr: string[]) =>
  arr.length ? Array.from(new Set(arr)).map(capitalize).join(", ") : "—";

// Professional title display map
const professionalTitleMap: Record<string, string> = {
  medical_geneticist: "Medical Geneticist",
  genetic_counselor: "Genetic Counselor",
  student: "Student",
  other: "Other",
};

const formatTitle = (title: string): string => {
  return professionalTitleMap[title] || capitalize(title);
};

// Available languages and specializations for filtering
const AVAILABLE_LANGUAGES = ["English", "Spanish", "Portuguese", "Other"];
const AVAILABLE_SPECIALIZATIONS = [
  "Pediatrics",
  "Cardiovascular",
  "Neurogenetics",
  "Rare Diseases",
  "Cancer",
  "Biochemical",
  "Prenatal",
  "Adult",
  "Psychiatric",
  "Reproductive",
  "Ophthalmic",
  "Research",
  "Pharmacogenomics",
  "Metabolic",
  "Other",
];

export default function DirectoryMapPage() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [markers, setMarkers] = useState<CounselorMarker[]>([]);
  const [selected, setSelected] = useState<CounselorMarker | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  const loadDirectory = useCallback(async () => {
    const result: APIResult<Counselor[]> = await getPublicDirectory(
      searchQuery || undefined,
      selectedLanguages.length > 0 ? selectedLanguages.map((l) => l.toLowerCase()) : undefined,
      selectedSpecializations.length > 0
        ? selectedSpecializations.map((s) => {
            // Map display names back to backend values
            const serviceMap: Record<string, string> = {
              "Rare Diseases": "rareDiseases",
            };
            const lowerCase = s.toLowerCase();
            return serviceMap[s] || lowerCase.replace(/\s+/g, "");
          })
        : undefined,
    );

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
  }, [searchQuery, selectedLanguages, selectedSpecializations]);

  useEffect(() => {
    void loadDirectory();
  }, [searchQuery, selectedLanguages, selectedSpecializations, loadDirectory]);

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language],
    );
  };

  const toggleSpecialization = (spec: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec],
    );
  };

  if (!isLoaded) return <p className="p-4">Loading map…</p>;
  if (error) return <p className="text-red-600 p-4">Error: {error}</p>;

  return (
    <div className="flex">
      {/* Left Sidebar - Search and Filters */}
      <aside className={LEFT_SIDEBAR_STYLE}>
        <h2 className="font-bold text-lg mb-4">Search & Filters</h2>

        {/* Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Search by Name</label>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        </div>

        {/* Language Filters */}
        <div className="mb-4">
          <h3 className="font-medium text-base mb-2">Languages</h3>
          {AVAILABLE_LANGUAGES.map((lang) => (
            <label key={lang} className="flex items-center text-base mb-2">
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang)}
                onChange={() => {
                  toggleLanguage(lang);
                }}
                className="mr-2 w-4 h-4"
              />
              {lang}
            </label>
          ))}
        </div>

        {/* Specialization Filters */}
        <div className="mb-4">
          <h3 className="font-medium text-base mb-2">Specializations</h3>
          <div className="max-h-100 overflow-y-auto">
            {AVAILABLE_SPECIALIZATIONS.map((spec) => (
              <label key={spec} className="flex items-center text-base mb-2">
                <input
                  type="checkbox"
                  checked={selectedSpecializations.includes(spec)}
                  onChange={() => {
                    toggleSpecialization(spec);
                  }}
                  className="mr-2 w-4 h-4"
                />
                {spec}
              </label>
            ))}
          </div>
        </div>

        <p className="text-base text-gray-500 mt-4">{markers.length} providers found</p>
      </aside>

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
            options={{ pixelOffset: new google.maps.Size(0, -30), disableAutoPan: false }}
          >
            <>
              {/* Header row: name + title - LARGER TEXT */}
              <div className="flex items-start justify-between space-x-2">
                <span className="text-lg font-semibold">
                  {selected.counselor.name}
                  <span className="text-gray-500 font-normal text-base">
                    {" "}
                    ({formatTitle(selected.counselor.title)})
                  </span>
                </span>
              </div>

              {/* Details */}
              <div className="mt-2 space-y-1 text-sm">
                <p>📍 {selected.counselor.address}</p>
                <p>🏢 {selected.counselor.organization}</p>
                {selected.counselor.profileUrl && (
                  <p>
                    🔗{" "}
                    <a
                      href={selected.counselor.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-600 break-all"
                    >
                      {selected.counselor.profileUrl}
                    </a>
                  </p>
                )}
                <p>🌐 {selected.counselor.email}</p>
                <p>☎️ {selected.counselor.phone ?? "—"}</p>
                <p>📚 {formatList(selected.counselor.specialties)}</p>
                <p>🗣 {formatList(selected.counselor.languages)}</p>
              </div>
            </>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Right Sidebar */}
      <aside className={SIDEBAR_STYLE}>
        {markers.map(({ counselor, location }, i) => (
          <div
            key={i}
            className="mb-4 cursor-pointer space-y-1 hover:bg-gray-50 p-2 rounded"
            onClick={() => {
              setSelected({ counselor, location });
              google.maps.event.trigger(window, "resize");
            }}
          >
            <h3 className="font-medium">
              {counselor.name} ({formatTitle(counselor.title)})
            </h3>
            <p className="text-sm">📍 {counselor.address}</p>
            <p className="text-sm">🏢 {counselor.organization}</p>
            {counselor.profileUrl && (
              <p className="text-sm">
                🔗{" "}
                <a
                  href={counselor.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600 break-all"
                >
                  {counselor.profileUrl}
                </a>
              </p>
            )}
            <p className="text-sm">🌐 {counselor.email}</p>
            <p className="text-sm">☎️ {counselor.phone ?? "—"}</p>
            <p className="text-sm">📚 {formatList(counselor.specialties)}</p>
            <p className="text-sm">🗣 {formatList(counselor.languages)}</p>
            <hr className="my-2" />
          </div>
        ))}
      </aside>
    </div>
  );
}
