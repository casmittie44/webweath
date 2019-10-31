/*
// Clock example
class Clock extends React.Component {
    constructor(props) {
	super(props);
	this.state = {date: new Date()};
    }
    
    componentDidMount() {
	this.timerID = setInterval(
	    ()=>this.tick(),
	    1000
	);
    }
    
    componentWillUnmount() {
	clearInterval(this.timerID);
    }
    
    tick() {
	this.setState( {
	    date: new Date()
	});
    }
    
    render() {
	return(
		<div>
		<h1>Hello, World!</h1>
		<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
		</div>
	);
    }
}

function App() {
    return(
	    <div>
	    <Clock />
	    <Clock />
	    <Clock />
	    </div>
    );
}

/* Inline script version    
var request = new XMLHttpRequest();
request.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=1691f032793d309e08203112cd0cd698', true);

//request.open('GET', 'https://ghibliapi.herokuapp.com/films',true);
request.addEventListener("load", output);

function output() {
      var data = JSON.parse(this.response);
      console.log("It worked!");
      ReactDOM.render(
      <div>
	<h1>It worked!</h1>
	<p>{data['main']['temp']}</p>
      </div>,
	document.getElementById('root')
	);
};
*/

function App() {
    return(
	    <div>
	    <Weather />
	    </div>
    );
}

class Weather extends React.Component {
    constructor(props) {
	super(props);
	this.state = {dataReceived: false, temp: 0};
	this.city = 'Melbourne';
	this.country = 'aus';
	this.getWeather(this.city, this.country);
	//this.processResponse = this.processResponse.bind(this);
    }

    getWeather(city, country) {
	var request = new XMLHttpRequest();
	request.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q='
		     + this.city + ',' + this.country + '&APPID=1691f032793d309e08203112cd0cd698', true);
	request.onload = () =>
	{
	  //  console.log(request.response);
	    var data = JSON.parse(request.response);
	    var temperature =  this.kelvinToCelsius(data['main']['temp']);
	    this.setState({dataReceived: true,
			   temp: temperature}
			 );

	    // console.log(this.state.temp);
	}
	
	request.send();
    }

    kelvinToCelsius(kelvins) {
	return kelvins - 273.15;
    }
    
    render() {
	if(this.state.dataReceived) {
	return (
		<div>
		<h1>It worked!</h1>
		<p>Temperature is {this.state.temp}.</p>
		</div>
	);
	}

	else {
	    return (
		    <div>
		    <h1>It worked!</h1>
		    <p>Temperature is loading...</p>
		    </div>
	    );
	}
    }
}

ReactDOM.render(
	<App />,
    document.getElementById('root')
);
