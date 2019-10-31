/*
function App() {
    return(
	    <div>
	    <Heading />
	    <CityForm />
	    <Weather city='Sydney' country='aus' />
	    </div>
    );
}
*/

class App extends React.Component {
    constructor(props) {
	super(props);
	this.state = {city: '', country: ''};
	this.handleInput = this.handleInput.bind(this);
    }

    handleInput = (cityValue, countryValue) => {
	console.log("In App.handleInput...");
	console.log(cityValue);
	console.log(countryValue);
	this.setState(state => ({city: cityValue, country: countryValue}));
    }
    
    render() {
	console.log('city: ' + this.state.city);
	console.log('country:' + this.state.country);
	return(
		<div>
		<Heading />	
		<LocationForm callback={this.handleInput}/>
		<Weather city={this.state.city} country={this.state.country} />
		</div>
	);	

    }
}
    
function Heading() {
    return(
	<div className='heading'>
	    <h1>Weather</h1>
	    <h3>Enter a city and country.</h3>
	    </div>
    );
}

class LocationForm extends React.Component {
    constructor(props) {
	super(props);
	this.callback = props.callback;
	this.state = {city: '', country: ''};
	this.handleChange = this.handleChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
	const target = event.target;
	const name = target.name;
	this.setState({
	    [name]: target.value
	});
    }

    handleSubmit(event) {
	console.log("In handleSubmit...");
	console.log(this.state.city);
	console.log(this.state.country);
	this.callback(this.state.city, this.state.country);
	event.preventDefault();
    }

    render() {
	return(
	    <div className='container'>
		<form onSubmit={this.handleSubmit}>
		<label>
		City:
		<input
	    name='city'
	    type="text"
	    value={this.state.city}
	    onChange={this.handleChange} />
		</label>
		<br />
		<label>
		Country:
		<input
	    name='country'
	    type="text"
	    value={this.state.country}
	    onChange={this.handleChange}
		/>
		</label>
		<input type="submit" value="Submit" />
		</form>
		</div>
	);
    }
}

class Weather extends React.Component {
    constructor(props) {
	super(props);
	this.state = {dataReceived: false};
	this.temp = 0;
    }

    getWeather(city, country) {
	// Check if the city and country are null
	if(city === '' || country === '') {
	    return;
	}
	
	else {
	    var request = new XMLHttpRequest();
	    request.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q='
			 + city + ',' + country + '&APPID=1691f032793d309e08203112cd0cd698', true);
	    request.onload = () =>
		{
		    console.log("Request sent...");
		    //  console.log(request.response);
		    var data = JSON.parse(request.response);
		    var temperature =  this.kelvinToCelsius(data['main']['temp']);
		    this.setState({dataReceived: true});
		    this.temp = temperature;
		    // console.log(this.state.temp);
		}
	    
	    request.send();
	}
    }

    kelvinToCelsius(kelvins) {
	return kelvins - 273.15;
    }
    
    render() {
	const city = this.props.city;
	const country = this.props.country;
	this.getWeather(city, country);
	console.log("In Weather.render...");
	console.log("city: " + city);
	console.log("country: " + country);
	if(city === '' || country === ''){
	    return null;
	}
	
	else if(this.state.dataReceived) {
	return (
		<div>
		<p>Temperature is {Math.round(this.temp)}.</p>
		</div>
	);
	}

	else {
	    return (
		    <div>
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
