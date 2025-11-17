function getAqiMessage(aqi) {
    if(aqi <= 50) return "Zrak je svjež i čist – uživajte u njemu.";
    if(aqi <= 100) return "Zrak je umjereno čist – povremena pažnja može biti korisna.";
    if(aqi <= 150) return "Zrak je blago zagađen – osjetljive osobe neka pripaze.";
    if(aqi <= 200) return "Zrak je nezdrav – smanjite naporne aktivnosti.";
    if(aqi <= 300) return "Zrak je vrlo nezdrav – ograničite duže boravke vani.";
    return "Zrak je opasan – budite oprezni.";
}



function getAqiMessageClass(aqi) {
    if(aqi <= 50) return "message-good";
    if(aqi <= 100) return "message-moderate";
    if(aqi <= 150) return "message-unhealthy-sensitive";
    if(aqi <= 200) return "message-unhealthy";
    if(aqi <= 300) return "message-very-unhealthy";
    return "message-hazardous";
}


function animateNumber(element, value) {
    let current = 0;
    const increment = Math.ceil(value / 50);
    const interval = setInterval(() => {
        current += increment;
        if(current >= value){
            current = value;
            clearInterval(interval);
        }
        element.textContent = current;
    }, 20);
}


let gauge = new JustGage({
    id: "aqi-gauge",
    value: 0,
    min: 0,
    max: 500,
    title: "",
    label: "AQI",
    pointer: true,
    pointerOptions: {
        toplength: -15,
        bottomlength: 10,
        color: "#000",
        stroke: "#000",
        stroke_width: 2,
        stroke_linecap: "round"
    },
    gaugeWidthScale: 0.6,
    counter: true,
    hideMinMax: true,
    relativeGaugeSize: true,
    levelColorsGradient: false,
    levelColors: ["#4caf50","#ffeb3b","#ff9800","#f44336","#9c27b0","#6a1b9a"]
});


fetch('https://api.waqi.info/feed/@14863/?token=7bc1d5b35e358a667d5fe59890e264ca645df2a4')
    .then(res => res.json())
    .then(data => {
        if(data.status === "ok"){
            const aqi = data.data.aqi;
            const dominant = data.data.dominentpol || "N/A";

            const time = new Date(data.data.time.s);
            const formattedTime = `${String(time.getDate()).padStart(2,'0')}.${String(time.getMonth()+1).padStart(2,'0')}.${time.getFullYear()} ${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')}`;

            const aqiElem = document.getElementById('aqi');
            animateNumber(aqiElem, aqi);

            const messageElem = document.getElementById('aqi-message');
            messageElem.textContent = getAqiMessage(aqi);
            messageElem.className = `fs-5 p-3 rounded ${getAqiMessageClass(aqi)}`;

            document.getElementById('dominant').textContent = dominant;
            document.getElementById('update-time').textContent = `Zadnje ažuriranje: ${formattedTime}`;

            gauge.refresh(aqi);
        } else {
            document.getElementById('update-time').textContent = 'Podaci nisu dostupni';
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById('update-time').textContent = 'Greška pri učitavanju podataka';
    });
