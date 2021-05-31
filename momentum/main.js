const time = document.getElementById('time'),
    date = document.getElementById('date'),
    greeting = document.getElementById('greeting')
    nameTag = document.getElementById('name')
    focusTag = document.getElementById('focus'),
    nextBg = document.getElementById('nextBg'),
    quote = document.getElementById('quote'),
    author = document.getElementById('author'),
    nextQuote = document.getElementById('nextQuote'),
    weatherIcon = document.querySelector('.weather-icon'),
    temperature = document.getElementById('temperature'),
    humidity = document.getElementById('humidity'),
    wind = document.getElementById('wind'),
    city = document.getElementById('city');
const bgs = [];

function showTime() {
    let today = new Date();

    time.innerHTML = `${addZero(today.getHours())}<span>:</span>
                    ${addZero(today.getMinutes())}<span>:</span>
                    ${addZero(today.getSeconds())}`;
    date.innerHTML = `${getWeekDay(today.getDay())}<span>, </span>
                    ${addZero(today.getDate())}<span> </span>
                    ${getMonth(today.getMonth())}`;

    setTimeout(showTime, 1000);
}

function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function getWeekDay(n) {
    let result = '';
    switch (n) {
        case 0:
            result = 'Sunday';
            break;
        case 1:
            result = 'Monday';
            break;
        case 2:
            result = 'Tuesday';
            break;
        case 3:
            result = 'Wednesday';
            break;
        case 4:
            result = 'Thursday';
            break;
        case 5:
            result = 'Friday';
            break;
        case 6:
            result = 'Saturday';
            break;
    }
    return result;
}

function getMonth(n) {
    let result = '';
    switch (n) {
        case 0:
            result = 'January';
            break;
        case 1:
            result = 'February';
            break;
        case 2:
            result = 'March';
            break;
        case 3:
            result = 'April';
            break;
        case 4:
            result = 'May';
            break;
        case 5:
            result = 'June';
            break;
        case 6:
            result = 'July';
            break;
        case 7:
            result = 'August';
            break;
        case 8:
            result = 'September';
            break;
        case 9:
            result = 'October';
            break;
        case 10:
            result = 'November';
            break;
        case 11:
            result = 'December';
            break;                                                                                                                                                                                                            
    }
    return result;
}

function fillBGs(hour) {
    for (; hour < 6; hour++) {
        bgs.push('url(assets/night/' + addZero((Math.ceil(Math.random() * 20))) + '.jpg)');
    }
    for (; hour < 12; hour++) {
        bgs.push('url(assets/morning/' + addZero((Math.ceil(Math.random() * 20))) + '.jpg)');
    }
    for (; hour < 18; hour++) {
        bgs.push('url(assets/day/' + addZero((Math.ceil(Math.random() * 20))) + '.jpg)');
    }
    for (; hour < 24; hour++) {
        bgs.push('url(assets/evening/' + addZero((Math.ceil(Math.random() * 20))) + '.jpg)');
    }
}

function setBgGreet() {
    nextBg.disabled = true;
    let today = new Date(),
        hour = today.getHours();

    if (bgs.length == 0) fillBGs(hour);

    document.body.style.background = bgs.shift();

    if (hour < 6) {
        greeting.textContent = "Good Night";
    } else if (hour < 12) {
        greeting.textContent = "Good Morning";
    } else if (hour < 18) {
        greeting.textContent = "Good Afternoon";
    } else {
        greeting.textContent = "Good Evening";
    }

    setTimeout(function() {nextBg.disabled = false;}, 1000);
    setTimeout(setBgGreet, ((59 - today.getMinutes()) * 60 + (59 - today.getSeconds())) * 1000 + (1000 - today.getMilliseconds()));
}

function getName() {
    localName = localStorage.getItem('name');
    if (localName === null || localName === "") {
        nameTag.textContent = '[Enter Name]';
    } else {
        nameTag.textContent = localName;
    }
}

function getFocus() {
    localFocus = localStorage.getItem('focus');
    if (localFocus === null || localFocus === "") {
        focusTag.textContent = '[Enter Focus]';
    } else {
        focusTag.textContent = localFocus;
    }
}

function setName(e) {
    if(e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            nameTag.blur();
        }
    } else if (e.type ==='focus' ) {
        nameTag.textContent = '';
    } else {
        if(e.target.innerText === '') {
            getName();
        } else {
            localStorage.setItem('name', e.target.innerText);
        }
    }
}
function setFocus(e) {
    if(e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            focusTag.blur();
        }
    } else if (e.type ==='focus') {
        focusTag.textContent = '';
    } else {
        if(e.target.innerText === '') {
            getFocus();
        } else {
            localStorage.setItem('focus', e.target.innerText);
        }
    }
}

async function getQuote() {  
    const url = `https://favqs.com/api/qotd`;
    const res = await fetch(url);
    const data = await res.json(); 
    quote.textContent = data.quote.body;
    author.textContent = data.quote.author;
}

async function getWeather() {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&appid=14b072d75b576cfdd2f0c4df6b795c59&units=metric`);
    const data = await res.json();
    if (res.ok === false) {
        weatherIcon.className = 'weather-icon owf';
        temperature.textContent = data.message;
        humidity.textContent = '';
        wind.textContent = '';
        return false;
    }
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind: ${data.wind.speed}m/s`
    return true;
}

function getCity() {
    let localCity = localStorage.getItem('city');
    if (localCity === null || localCity === '') {
        city.textContent = 'Минск';
    } else {
        city.textContent = localCity;
    }
}

async function setCity(e) {
    if(e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            city.blur();
        }
    } else if (e.type ==='focus' ) {
        city.textContent = '';
    } else {
        if(e.target.innerText === '') {
            getCity();
            getWeather();
        } else {
            if (await getWeather() == true) {
                localStorage.setItem('city', e.target.innerText);
            }
        }
    }
}

nameTag.addEventListener('keypress', setName);
nameTag.addEventListener('blur', setName);
nameTag.addEventListener('focus', setName);

focusTag.addEventListener('keypress', setFocus);
focusTag.addEventListener('blur', setFocus);
focusTag.addEventListener('focus', setFocus);

nextBg.addEventListener('click', setBgGreet);

document.addEventListener('DOMContentLoaded', getQuote);
nextQuote.addEventListener('click', getQuote);

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);
city.addEventListener('focus', setCity);


setBgGreet();
getName();
getFocus();
showTime();
getCity();