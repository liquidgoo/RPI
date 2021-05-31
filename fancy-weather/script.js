const newImButton=document.getElementsByClassName("button button--update")[0],
	  langSelector=document.getElementsByClassName("language-menu button drop-down-menu__face-button")[0],
	  celsius=document.getElementsByClassName("button button--c")[0],
	  fahrenheit=document.getElementsByClassName("button button--f")[0],
	  place=document.getElementsByClassName("weather-data-cluster__location")[0],
	  dateHolder=document.getElementsByClassName("weather-data-cluster__date-time")[0],
	  currTemp=document.getElementsByClassName("weather-data-cluster__temperature-today")[0],
	  currIconWeath=document.getElementsByClassName("weather-data-cluster__weather-icon")[0];
var currMetric="metric",
	lat,lon,timezone;
celsius.setAttribute("style", "background-color:rgba(180,184,187,1)");

function showTime() {
  getTimeZone();
  var options = { weekday: 'short', month: 'long', day: 'numeric',hour:'numeric',minute:'numeric',second:'numeric' ,hour12: false,timeZone:timezone};
  let date = new Date();
  lang=langSelector.options[langSelector.options.selectedIndex].value;
  dateHolder.innerHTML=date.toLocaleString(lang, options).replace(/,/g, '');
  const tomorrow = new Date(date)
	tomorrow.setDate(tomorrow.getDate() + 1);

	var options = { weekday: 'long'};
  	lang=langSelector.options[langSelector.options.selectedIndex].value;
  	
  	document.getElementsByClassName("forecast__day")[0].innerHTML=tomorrow.toLocaleString(lang, options);
  	tomorrow.setDate(tomorrow.getDate() + 1)
  	document.getElementsByClassName("forecast__day")[1].innerHTML=tomorrow.toLocaleString(lang, options);
  	tomorrow.setDate(tomorrow.getDate() + 1)
  	document.getElementsByClassName("forecast__day")[2].innerHTML=tomorrow.toLocaleString(lang, options);
  setTimeout(showTime, 1000);
}


async function fetchPlace () {
	lang=langSelector.options[langSelector.options.selectedIndex].value;
  	const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?language=${lang}&access_token=pk.eyJ1IjoiZmFuZ3VzIiwiYSI6ImNrcDN6cWUycTFmY2gycG13YXV4aGY0eHEifQ.a3Eu2Aj9YHQUeSlYJn2Xiw`;
   	const res = await fetch(url);
   	const data = await res.json();
   	place.innerHTML=data.features[3].place_name;
}

async function success(pos) {
  var crd = pos.coords,
  	latWhole=Math.trunc(crd.latitude),
  	latPart=Math.trunc((-latWhole+crd.latitude)*100),
  	longWhole=Math.trunc(crd.longitude),
  	longPart=Math.trunc((-longWhole+crd.longitude)*100);
  	document.getElementById("latWhole").innerHTML=latWhole;
  	document.getElementById("latPart").innerHTML=latPart;
  	document.getElementById("longWhole").innerHTML=longWhole;
  	document.getElementById("longPart").innerHTML=longPart;
  	lat=crd.latitude;
  	lon=crd.longitude;
  	getWeather();
  	fetchPlace();  	

  	mapboxgl.accessToken = 'pk.eyJ1IjoiZmFuZ3VzIiwiYSI6ImNrcDN6cWUycTFmY2gycG13YXV4aGY0eHEifQ.a3Eu2Aj9YHQUeSlYJn2Xiw';
	var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [lon, lat],
	zoom: 10
	});
	 
	 var marker1 = new mapboxgl.Marker()
	.setLngLat([lon, lat])
	.addTo(map);
	// Add the control to the map.
	map.addControl(
	new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	mapboxgl: mapboxgl
	})
	);

// Add the control to the map.
var geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl
});
 
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
	geocoder.on('result', function (e) {
		lon=e.result.center[0];
		lat=e.result.center[1];
		fetchPlace();
		getWeather();
	});

}


async function getWeather() {
   const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${currMetric}&appid=31a754d57cc896236ee8c8ce87f157aa`;
   const res = await fetch(url);
   const data = await res.json();
   currIconWeath.src=`http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;
   
   currTemp.textContent = `${Math.round(data.list[0].main.temp)}°`;
   document.getElementById("flike").innerHTML=data.list[0].main.feels_like;
   document.getElementById("wind").innerHTML=data.list[0].wind.speed;
   if(currMetric!="metric")
   		document.getElementById("wind").innerHTML=(data.list[0].wind.speed/2.23694).toPrecision(2);
   document.getElementById("humid").innerHTML=data.list[0].main.humidity;

   var today = new Date(),
    hour = today.getHours(), 
    ind1=8-Math.trunc(hour/3)+4,
    ind2=ind1+8,
    ind3=ind2+8;

	

  	document.getElementsByClassName("forecast__temperature")[0].innerHTML=`${Math.round(data.list[ind1].main.temp)}°`;
  	document.getElementsByClassName("forecast__temperature")[1].innerHTML=`${Math.round(data.list[ind2].main.temp)}°`;
  	document.getElementsByClassName("forecast__temperature")[2].innerHTML=`${Math.round(data.list[ind3].main.temp)}°`;

  	document.getElementsByClassName("forecast__icon")[0].src=`http://openweathermap.org/img/wn/${data.list[ind1].weather[0].icon}@2x.png`;
  	document.getElementsByClassName("forecast__icon")[1].src=`http://openweathermap.org/img/wn/${data.list[ind2].weather[0].icon}@2x.png`;
  	document.getElementsByClassName("forecast__icon")[2].src=`http://openweathermap.org/img/wn/${data.list[ind3].weather[0].icon}@2x.png`;
 }

