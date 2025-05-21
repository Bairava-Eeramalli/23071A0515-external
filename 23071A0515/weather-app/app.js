const API_KEY = '39b1494d46e9ed8ceb4835b79fa06781';


const cityInput = document.getElementById('cityInput');
const fetchBtn = document.getElementById('fetchBtn');
const ctx = document.getElementById('weatherChart').getContext('2d');

let weatherChart = null;

const fetchWeatherData = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found or API error');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

const displayWeather = (data, callback) => {
   
    const labels = data.list.map(item => item.dt_txt);
    const temps = data.list.map(item => item.main.temp);

    callback(labels, temps);
};

const renderChart = (labels, temps) => {
    if (weatherChart) {
        weatherChart.data.labels = labels;
        weatherChart.data.datasets[0].data = temps;
        weatherChart.update();
    } else {
        weatherChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temps,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.3,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date & Time'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    }
                }
            }
        });
    }
};

fetchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeather(weatherData, renderChart);
    } catch (error) {
        alert(error.message);
    }
});