import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, MapPin, Loader2, Maximize2, RotateCcw } from 'lucide-react';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { useMapMarkers } from './hooks/useMapMarkers';
import { jurisdictionLocations, DEFAULT_CENTER, DEFAULT_ZOOM } from './data/jurisdiction-locations';
import { getMapOptions } from './utils/map-utils';

export const JurisdictionGeoMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { loading, error, setLoading, setError, loadGoogleMapsScript } = useGoogleMaps();
  const { selectedJurisdiction, setSelectedJurisdiction, infoWindowRef, createMarkers, cleanup } = useMapMarkers();

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

      const mapOptions = getMapOptions(DEFAULT_CENTER, DEFAULT_ZOOM);
      const map = new google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // Create markers and clustering
      createMarkers(map, jurisdictionLocations);

      setLoading(false);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(err instanceof Error ? err.message : 'Failed to load map');
      setLoading(false);
    }
  }, [loadGoogleMapsScript, createMarkers, setLoading, setError]);

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
  }, [setSelectedJurisdiction, infoWindowRef]);

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
      cleanup();
    };
  }, [initializeMap, cleanup]);

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
