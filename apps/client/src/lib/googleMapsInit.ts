import { setOptions } from '@googlemaps/js-api-loader';

// Called once at module-evaluation time so every file that calls importLibrary
// is guaranteed to have the key set, regardless of import order.
setOptions({
  key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  libraries: ['places'],
});
