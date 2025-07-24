import React, { FC, useMemo, useEffect, useState } from 'react';
import { formatTo12Hour } from '../utils/formatTime';
import { PrayerName, iconMap, gradientMap } from '../utils/PrayerCard.constants';

interface Props {
  times: Record<PrayerName, string>;
  selected: PrayerName;
  onSelectPrayer: (prayer: PrayerName) => void;
}

export const PrayerCard: FC<Props> = ({ times, selected, onSelectPrayer }) => {
  // Countdown calculation
  const { hours, minutes } = useMemo(() => {
    const now = new Date();
    const [h, m] = times[selected].split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);

    let diff = Math.floor((target.getTime() - now.getTime()) / 60000);
    if (diff < 0) diff += 24 * 60;
    return { hours: Math.floor(diff / 60), minutes: diff % 60 };
  }, [times, selected]);

  // Auto-refresh every minute
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const gradient = gradientMap[selected];
  const weekday = useMemo(
    () => new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    []
  );

  // Get ordered prayer names for consistent segment positioning
  const orderedPrayers = useMemo(() => {
    return (Object.entries(times) as [PrayerName, string][])
      .map(([name, t]) => {
        const [hh, mm] = t.split(':').map(Number);
        return { name, minutes: hh * 60 + mm };
      })
      .sort((a, b) => a.minutes - b.minutes)
      .map(p => p.name);
  }, [times]);

  // Calculate completed prayers
  const completedPrayers = useMemo(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    return orderedPrayers.filter(prayer => {
      const [h, m] = times[prayer].split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      return currentMinutes > prayerMinutes;
    }).length;
  }, [times, orderedPrayers, tick]); // Include tick to recalculate every minute

  return (
    <div
      className={`
        relative w-[350px] h-[350px]
        rounded-[27px]
        bg-gradient-to-br ${gradient}
        shadow-xl overflow-hidden
      `}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center p-6 pb-4">
        <div className="flex items-center gap-3 text-white">
          <div className="text-white">
            {iconMap[selected]}
          </div>
          <h2 className="text-2xl font-semibold">{selected}</h2>
        </div>
        <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full font-medium">
          {weekday}
        </span>
      </div>

      {/* Countdown Section */}
      <div className="px-6 pb-4">
        <p className="text-white/90 text-lg font-medium">
          Next prayer in {hours}h {minutes}m
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-6">
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className={`
                flex-1 h-2 rounded-full transition-all duration-300 ease-in-out
                ${index < completedPrayers 
                  ? 'bg-white' 
                  : 'bg-white/20'
                }
              `}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/70">
          <span>{completedPrayers}/5 completed</span>
          <span>{5 - completedPrayers} remaining</span>
        </div>
      </div>

      {/* Prayer Times Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-5 gap-2">
          {orderedPrayers.map((name) => {
            const active = name === selected;
            return (
              <button
                key={name}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectPrayer(name);
                }}
                className={`
                  flex flex-col items-center gap-2 p-3 rounded-2xl
                  transition-all duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-white/30
                  ${active 
                    ? 'bg-white/20 backdrop-blur-sm text-white scale-105' 
                    : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-102'
                  }
                `}
              >
                <div className={`${active ? 'text-white' : 'text-white/70'}`}>
                  {iconMap[name]}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-medium whitespace-nowrap">
                    {name}
                  </span>
                  <span className="text-xs font-normal whitespace-nowrap">
                    {formatTo12Hour(times[name])}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
