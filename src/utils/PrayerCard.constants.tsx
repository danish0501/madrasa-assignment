import React from 'react';
import { CloudMoon, Sun, SunHorizon, CloudSun, Moon } from 'phosphor-react';

export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export const iconMap: Record<PrayerName, React.ReactNode> = {
  Fajr:    <CloudMoon size={24} weight="fill" />,
  Dhuhr:   <Sun size={24} weight="fill" />,
  Asr:     <SunHorizon size={24} weight="fill" />,
  Maghrib: <CloudSun size={24} weight="fill" />,
  Isha:    <Moon size={24} weight="fill" />,
};

export const gradientMap: Record<PrayerName, string> = {
  Fajr:    'from-[#D6BDFF] to-[#3F7CE6]',
  Dhuhr:   'from-[#E77715] to-[#FFE392]',
  Asr:     'from-[#006C5E] to-[#C9F3B3]',
  Maghrib: 'from-[#FF88A8] to-[#FF9452]',
  Isha:    'from-[#811DEC] to-[#381079]',
};
