"use client";

import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

// Professional title display map - now using translation keys
const professionalTitleMap: Record<string, string> = {
  medical_geneticist: "medical-geneticist",
  genetic_counselor: "genetic-counselor-title",
  student: "student-title",
  other: "other",
};

// Available languages and specializations for filtering - using translation keys
const AVAILABLE_LANGUAGES = ["english", "spanish", "portuguese", "other"];

// Service keys matching backend enum values
const AVAILABLE_SPECIALIZATIONS = [
  "pediatrics",
  "cardiovascular",
  "neurogenetics",
  "rareDiseases",
  "cancer",
  "biochemical",
  "prenatal",
  "adult",
  "psychiatric",
  "reproductive",
  "ophthalmic",
  "research",
  "pharmacogenomics",
  "metabolic",
  "other",
];

export default function DirectoryMapPage() {
  const { t } = useTranslation();
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

  // Helper functions for translation
  const formatTitle = (title: string): string => {
    return t(professionalTitleMap[title] || "other");
  };

  const formatTranslatedList = (arr: string[]): string => {
    if (!arr.length) return "—";
    return Array.from(new Set(arr))
      .map((item) => t(item.toLowerCase()))
      .join(", ");
  };

  const loadDirectory = useCallback(async () => {
    const result: APIResult<Counselor[]> = await getPublicDirectory(
      searchQuery || undefined,
      selectedLanguages.length > 0 ? selectedLanguages : undefined,
      selectedSpecializations.length > 0 ? selectedSpecializations : undefined,
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

  if (!isLoaded) return <p className="p-4">{t("loading-map")}</p>;
  if (error)
    return (
      <p className="text-red-600 p-4">
        {t("error")}: {error}
      </p>
    );

  return (
    <div className="flex">
      {/* Left Sidebar - Search and Filters */}
      <aside className={LEFT_SIDEBAR_STYLE}>
        <h2 className="font-bold text-lg mb-4">{t("search-and-filters")}</h2>

        {/* Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t("search-by-name")}</label>
          <input
            type="text"
            placeholder={t("search-placeholder")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        </div>

        {/* Language Filters */}
        <div className="mb-4">
          <h3 className="font-medium text-base mb-2">{t("languages")}</h3>
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
              {t(lang)}
            </label>
          ))}
        </div>

        {/* Specialization Filters */}
        <div className="mb-4">
          <h3 className="font-medium text-base mb-2">{t("specializations")}</h3>
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
                {t(spec)}
              </label>
            ))}
          </div>
        </div>

        <p className="text-base text-gray-500 mt-4">
          {t("providers-found", { count: markers.length })}
        </p>
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
                <p>📚 {formatTranslatedList(selected.counselor.specialties)}</p>
                <p>🗣 {formatTranslatedList(selected.counselor.languages)}</p>
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
            <p className="text-sm">📚 {formatTranslatedList(counselor.specialties)}</p>
            <p className="text-sm">🗣 {formatTranslatedList(counselor.languages)}</p>
            <hr className="my-2" />
          </div>
        ))}
      </aside>
    </div>
  );
}
