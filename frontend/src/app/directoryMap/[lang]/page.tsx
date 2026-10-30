"use client";

import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { Counselor } from "@/api/directory";
import type { APIResult } from "@/api/requests";

import { getPublicDirectory } from "@/api/directory";
import { LoadingIndicator } from "@/components";
import { Tabs } from "@/components/Tabs";
import env from "@/util/validateEnv";
import "@/app/globals.css";

type GeoLocation = { lat: number; lng: number };
type CounselorMarker = { location: GeoLocation; counselors: Counselor[] };

type GeocodeApiResponse = {
  results: { geometry?: { location: GeoLocation } }[];
};

const MAP_CONTAINER = { width: "100%", height: "100%" } as const;
const SIDEBAR_STYLE =
  "w-full md:w-[30vw] h-[30vh] md:h-full flex flex-col min-h-0 border-t md:border-t-0 md:border-l";
const LEFT_SIDEBAR_STYLE =
  "w-full md:w-[15vw] md:min-w-[160px] h-[25vh] md:h-full overflow-y-auto p-4 border-b md:border-b-0 md:border-r bg-gray-50";
const CENTER: GeoLocation = { lat: 23, lng: -90 }; // Gulf of Mexico
const ZOOM = 3;

const geocodeAddress = async (address: string): Promise<GeoLocation | null> => {
  if (!address.trim()) return null;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address,
    )}&key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  );

  if (!res.ok) return null;
  const data = (await res.json()) as GeocodeApiResponse;
  const location = data.results?.[0]?.geometry?.location;
  return location && Number.isFinite(location.lat) && Number.isFinite(location.lng)
    ? location
    : null;
};

// Professional title display map - now using translation keys
const professionalTitleMap: Record<string, string> = {
  medical_geneticist: "medical-geneticist",
  genetic_counselor: "genetic-counselor-title",
  student: "student-title",
  other: "other",
};

// Available languages and specializations for filtering - using translation keys
const AVAILABLE_LANGUAGES = ["english", "spanish", "portuguese"];

// Service keys matching backend enum values
const AVAILABLE_SPECIALIZATIONS = [
  "pediatrics",
  "cardiovascular",
  "neurogenetics",
  "rareDiseases",
  "cancer",
  "biochemicalMetabolic",
  "prenatal",
  "adult",
  "psychiatric",
  "reproductive",
  "ophthalmic",
  "research",
  "pharmacogenomics",
  "other",
];

export default function DirectoryMapPage() {
  const { t } = useTranslation();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [markers, setMarkers] = useState<CounselorMarker[]>([]);
  const [unlocated, setUnlocated] = useState<Counselor[]>([]);
  const [showUnlocatedOnly, setShowUnlocatedOnly] = useState(false);
  const [selected, setSelected] = useState<CounselorMarker | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(true);

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
    setIsLoadingDirectory(true);
    setSelected(null);
    setError(null);
    const result: APIResult<Counselor[]> = await getPublicDirectory(
      searchQuery || undefined,
      selectedLanguages.length > 0 ? selectedLanguages : undefined,
      selectedSpecializations.length > 0 ? selectedSpecializations : undefined,
    );

    if (!result.success) {
      setError(result.error);
      setIsLoadingDirectory(false);
      return;
    }

    try {
      const all = await Promise.all(
        result.data.map(
          async (c) => [await geocodeAddress(c.address).catch(() => null), c] as const,
        ),
      );
      // lat then long
      const allDeduplicated: Map<string, Counselor[]> = new Map<string, Counselor[]>();
      const missingLocations: Counselor[] = [];
      for (const [location, counselor] of all) {
        if (!location) {
          missingLocations.push(counselor);
          continue;
        }
        const key = JSON.stringify(location);
        const counselors = allDeduplicated.get(key) ?? [];
        counselors.push(counselor);
        allDeduplicated.set(key, counselors);
      }
      setUnlocated(missingLocations);
      setMarkers(
        allDeduplicated
          .entries()
          .map(([location, counselors]) => ({
            location: JSON.parse(location) as GeoLocation,
            counselors,
          }))
          .toArray(),
      );
    } catch (e) {
      setError(`Geocoding failed: ${(e as Error).message}`);
    } finally {
      setIsLoadingDirectory(false);
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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
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
          {isLoadingDirectory
            ? t("loading")
            : t("providers-found", {
                count:
                  markers.reduce((total, marker) => total + marker.counselors.length, 0) +
                  unlocated.length,
              })}
        </p>
      </aside>

      {/* Map */}
      <div className="flex-1 h-[45vh] md:h-full min-h-0">
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
              title={`${String(m.counselors.length)} counselors`}
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
                {selected.counselors.map((counselor, i) => (
                  <div key={i}>
                    {/* Header row: name + title - LARGER TEXT */}
                    <div className="flex items-start justify-between space-x-2">
                      <span className="text-lg font-semibold">
                        {counselor.name}
                        <span className="text-gray-500 font-normal text-base">
                          {" "}
                          ({formatTitle(counselor.title)})
                        </span>
                      </span>
                    </div>

                    {/* Details */}
                    <div className="mt-2 space-y-1 text-sm">
                      <p>📍 {counselor.address}</p>
                      <p>🏢 {counselor.organization}</p>
                      {counselor.profileUrl && (
                        <p>
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
                      <p>🌐 {counselor.email}</p>
                      <p>☎️ {counselor.phone ?? "—"}</p>
                      <p>📚 {formatTranslatedList(counselor.specialties)}</p>
                      <p>🗣 {formatTranslatedList(counselor.languages)}</p>
                    </div>
                  </div>
                ))}
              </>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Right Sidebar */}
      <aside className={SIDEBAR_STYLE}>
        <div className="shrink-0 px-4 pt-4">
          <Tabs
            tabs={["all-counselors", "location-not-found"] as const}
            activeTab={showUnlocatedOnly ? "location-not-found" : "all-counselors"}
            onActiveTabChange={(tab) => {
              setShowUnlocatedOnly(tab === "location-not-found");
            }}
            labels={{
              "location-not-found": `${t("location-not-found")} (${isLoadingDirectory ? "…" : String(unlocated.length)})`,
            }}
          />
        </div>
        <div
          key={String(showUnlocatedOnly)}
          className="flex-1 min-h-0 overflow-y-auto p-4"
          aria-busy={isLoadingDirectory}
        >
          {isLoadingDirectory && <LoadingIndicator />}
          {!isLoadingDirectory && showUnlocatedOnly && unlocated.length === 0 && (
            <p className="text-sm text-gray-500">{t("no-unlocated-counselors")}</p>
          )}
          {!isLoadingDirectory &&
            [
              ...(showUnlocatedOnly ? [] : markers),
              ...(unlocated.length ? [{ counselors: unlocated, location: null }] : []),
            ].map(({ counselors, location }, i) => (
              <section key={i} aria-label={location ? undefined : t("location-not-found")}>
                {!location && <h2 className="font-bold text-lg mb-4">{t("location-not-found")}</h2>}
                {counselors.map((counselor, j) => (
                  <div
                    key={`${String(i)} ${String(j)}`}
                    className={`mb-4 space-y-1 p-2 rounded ${location ? "cursor-pointer hover:bg-gray-50" : ""}`}
                    onClick={() => {
                      if (!location) return;
                      setSelected({ counselors, location });
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
              </section>
            ))}
        </div>
      </aside>
    </div>
  );
}
