"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_KEY}&q=${city}&days=3`
      );
      const data = await response.json();
      setWeather(data);
      console.log(data); // Check the forecast data in console
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeather();
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-10 flex items-center justify-center">
      <main className="flex justify-between gap-8 w-full max-w-6xl">
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSubmit}>
            <input
              className="w-64 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 transition-all duration-200"
              type="text"
              placeholder="Enter a location..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </form>
          <div className="flex justify-between items-center gap-8">
            <div className="flex-col">
              <h1 className="text-6xl">
                {weather?.location?.name || "Enter a location..."}
              </h1>
              <div className="flex gap-2">
                <p className="text-2xl text-slate-400">Chance of rain:</p>
                <p className="text-2xl text-white">
                  {weather?.forecast?.forecastday[0]?.day
                    ?.daily_chance_of_rain || 0}
                  %
                </p>
              </div>
              <p className="text-6xl">
                {weather?.current?.temp_c
                  ? `${weather.current.temp_c}°C`
                  : "0°C"}
              </p>
            </div>
            <Image
              aria-hidden
              src={
                weather?.current?.condition?.icon
                  ? `https:${weather.current.condition.icon.replace(
                      "64x64",
                      "128x128"
                    )}`
                  : "/globe.svg"
              }
              alt={weather?.current?.condition?.text || "Weather icon"}
              width={128}
              height={128}
              unoptimized={true}
              className="object-contain"
            />
          </div>
          <div className="w-64 px-4 py-2 rounded-lg bg-slate-700">
            {weather?.forecast?.forecastday?.map((day) => (
              <div key={day.date}>
                <p>Date: {day.date}</p>
                <p>Max: {day.day.maxtemp_c}°C</p>
                <p>Min: {day.day.mintemp_c}°C</p>
                <p>Chance of rain: {day.day.daily_chance_of_rain}%</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-80 px-8 py-10 rounded-lg bg-slate-700 h-[calc(100vh-14rem)] overflow-y-auto">
          <h2 className="text-xl mb-4">Hourly Forecast</h2>
          {weather?.forecast?.forecastday[0]?.hour
            ?.filter((hour) => {
              const hourTime = new Date(hour.time);
              const currentTime = new Date();
              return hourTime >= currentTime;
            })
            .map((hour) => {
              const time = new Date(hour.time).getHours();
              return (
                <div
                  key={hour.time}
                  className="flex justify-between items-center py-2 border-b border-slate-600"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{time}:00</span>
                  </div>
                  <div className="flex items-center gap-2 jutsify-evenly">
                    <Image
                      src={`https:${hour.condition.icon}`}
                      alt={hour.condition.text}
                      width={40}
                      height={40}
                    />
                    <span>{hour.condition.text}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400">{hour.temp_c}°C</span>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}
