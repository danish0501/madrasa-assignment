import React, { useState } from 'react';
import { getCityCountryFromCoords, getCoordsFromIP } from '../api/location';
import { fetchPrayerTimes } from '../api/prayer';
import { usePrayerStore } from '../store/usePrayerStore';

export const Navbar: React.FC = () => {
  const { setPrayerTimes } = usePrayerStore();
  const [location, setLocation] = useState<string>('Select location');
  const [loading, setLoading] = useState(false);

  const fetchLocationAndPrayerTimes = async () => {
    setLoading(true);
    try {
      let lat = 0;
      let lon = 0;

      await new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
            resolve();
          },
          async () => {
            const coords = await getCoordsFromIP();
            lat = coords.lat;
            lon = coords.lon;
            resolve();
          }
        );
      });

      const locationLabel = await getCityCountryFromCoords(lat, lon);
      const prayerData = await fetchPrayerTimes(lat, lon);
      setPrayerTimes(prayerData, locationLabel);
      setLocation(locationLabel);
    } catch (err) {
      console.error(err);
      setLocation('Location not found');
    }
    setLoading(false);
  };

  return (
    <div className="w-full bg-white shadow-sm h-[70px]">
      <nav className="max-w-screen-xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 text-[#3F3F3F] text-sm font-medium w-full">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="madrasa logo" className="h-6 sm:h-7" />
          <span className="text-[#6A1B9A] font-bold text-base sm:text-lg">madrasa</span>
        </div>

        {/* Right: Location */}
        <div className="flex flex-col text-right">
          <span className="text-xs text-gray-500">{location}</span>
          <button
            onClick={fetchLocationAndPrayerTimes}
            className="text-[12px] text-[#7B61FF] hover:underline flex items-center gap-1"
            disabled={loading}
          >
            {loading ? 'Fetching location...' : 'Get accurate namaz time'}
          </button>
        </div>
      </nav>
    </div>
  );
};
