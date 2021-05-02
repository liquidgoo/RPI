const time = document.getElementById('time'),
    greeting = document.getElementById('greeting')
    nameTag = document.getElementById('name')
    focusTag = document.getElementById('focus');

function showTime() {
    let today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds();

    time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;

    setTimeout(showTime, 1000);
}

function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function setBgGreet() {
    let today = new Date(),
        hour = today.getHours;

    if (hour < 6) {
        document.body.style.backgroundImage = "url(https://github.com/irinainina/ready-projects/blob/momentum/momentum/assets/images/night/01.jpg)";
        greeting.textContent = "Good? Night";
    } else if (hour < 12) {
        document.body.style.backgroundImage = "https://github.com/irinainina/ready-projects/blob/momentum/momentum/assets/images/morning/01.jpg";
        greeting.textContent = "Good Morning";
    } else if (hour < 18) {
        document.body.style.backgroundImage = "https://github.com/irinainina/ready-projects/blob/momentum/momentum/assets/images/afternoon/01.jpg";
        greeting.textContent = "Good Afternoon";
        document.body.style.color = 'white';
    } else {
        document.body.style.backgroundImage = "url('https://github.com/irinainina/ready-projects/blob/momentum/momentum/assets/images/evening/01.jpg');";
        greeting.textContent = "Good Evening";
        document.body.style.color = 'white';
    }
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


//setBgGreet();
getName();
getFocus();
showTime();