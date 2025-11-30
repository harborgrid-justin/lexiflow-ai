
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, MapPin, Loader2, Maximize2, RotateCcw } from 'lucide-react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

/**
 * Jurisdiction locations with coordinates
 * Following Google Maps best practices: https://developers.google.com/maps/documentation
 */
const jurisdictionLocations = [
  {
    id: '9th-circuit',
    name: '9th Circuit Court of Appeals',
    location: 'San Francisco, CA',
    address: '95 7th Street, San Francisco, CA 94103',
    lat: 37.7749,
    lng: -122.4194,
    type: 'federal',
    color: '#3b82f6',
  },
  {
    id: '2nd-circuit',
    name: '2nd Circuit Court of Appeals',
    location: 'New York, NY',
    address: '40 Foley Square, New York, NY 10007',
    lat: 40.7128,
    lng: -74.0060,
    type: 'federal',
    color: '#3b82f6',
  },
  {
    id: 'dc-circuit',
    name: 'DC Circuit Court of Appeals',
    location: 'Washington, DC',
    address: '333 Constitution Ave NW, Washington, DC 20001',
    lat: 38.9072,
    lng: -77.0369,
    type: 'federal',
    color: '#3b82f6',
  },
  {
    id: '5th-circuit',
    name: '5th Circuit Court of Appeals',
    location: 'New Orleans, LA',
    address: '600 S Maestri Pl, New Orleans, LA 70130',
    lat: 29.9511,
    lng: -90.0715,
    type: 'federal',
    color: '#3b82f6',
  },
  {
    id: 'texas-district',
    name: 'Texas Western District Court',
    location: 'Austin, TX',
    address: '501 W 5th St, Austin, TX 78701',
    lat: 30.2672,
    lng: -97.7431,
    type: 'state',
    color: '#10b981',
  },
  {
    id: 'california-superior',
    name: 'California Superior Court',
    location: 'Los Angeles, CA',
    address: '111 N Hill St, Los Angeles, CA 90012',
    lat: 34.0522,
    lng: -118.2437,
    type: 'state',
    color: '#10b981',
  },
  {
    id: 'ny-supreme',
    name: 'New York Supreme Court',
    location: 'New York, NY',
    address: '60 Centre St, New York, NY 10007',
    lat: 40.7489,
    lng: -73.9680,
    type: 'state',
    color: '#10b981',
  },
  {
    id: 'florida-circuit',
    name: 'Florida 11th Circuit Court',
    location: 'Miami, FL',
    address: '73 W Flagler St, Miami, FL 33130',
    lat: 25.7617,
    lng: -80.1918,
    type: 'state',
    color: '#10b981',
  },
  {
    id: 'illinois-circuit',
    name: 'Illinois Circuit Court',
    location: 'Chicago, IL',
    address: '50 W Washington St, Chicago, IL 60602',
    lat: 41.8781,
    lng: -87.6298,
    type: 'state',
    color: '#10b981',
  },
  {
    id: 'massachusetts-superior',
    name: 'Massachusetts Superior Court',
    location: 'Boston, MA',
    address: '3 Pemberton Square, Boston, MA 02108',
    lat: 42.3601,
    lng: -71.0589,
    type: 'state',
    color: '#10b981',
  },
];

// Default map center (geographic center of continental US)
const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 };
const DEFAULT_ZOOM = 4;

