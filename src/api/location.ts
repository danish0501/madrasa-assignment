import axios from 'axios';

export const getCityCountryFromCoords = async (lat: number, lon: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const res = await axios.get(url);
  const data = res.data;
  const city = data.address.city || data.address.town || data.address.village || '';
  const country = data.address.country || '';
  return `${city}, ${country}`;
};

export const getCoordsFromIP = async () => {
  const res = await axios.get('https://ipapi.co/json/');
  return {
    lat: res.data.latitude,
    lon: res.data.longitude,
  };
};
