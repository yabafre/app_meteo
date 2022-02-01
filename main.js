const apiKey = "c59090be381bac484b2ef64701e2119f";

const nowIcon = document.querySelector(".now-icon");
const nowDescription = document.querySelector(".description");
const nowTemperature = document.querySelector(".temperature");
const hour = document.querySelectorAll(".check");
const day = document.querySelectorAll(".day");
const city = document.querySelector("h1");
let nowDay = new Date().getDay();
let nowHours = new Date().getHours();

// TODO: Récupérer les éléments  du DOM dans des constantes

// Traiter les erreurs de navigator.geolocation.getCurrentPosition
const handleGetCurrentPositionError = (error) => {
  alert("Votre géolocalisation ne fonctionne pas, vérifiez vos paramètres.");
};

// Requête fetch

const getWeatherOf = async (position) => {
  try {
    // let lat = position.coords.latitude;
    // let lon = position.coords.longitude;

    const { latitude, longitude } = position.coords;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&lang=fr&appid=${apiKey}`
    );
    const data = await res.json();

    // console.log(data)
    updateUI(data);

    // NOW
    city.innerHTML = `${data.timezone}`;
    nowIcon.src = `img/${data.current.weather[0].icon}.svg`;
    nowDescription.innerText = `${data.current.weather[0].description}`;
    nowTemperature.innerText = `${Math.trunc(data.current.temp)}°`;

    // HOURS
    for (let i = 0; i < 24; i++) {
      let j = nowHours + i;

      if (j > 24) {
        j = j - 24;
      } else if (j == 24) {
        j = 0;
      }

      hour[i].innerHTML = `<p class="hour-text">${j}h</p>
                                 <img class="hour-icon" src="img/${
                                   data.hourly[i].weather[0].icon
                                 }.svg" alt="img temps">
                                 <p class="hour-temperature">${Math.trunc(
                                   data.hourly[i].temp
                                 )}°</p>`;
    }

    // DAYS
    let week = [
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ];
    for (let k = 0; k < 5; k++) {
      l = nowDay + k;
      console.log(l);

      if (l > 7) {
        l = l - 7;
      } else if (l == 7) {
        l = 0;
      }

      day[k].innerHTML = `<p class="day-text">${week[l]}</p>
                                <img class="day-icon" src="img/${
                                  data.daily[k].weather[0].icon
                                }.svg" alt="img temps">
                                <p class="day-temperature">min ${Math.trunc(
                                  data.daily[k].temp.min
                                )}°</p>
                                <p class="day-temperature">max ${Math.trunc(
                                  data.daily[k].temp.max
                                )}°</p>`;
    }
  } catch (error) {
    console.error("Erreur dans le getWeatheerOf() ~>", error);
  }
};

const updateUI = (data) => {
  console.log(data);
};

// Récupérer la géolocalisation de l'utilisateur et faire la requ^te à l'API
navigator.geolocation.getCurrentPosition(
  getWeatherOf,
  (error) => console.log("getCurrentPosition error ~>", error),
  { timeout: 1000 }
);
