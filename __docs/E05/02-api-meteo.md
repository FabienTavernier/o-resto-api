# API météo

> <https://docs.tomorrow.io/reference/weather-forecast>

- URL : `https://api.tomorrow.io/v4/weather/forecast`
- `location` avec latitude/longitude
- `timestep: "1d"`
- unités en SI
- clé API

Retourne de nombreuses… nombreuses données dont :

- `time` → météo du jour à 6 h 00
- `temperatureAvg` → moyenne pour la journée
- `humidityAvg`
- `cloudCoverAvg`
- `windSpeedAvg`
- `precipitationProbabilityAvg`
- `weatherCodeMax`  
  → <https://docs.tomorrow.io/reference/data-layers-weather-codes>

  on va plutôt écrire la correspondance (voir bas de page) en français  
  → `./weatherCodes.json`

> **NOTE** on type `DayForecast` avec seulement les données qui nous intéressent