function cels(){
	currMetric="metric";
	celsius.setAttribute("style", "background-color:rgba(180,184,187,1)");
	fahrenheit.setAttribute("style", "background-color:rgba(180,184,187,.5)");
	localStorage.setItem('tmp',currMetric);
	getWeather();
}

function far(){
	currMetric="imperial";
	fahrenheit.setAttribute("style", "background-color:rgba(180,184,187,1)");
	celsius.setAttribute("style", "background-color:rgba(180,184,187,0.5)");
	localStorage.setItem('tmp',currMetric);
	getWeather();
}

dis=false;

function changeImg(e){
  if(dis)
    return;
  dis = true;
  loadImg();
  setTimeout(function() { dis= false; }, 1500);
}

async function loadImg () {
   const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=2cca2a85f9b92338b4306fe666803bb7&tags=dark,town,night&tag_mode=all&extras=url_h&format=json&nojsoncallback=1`;
   const res = await fetch(url);
   const data = await res.json();
   var ind=Math.trunc(Math.random()*data.photos.perpage);
   const img = new Image();
   img.src = data.photos.photo[ind].url_h;
   img.onload = () => {      
    document.querySelector('body').style.backgroundImage = `url(${data.photos.photo[ind].url_h})`;
  }; 
}



async function getTimeZone(){
   const url = `https://api.mapbox.com/v4/examples.4ze9z6tv/tilequery/${lon},${lat}.json?access_token=pk.eyJ1IjoiZmFuZ3VzIiwiYSI6ImNrcDN6cWUycTFmY2gycG13YXV4aGY0eHEifQ.a3Eu2Aj9YHQUeSlYJn2Xiw`;
   const res = await fetch(url);
   const data = await res.json();
   timezone=data.features[0].properties.TZID;
}

if (localStorage.getItem('tmp') == "" || localStorage.getItem('tmp') == "metric" ) {
    cels();
  } else {
    far();
}

console.log(localStorage.getItem('lang'));
if(localStorage.getItem('lang')=="en-US"){
	{
		console.log(langSelector.options)
		langSelector.options[1].select=false;
		langSelector.options[0].select=true;
		console.log(langSelector.options)
	}
}else{
	console.log(langSelector.options)
	langSelector.options[1].select=true;	
		langSelector.options[0].select=false;
		console.log(langSelector.options)
} 


function changeLang(){
	console.log(localStorage.getItem('lang'));
	lang=langSelector.options[langSelector.options.selectedIndex].value;
	localStorage.setItem('lang',lang);
	console.log(localStorage.getItem('lang'));
	if(lang=="" || lang=="ru-RU"){
		console.log("sadasdasdasdasdas")
		document.getElementById("overcast").innerHTML="Прогноз: ";
		document.getElementById("w").innerHTML="Ветер: ";
		document.getElementById("like").innerHTML="Чуствуется: ";
		document.getElementById("hum").innerHTML="Влажность: ";
		document.getElementById("lat").innerHTML="Широта: ";
		document.getElementById("lon").innerHTML="Долгота: ";
		document.getElementById("search").innerHTML="Искать";
		fetchPlace();
	}else{
		document.getElementById("overcast").innerHTML="Overcast";
		document.getElementById("w").innerHTML="Wind: ";
		document.getElementById("like").innerHTML="Feels like: ";
		document.getElementById("hum").innerHTML="Humidity:";
		document.getElementById("lat").innerHTML="Latitude: ";
		document.getElementById("lon").innerHTML="Longitude: ";
		document.getElementById("search").innerHTML=="Search";
		fetchPlace();
	}
}

showTime()
loadImg()

navigator.geolocation.getCurrentPosition(success);

celsius.addEventListener('click',cels);
fahrenheit.addEventListener('click',far);


newImButton.addEventListener('click',changeImg);
changeLang();