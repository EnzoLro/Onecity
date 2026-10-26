"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Map as LeafletMap, Marker, LatLngBounds } from "leaflet";
import { Button, Text } from "@/components/ui";
import { cPremiumLocationMap as geometry } from "@/data/c-premium-location-map";
import { cPremiumMapPoints as points } from "@/data/c-premium-map-points";
import "leaflet/dist/leaflet.css";

/** Leaflet is imported only when the map approaches the viewport. No geolocation or live geocoding. */
export function ProjectInteractiveMap({ fallback }: { fallback: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef(new Map<string, Marker>());
  const departmentBounds = useRef<LatLngBounds | null>(null);
  const accessBounds = useRef<LatLngBounds | null>(null);
  const localBounds = useRef<LatLngBounds | null>(null);
  const [ready, setReady] = useState(false);
  const [tileError, setTileError] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;
    let started = false;
    let instance: LeafletMap | undefined;
    let resize: ResizeObserver | undefined;
    async function initialize() {
      if (started) return;
      started = true;
      try {
        const L = await import("leaflet");
        if (cancelled) return;
        instance = L.map(element!, { scrollWheelZoom: false, minZoom: 7, maxZoom: 18 });
        map.current = instance;
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).on("tileerror", () => { if (!cancelled) setTileError(true); }).addTo(instance);
        const boundary = L.polygon(geometry.boundary.map((ring) => ring.map(([lon, lat]) => [lat, lon] as [number, number])), { color: "#4f3c26", weight: 2, fillOpacity: 0.06, interactive: false }).addTo(instance);
        boundary.bindTooltip("78 · Yvelines", { permanent: true, direction: "center", className: "project-map-department-label" });
        departmentBounds.current = boundary.getBounds();
        accessBounds.current = L.latLngBounds(points.map(({ latitude, longitude }) => [latitude, longitude]));
        localBounds.current = L.latLngBounds(points.filter(({ id }) => id !== "gare").map(({ latitude, longitude }) => [latitude, longitude]));
        for (const point of points) {
          const popup = document.createElement("div");
          const title = document.createElement("strong");
          title.textContent = point.label;
          const description = document.createElement("p");
          description.textContent = point.description;
          popup.append(title, description);
          const marker = L.marker([point.latitude, point.longitude], {
            icon: L.divIcon({ className: "project-map-marker", html: `<span aria-hidden="true">${point.id === "project" ? "C" : point.id === "gare" ? "G" : "B"}</span>`, iconSize: [32, 32], iconAnchor: [16, 16] }),
            title: point.label, alt: point.label, keyboard: true,
          }).bindPopup(popup, { maxWidth: 270 }).addTo(instance);
          marker.on("popupopen", () => setSelected(point.id));
          marker.on("popupclose", () => setSelected((value) => value === point.id ? null : value));
          markers.current.set(point.id, marker);
        }
        instance.fitBounds(localBounds.current, { padding: [55, 55], maxZoom: 16 });
        resize = new ResizeObserver(() => instance?.invalidateSize());
        resize.observe(element!);
        setReady(true);
      } catch {
        instance?.remove();
        map.current = null;
        if (!cancelled) setFailed(true);
      }
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(({ isIntersecting }) => isIntersecting)) { observer.disconnect(); void initialize(); }
    }, { rootMargin: "150px" });
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
      resize?.disconnect();
      instance?.remove();
      map.current = null;
      markers.current.clear();
    };
  }, []);

  function view(bounds: LatLngBounds | null, maxZoom: number) {
    if (map.current && bounds) {
      map.current.closePopup();
      map.current.fitBounds(bounds, { padding: [30, 30], maxZoom, animate: false });
      setSelected(null);
    }
  }

  return (
    <div className="project-interactive-map">
      <div className="project-interactive-map__views">
        <Button variant="secondary" disabled={!ready} onClick={() => view(localBounds.current, 16)}>Le quartier</Button>
        <Button variant="secondary" disabled={!ready} onClick={() => view(accessBounds.current, 13)}>Les accès</Button>
        <Button variant="secondary" disabled={!ready} onClick={() => view(departmentBounds.current, 9)}>Les Yvelines · 78</Button>
      </div>
      <div className="project-interactive-map__frame">
        {!ready && <div className="project-interactive-map__fallback">{fallback}</div>}
        <div ref={container} className="project-interactive-map__canvas" data-ready={ready} role="region" aria-label="Carte interactive de Breuil-Bois-Robert et de ses accès" />
      </div>
      {tileError && <Text variant="small" role="status">Le fond de carte est momentanément indisponible. Les points restent consultables ; vous pouvez aussi explorer les alentours sur OpenStreetMap.</Text>}
      {failed && <Text variant="small" role="status">La carte interactive n’a pas pu être chargée. Le repère communal reste disponible ci-dessus.</Text>}
      <div className="project-interactive-map__points" aria-label="Points d’intérêt">
        {points.map((point) => <Button key={point.id} variant="secondary" disabled={!ready} aria-pressed={selected === point.id} onClick={() => {
          map.current?.setView([point.latitude, point.longitude], 14, { animate: false });
          markers.current.get(point.id)?.openPopup();
        }}>{point.label}</Button>)}
      </div>
      <Text variant="small" className="project-detail__muted">Cliquez sur un point pour découvrir ses informations. Utilisez les boutons + et − pour zoomer.</Text>
    </div>
  );
}
