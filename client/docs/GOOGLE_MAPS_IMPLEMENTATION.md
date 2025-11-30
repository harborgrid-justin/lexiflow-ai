# Google Maps Integration - Best Practices

## Implementation Summary

Following [Google Maps Platform Best Practices](https://developers.google.com/maps/documentation), the Jurisdiction Map implements:

✅ **Performance**: Marker clustering, optimized markers, reused InfoWindows
✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader support  
✅ **Error Handling**: Graceful degradation, retry mechanism, loading states
✅ **Resource Management**: Proper cleanup, script reuse, memory leak prevention
✅ **UX**: Smooth animations, hover effects, fullscreen mode, reset view

## Key Features

- 10 jurisdiction locations (federal circuits + state courts)
- Interactive markers with click/hover effects
- Marker clustering for performance
- Fullscreen toggle
- Restricted bounds (US only)
- Cooperative gesture handling (Ctrl+scroll to zoom)
- Single reused InfoWindow (better performance)

## API Configuration

```bash
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC2iXe4nDiJoFXj6lU7Wlr95Qns9b4fRM8
```

Libraries: `places`, `geometry`, `marker`

## Component Location

`/client/components/jurisdiction/JurisdictionGeoMap.tsx`

## Best Practices Applied

1. **Lazy script loading** - Only loads when needed
2. **Optimized markers** - `optimized: true` flag
3. **Marker clustering** - Groups nearby markers
4. **Single InfoWindow** - Reused for all markers
5. **Proper cleanup** - Removes markers on unmount
6. **Accessibility** - ARIA labels and roles
7. **Error handling** - Retry button, fallback UI
8. **Gesture control** - Cooperative scrolling
9. **Restricted bounds** - Prevents panning to irrelevant areas
10. **Performance** - Disabled unnecessary features

See component source code for implementation details.
