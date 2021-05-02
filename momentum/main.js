const time = document.getElementById('time'),
    date = document.getElementById('date'),
    greeting = document.getElementById('greeting')
    nameTag = document.getElementById('name')
    focusTag = document.getElementById('focus'),
    button = document.getElementById('button');
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

function chooseBgs(hour) {
    for (; hour < 6; hour++) {
        bgs.push('url(assets/night/' + addZero((Maht.ceil(Math.random() * 20))) + '.jpg)');
    }
    for (; hour < 12; hour++) {
        bgs.push('url(assets/morning/' + addZero((Maht.ceil(Math.random() * 20))) + '.jpg)');
    }
    for (; hour < 18; hour++) {
        bgs.push('url(assets/day/' + addZero((Maht.ceil(Math.random() * 20))) + '.jpg)');
    }
    for (; hour < 24; hour++) {
        bgs.push('url(assets/evening/' + addZero((Math.ceil(Math.random() * 20))) + '.jpg)');
    }
}

function setBgGreet() {
    button.disabled = true;
    let today = new Date(),
        hour = today.getHours();

    if (bgs.length == 0) chooseBgs(hour);

    document.body.style.background = bgs.shift();

    if (hour < 6) {
        greeting.textContent = "Good? Night";
        document.body.style.color = 'black';
        button.style.filter = 'invert(0%)';
    } else if (hour < 12) {
        greeting.textContent = "Good Morning";
        document.body.style.color = 'black';
        button.style.filter = 'invert(0%)';
    } else if (hour < 18) {
        greeting.textContent = "Good Afternoon";
        document.body.style.color = 'black';
        button.style.filter = 'invert(0%)';
    } else {
        greeting.textContent = "Good Evening";
        document.body.style.color = 'white';
        button.style.filter = 'invert(100%)';
    }

    setTimeout(function() {button.disabled = false;}, 1000);
    setTimeout(setBgGreet, ((59 - today.getMinutes()) * 60 + (59 - today.getSeconds())) * 1000 + (1000 - today.getMilliseconds()));
}

function getName() {
    if (localStorage.getItem('name') === null) {
        nameTag.textContent = '[Enter Name]';
    } else {
        nameTag.textContent = localStorage.getItem('name');
    }
}

function getFocus() {
    if (localStorage.getItem('focus') === null) {
        focusTag.textContent = '[Enter Focus]';
    } else {
        focusTag.textContent = localStorage.getItem('focus');
    }
}

function setName(e) {
    if(e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            if(e.target.innerText === '') {
                nameTag.textContent = '[Enter Name]';
            } else {
                localStorage.setItem('name', e.target.innerText);
            }
            nameTag.blur();
        }
    } else if (e.type ==='focus' ) {
        if (e.target.innerText === '[Enter Name]')
            nameTag.textContent = '';
    } else {
        if(e.target.innerText === '') {
            nameTag.textContent = '[Enter Name]';
        } else {
            localStorage.setItem('name', e.target.innerText);
        }
    }
}
function setFocus(e) {
    if(e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            if(e.target.innerText === '') {
                focusTag.textContent = '[Enter Focus]';
            } else {
                localStorage.setItem('focus', e.target.innerText);
            }
            focusTag.blur();
        }
    } else if (e.type ==='focus') {
        if (e.target.innerText === '[Enter Focus]')
            focusTag.textContent = '';
    } else {
        if(e.target.innerText === '') {
            focusTag.textContent = '[Enter Focus]';
        } else {
            localStorage.setItem('focus', e.target.innerText);
        }
    }
}

nameTag.addEventListener('keypress', setName);
nameTag.addEventListener('blur', setName);
nameTag.addEventListener('focus', setName);
focusTag.addEventListener('keypress', setFocus);
focusTag.addEventListener('blur', setFocus);
focusTag.addEventListener('focus', setFocus);
button.addEventListener('click', setBgGreet);


setBgGreet();
getName();
getFocus();
showTime();