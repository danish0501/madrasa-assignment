import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface PrayerStore {
  location: string;
  prayerTimes: PrayerTimes | null;
  setPrayerTimes: (data: PrayerTimes, location: string) => void;
}

export const usePrayerStore = create<PrayerStore>()(
  persist(
    (set) => ({
      location: '',
      prayerTimes: null,
      setPrayerTimes: (data, location) => set({ prayerTimes: data, location }),
    }),
    {
      name: 'prayer-times-storage',
    }
  )
);
