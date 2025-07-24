import React, { useEffect, useState } from 'react';
import { usePrayerStore } from '../store/usePrayerStore';
import { fetchPrayerTimes } from '../api/prayer';
import { getCityCountryFromCoords, getCoordsFromIP } from '../api/location';
import { PrayerCard } from './PrayerCard';
import { PrayerName } from '../utils/PrayerCard.constants';

export const PrayerTimes: React.FC = () => {
  const { prayerTimes, setPrayerTimes } = usePrayerStore();
  const [error, setError] = useState<string>('');
  const [selected, setSelected] = useState<PrayerName | null>(null);

  // Fetching prayer times
  useEffect(() => {
    if (prayerTimes) return;

    (async () => {
      try {
        let lat = 0, lon = 0;

        await new Promise<void>((res) => {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              lat = coords.latitude;
              lon = coords.longitude;
              res();
            },
            async () => {
              const c = await getCoordsFromIP();
              lat = c.lat;
              lon = c.lon;
              res();
            }
          );
        });

        const loc = await getCityCountryFromCoords(lat, lon);
        const data = await fetchPrayerTimes(lat, lon);
        setPrayerTimes(data, loc);
      } catch {
        setError('Could not load prayer times.');
      }
    })();
  }, [prayerTimes, setPrayerTimes]);

  // Auto-selecting first prayer
  useEffect(() => {
    if (prayerTimes && selected === null) {
      const first = Object.keys(prayerTimes)[0] as PrayerName;
      setSelected(first);
    }
  }, [prayerTimes, selected]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 text-center text-red-500 bg-white rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  if (!prayerTimes || selected === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 text-center text-gray-600 bg-white rounded-lg shadow-md">
          Loading prayer times...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <PrayerCard 
        times={prayerTimes} 
        selected={selected} 
        onSelectPrayer={setSelected}
      />
    </div>
  );
};
