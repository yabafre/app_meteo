const template = document.querySelector("template");
const load = document.querySelector(".loading");
const main = document.querySelector("main");

const getWeatherOf = async (position) => {
  try {
    const { latitude, longitude } = position.coords;

    const allPromise = Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&lang=fr&appid=1ac3d5e78a389a710094d95fc304e84e`
      ),
      fetch(
        `https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`
      ),
    ]);
    const [weatherallPromiseult, cityallPromiseult] = await allPromise;
    const weatherData = await weatherallPromiseult.json();
    const cityData = await cityallPromiseult.json();

    // API Weather
    updateUI(weatherData);
    // API Locate
    updateUI(cityData);
    // Loading content
    var clone = document.importNode(template.content, true);
    main.removeChild(load);
    setTimeout(5000);
    main.appendChild(clone);
    //const Clone
    const liveIcon = document.querySelector(".live-icon");
    const liveDescription = document.querySelector(".description");
    const liveTemp = document.querySelector(".temp");
    const hour = document.querySelectorAll(".hour");
    const day = document.querySelectorAll(".day");
    const city = document.querySelector(".city");

    console.log(city);
    // Live
    city.innerText = `${cityData.features[0].properties.city}`;
    liveIcon.src = `img/${weatherData.current.weather[0].icon}.svg`;
    liveDescription.innerText = `${weatherData.current.weather[0].description}`;
    liveTemp.innerText = `${Math.trunc(weatherData.current.temp)}°`;

    // HOURS : 24h
    for (let i = 0; i < 24; i++) {
      hour[i].innerHTML = `<p class="hour-text">${new Date(
        weatherData.hourly[i].dt * 1000
      ).getHours()}h</p>
      <p class="hour-temp">${Math.trunc(weatherData.hourly[i].temp)}°</p>
      <img class="hour-icon" src="img/${
        weatherData.hourly[i].weather[0].icon
      }.svg" alt="img temps">
        `;
    }

    // DAYS :
    let week = [
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ];
    console.log(new Date().getDay());
    for (let k = 0; k < week.length; k++) {
      let daily_dt = new Date(weatherData.daily[k].dt * 1000).getDay();

      day[k].innerHTML = `<p class="day-text">${week[daily_dt]}</p>
        <img class="day-icon" src="img/${
          weatherData.daily[k].weather[0].icon
        }.svg" alt="img temps">
          <p class="day-temp">Min : ${Math.trunc(
            weatherData.daily[k].temp.min
          )}°  |  Max : ${Math.trunc(weatherData.daily[k].temp.max)}°</p>`;
    }
  } catch (error) {
    console.error("Erreur dans le getWeatheerOf() ~>", error);
  }
};
const updateUI = (data) => {
  console.log(data);
  // const newContent = template.content.cloneNode
};

// Récupérer la géolocalisation de l'utilisateur et faire la requête à l'API
navigator.geolocation.getCurrentPosition(
  getWeatherOf,
  (error) => console.log("getCurrentPosition error ~>", error),
  { timeout: 1000 }
);