export const JurisdictionGeoMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /**
   * Load Google Maps API script dynamically
   * Best Practice: Load script only when needed, with proper error handling
   */
  const loadGoogleMapsScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded and fully initialized
      if (
        window.google && 
        window.google.maps && 
        window.google.maps.Map &&
        window.google.maps.ControlPosition
      ) {
        resolve();
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com/maps/api/js"]'
      );
      
      if (existingScript) {
        // Wait for existing script to load
        const checkGoogleMaps = setInterval(() => {
          if (
            window.google && 
            window.google.maps && 
            window.google.maps.Map &&
            window.google.maps.ControlPosition
          ) {
            clearInterval(checkGoogleMaps);
            resolve();
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkGoogleMaps);
          reject(new Error('Google Maps script load timeout'));
        }, 10000);
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        reject(new Error('Google Maps API key not found'));
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&loading=async`;
      script.async = true;
      script.defer = true;
      
      script.addEventListener('load', () => {
        // Double-check that google.maps is available
        const checkLoaded = setInterval(() => {
          if (
            window.google && 
            window.google.maps && 
            window.google.maps.Map &&
            window.google.maps.ControlPosition
          ) {
            clearInterval(checkLoaded);
            resolve();
          }
        }, 50);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkLoaded);
          if (window.google && window.google.maps) {
            resolve();
          } else {
            reject(new Error('Google Maps not available after script load'));
          }
        }, 5000);
      });
      
      script.addEventListener('error', () => 
        reject(new Error('Failed to load Google Maps'))
      );
      
      document.head.appendChild(script);
    });
  }, []);

  /**
   * Create custom marker icon with proper scaling
   * Best Practice: Use SVG for scalable, crisp icons
   */
  const createMarkerIcon = useCallback((color: string, scale: number = 1) => {
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8 * scale,
      fillColor: color,
      fillOpacity: 0.9,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      anchor: new google.maps.Point(0, 0),
    };
  }, []);

  /**
   * Create info window content
   * Best Practice: Proper HTML structure with semantic elements
   */
  const createInfoWindowContent = useCallback((jurisdiction: typeof jurisdictionLocations[0]) => {
    return `
      <div style="
        padding: 12px;
        font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
        max-width: 280px;
      ">
        <h3 style="
          margin: 0 0 8px 0;
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.4;
        ">
          ${jurisdiction.name}
        </h3>
        <p style="
          margin: 0 0 4px 0;
          font-size: 13px;
          color: #64748b;
        ">
          📍 ${jurisdiction.address}
        </p>
        <div style="
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #e2e8f0;
        ">
          <span style="
            display: inline-flex;
            align-items: center;
            font-size: 12px;
            color: #94a3b8;
            padding: 4px 8px;
            background-color: ${jurisdiction.type === 'federal' ? '#dbeafe' : '#d1fae5'};
            border-radius: 4px;
          ">
            <span style="
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: ${jurisdiction.color};
              margin-right: 6px;
            "></span>
            ${jurisdiction.type === 'federal' ? 'Federal Circuit Court' : 'State Court'}
          </span>
        </div>
      </div>
    `;
  }, []);

  /**
   * Initialize map with best practices
   */
  const initializeMap = useCallback(async () => {
    try {
      await loadGoogleMapsScript();

      if (!mapRef.current) {
        throw new Error('Map container not found');
      }

      // Wait for google.maps to be fully loaded
      if (!window.google || !window.google.maps || !window.google.maps.ControlPosition) {
        throw new Error('Google Maps API not properly loaded');
      }

      // Best Practice: Configure map with appropriate restrictions and controls
      const mapOptions: google.maps.MapOptions = {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        // Restrict map to relevant area (US + some buffer)
        restriction: {
          latLngBounds: {
            north: 50,
            south: 24,
            east: -65,
            west: -125,
          },
          strictBounds: false,
        },
        // Performance: Disable unnecessary features
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        },
        // Styling for better UX
        styles: [
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#c0c0c0' }],
          },
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
        // Accessibility
        gestureHandling: 'cooperative',
        clickableIcons: false,
      };

      const map = new google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // Create single info window (reused for all markers)
      // Best Practice: Reuse info windows for better performance
      const infoWindow = new google.maps.InfoWindow();
      infoWindowRef.current = infoWindow;

      // Create markers
      const markers = jurisdictionLocations.map((jurisdiction) => {
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
            render: ({ count, position }) => {
              return new google.maps.Marker({
                position,
                icon: {
                  url: `data:image/svg+xml;base64,${btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="#fff" stroke-width="2"/>
                      <text x="20" y="25" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">${count}</text>
                    </svg>
                  `)}`,
                  scaledSize: new google.maps.Size(40, 40),
                },
                label: {
                  text: count.toString(),
                  color: 'transparent',
                },
                zIndex: 1000 + count,
              });
            },
          },
        });
        clustererRef.current = clusterer;
      }

      setLoading(false);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(err instanceof Error ? err.message : 'Failed to load map');
      setLoading(false);
    }
  }, [loadGoogleMapsScript, createMarkerIcon, createInfoWindowContent]);

  /**
   * Reset map view to default
   */
  const handleResetView = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(DEFAULT_CENTER);
      mapInstanceRef.current.setZoom(DEFAULT_ZOOM);
      setSelectedJurisdiction(null);
      infoWindowRef.current?.close();
    }
  }, []);

  /**
   * Toggle fullscreen
   */
  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Initialize map on mount
  useEffect(() => {
    initializeMap();

    // Cleanup on unmount
    // Best Practice: Proper cleanup to prevent memory leaks
    return () => {
      infoWindowRef.current?.close();
      clustererRef.current?.clearMarkers();
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [initializeMap]);

  return (
    <div 
      className={`flex flex-col bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-4 z-50' : 'h-full min-h-[500px]'
      }`}
      role="region"
      aria-label="Jurisdiction Map"
    >
      <div className="p-4 border-b border-slate-200 flex justify-between items-center shrink-0">
        <h3 className="font-bold text-slate-900 flex items-center">
          <Map className="h-5 w-5 mr-2 text-blue-600" aria-hidden="true" /> 
          Jurisdiction Map
        </h3>
        <div className="flex gap-4 items-center">
          <div className="flex gap-3 text-xs">
            <span className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-1" aria-hidden="true"></span> 
              Federal ({jurisdictionLocations.filter(j => j.type === 'federal').length})
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-1" aria-hidden="true"></span> 
              State ({jurisdictionLocations.filter(j => j.type === 'state').length})
            </span>
          </div>
          <div className="flex gap-2">
            {selectedJurisdiction && (
              <button
                onClick={handleResetView}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-2 py-1 hover:bg-blue-50 rounded transition-colors"
                aria-label="Reset map view"
              >
                <RotateCcw className="h-3 w-3" />
                Reset View
              </button>
            )}
            <button
              onClick={handleToggleFullscreen}
              className="text-xs text-slate-600 hover:text-slate-700 font-medium flex items-center gap-1 px-2 py-1 hover:bg-slate-50 rounded transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              <Maximize2 className="h-3 w-3" />
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {loading && (
          <div 
            className="absolute inset-0 bg-slate-100 flex items-center justify-center z-10"
            role="status"
            aria-live="polite"
          >
            <div className="text-center">
              <Loader2 className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-spin" aria-hidden="true" />
              <p className="text-sm text-slate-600">Loading interactive map...</p>
            </div>
          </div>
        )}

        {error && (
          <div 
            className="absolute inset-0 bg-slate-100 flex items-center justify-center z-10"
            role="alert"
            aria-live="assertive"
          >
            <div className="text-center text-red-600">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
              <p className="text-sm font-medium">Failed to load map</p>
              <p className="text-xs mt-1 text-slate-500">{error}</p>
              <button
                onClick={initializeMap}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div 
          ref={mapRef} 
          className="w-full h-full min-h-[400px]"
          role="application"
          aria-label="Interactive map showing jurisdiction locations"
        />
      </div>

      {!loading && !error && (
        <div className="p-3 border-t border-slate-200 bg-slate-50 shrink-0">
          <p className="text-xs text-slate-600 flex items-center gap-2">
            <MapPin className="h-3 w-3 inline" aria-hidden="true" />
            <span>
              Click on any marker to view jurisdiction details. 
              <strong className="ml-1">{jurisdictionLocations.length} courts</strong> displayed across the United States.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
