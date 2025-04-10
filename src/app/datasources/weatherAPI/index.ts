import { RESTDataSource } from '@apollo/datasource-rest';
import debug from 'debug';
import type { DayForecast, Location } from '../../../@types';
import weatherCodes from './weatherCode';

const log = debug('app:datasource:weatherapi');

class WeatherAPI extends RESTDataSource {
  // constructor() {
  //   super();
  //   this.baseURL = ''
  // }

  override baseURL = 'https://api.tomorrow.io/v4/weather/';

  async getWeatherForecast(location: Location) {
    log(`get weather for ${location.x}, ${location.y}`);

    const params = {
      location: `${location.x},${location.y}`,
      timestep: '1d',
      units: 'metric',
      apikey: process.env.TOMORROW_API_KEY,
    };

    const data = await this.get('forecast', { params });

    const daily = data.timelines.daily.map((day: DayForecast) => ({
      time: day.time,
      weather: weatherCodes[`${day.values.weatherCodeMax}`],
      temperature: day.values.temperatureAvg,
      windSpeed: day.values.windSpeedAvg,
      cloudCover: day.values.cloudCoverAvg,
      precipitationProbability: day.values.precipitationProbabilityAvg,
    }));

    return { daily };
  }
}

export default WeatherAPI;
