import { useCallback, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { JurisdictionLocation } from '../data/jurisdiction-locations';
import { createMarkerIcon, createInfoWindowContent, createClusterMarker } from '../utils/map-utils';

export const useMapMarkers = () => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string | null>(null);

  /**
   * Create markers for all jurisdictions
   */
  const createMarkers = useCallback((
    map: google.maps.Map,
    locations: JurisdictionLocation[]
  ) => {
    // Create single info window (reused for all markers)
    // Best Practice: Reuse info windows for better performance
    const infoWindow = new google.maps.InfoWindow();
    infoWindowRef.current = infoWindow;

    // Create markers
    const markers = locations.map((jurisdiction) => {
      const marker = new google.maps.Marker({
        position: { lat: jurisdiction.lat, lng: jurisdiction.lng },
        map,
        title: jurisdiction.name,
        icon: createMarkerIcon(jurisdiction.color),
        // Accessibility
        label: {
          text: '',
          color: 'transparent',
        },
        optimized: true, // Performance optimization
        animation: google.maps.Animation.DROP,
      });

      // Click handler
      marker.addListener('click', () => {
        infoWindow.setContent(createInfoWindowContent(jurisdiction));
        infoWindow.open(map, marker);
        setSelectedJurisdiction(jurisdiction.id);
        
        // Smooth pan to marker
        map.panTo({ lat: jurisdiction.lat, lng: jurisdiction.lng });
        map.setZoom(10);
      });

      // Hover effects
      marker.addListener('mouseover', () => {
        marker.setIcon(createMarkerIcon(jurisdiction.color, 1.3));
      });

      marker.addListener('mouseout', () => {
        marker.setIcon(createMarkerIcon(jurisdiction.color, 1));
      });

      return marker;
    });

    markersRef.current = markers;

    // Best Practice: Use marker clustering for better performance with many markers
    if (markers.length > 5) {
      const clusterer = new MarkerClusterer({
        map,
        markers,
        // Customize cluster appearance
        renderer: {
          render: ({ count, position }) => createClusterMarker(count, position),
        },
      });
      clustererRef.current = clusterer;
    }
  }, []);

  /**
   * Cleanup markers and clusterer
   */
  const cleanup = useCallback(() => {
    infoWindowRef.current?.close();
    clustererRef.current?.clearMarkers();
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  }, []);

  return {
    selectedJurisdiction,
    setSelectedJurisdiction,
    infoWindowRef,
    createMarkers,
    cleanup,
  };
};
