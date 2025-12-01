import type { JurisdictionLocation } from '../data/jurisdiction-locations';

/**
 * Create custom marker icon with proper scaling
 * Best Practice: Use SVG for scalable, crisp icons
 */
export const createMarkerIcon = (color: string, scale: number = 1) => {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8 * scale,
    fillColor: color,
    fillOpacity: 0.9,
    strokeColor: '#ffffff',
    strokeWeight: 2,
    anchor: new google.maps.Point(0, 0),
  };
};

/**
 * Create info window content
 * Best Practice: Proper HTML structure with semantic elements
 */
export const createInfoWindowContent = (jurisdiction: JurisdictionLocation): string => {
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
};

/**
 * Configure map options with best practices
 */
export const getMapOptions = (center: google.maps.LatLngLiteral, zoom: number): google.maps.MapOptions => {
  return {
    center,
    zoom,
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
};

/**
 * Create clustered marker icon
 */
export const createClusterMarker = (count: number, position: google.maps.LatLng): google.maps.Marker => {
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
};
