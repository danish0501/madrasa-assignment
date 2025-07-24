import axios from 'axios';
import { PrayerTimes } from '../store/usePrayerStore';

export const fetchPrayerTimes = async (lat: number, lon: number): Promise<PrayerTimes> => {
  const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}`;
  const res = await axios.get(url);
  const timings = res.data.data.timings;
  return {
    Fajr: timings.Fajr,
    Dhuhr: timings.Dhuhr,
    Asr: timings.Asr,
    Maghrib: timings.Maghrib,
    Isha: timings.Isha,
  };
};
