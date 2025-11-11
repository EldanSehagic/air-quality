fetch('https://api.waqi.info/feed/@14863/?token=7bc1d5b35e358a667d5fe59890e264ca645df2a4')
    .then(res => res.json())
    .then(data => {
        if(data.status === "ok"){
            const city = data.data.city.name;
            const aqi = data.data.aqi;
            const pm25 = data.data.iaqi.pm25.v;
            const dominant = data.data.dominentpol;

            document.getElementById('air-data').innerHTML = `
            <h3>${city}</h3>
            <p><strong>AQI:</strong> ${aqi}</p>
            <p><strong>PM2.5:</strong> ${pm25}</p>
            <p><strong>Dominantni zagadzivac:</strong> ${dominant}</p>
            `;
        } else {
            document.getElementById('air-data').innerHTML = 'Podaci nisu dostupni';
        }
        
    })
    .catch(err => console.error(err));