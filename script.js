class App extends React.Component {
    constructor(props) {
	super(props);
	this.state = {city: '', country: ''};
	this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (cityValue, countryValue) => {
	if(this.state.city != cityValue || this.state.country != countryValue) {
	    this.setState(state => ({city: cityValue, country: countryValue}));
	}
    }
    
    render() {
	return(
		<div>
		<Heading />	
		<LocationForm callback={this.handleSubmit}/>
		<Weather city={this.state.city} country={this.state.country} />
		</div>
	);	

    }
}
    
function Heading() {
    return(
	    <div className='heading'>
	    <h1>Weather</h1>
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

    componentDidUpdate() {
	this.callback = this.props.callback;
    }

    handleChange(event) {
	const target = event.target;
	const name = target.name;
	this.setState({
	    [name]: target.value
	});
    }

    handleSubmit(event) {
	this.callback(this.state.city, this.state.country);
	event.preventDefault();
    }

    render() {
	return(
	    <div className='input-container'>
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
		<br />
		<input type="submit" value="Submit" />
		</form>
		</div>
	);
    }
}

class Weather extends React.Component {
    constructor(props) {
	super(props);
	this.state = {data: null, error: false};
	this._asyncRequest = null;
	this.city = '';
	this.country = '';
    }
	
    componentDidUpdate() {
	// Check if the update has been caused by change to the country or city
	// props. If so, adjust our temporary variables and fetch new data.
	if(this.city != this.props.city || this.country != this.props.country) {
	    this.city = this.props.city;
	    this.country = this.props.country;
	    this.getWeather(this.props.city, this.props.country);
	}
    }

    componentWillUnmount() {
	if(this._asyncRequest) {
	    this._asyncRequest.cancel();
	}
    }
    
    getWeather(city, country) {
	if(city === '' || country === '') {
	    return;
	}
	
	else {
	    this._asyncRequest = new Request('http://api.openweathermap.org/data/2.5/weather?q='
					     + this.props.city + ',' + this.props.country + '&APPID=1691f032793d309e08203112cd0cd698');
	    
	    fetch(this._asyncRequest, {method: 'GET'})
		.then(response => {
		    if(!response.ok) {
			throw "Response could not be processed";
		    }
		    return response.json();
		})
		.then(response => {
		    this._asyncRequest = null;
		    this.setState({data: response, error: false});
		})
		.catch(e => {
		    console.log("Error in fetching data: " + e);
		    this.setState({data: null, error: true});
		})
	}
    }

    render() {	
	if(this.props.city === '' || this.props.country === ''){
	    return null;
	}

	// If the data is null and there have been no errors,
	// render a loading state
	else if(!this.state.data && !this.state.error) {    
	    return (
		<Loading />
	    );
	}

	else if(this.state.error) {
	    return (
		    <Error />
	    );
	}
	
	else {
	    return (
		    <WeatherIcon data={this.state.data} />
	    );
	}
	   
    }
}

class WeatherIcon extends React.Component {
    constructor(props) {
	super(props);
	if(props.data) {
	this.resourcePath = 'http://openweathermap.org/img/wn/' +
		props.data.weather[0].icon+'@2x.png';
	}
	else {
	    this.resourcePath = '';
	}
    }

    displayTempCelsius(kelvins) {
	return Math.round(kelvins - 273.15);
    }

    capitalizeFirstChar(lower) {
	const upper = lower.charAt(0).toUpperCase() + lower.substring(1);
	return upper;
    }
    
    render() {
	const data = this.props.data;
	if(data === null) {
	    return (<Error />);
	}
	
	else {
	    const temp = this.displayTempCelsius(data['main']['temp']);
	    const description = this.capitalizeFirstChar(data.weather[0].description);
	    this.resourcePath = 'http://openweathermap.org/img/wn/' +
		this.props.data.weather[0].icon+'@2x.png';
	    return(
		    <div className='weather-container'>
		    <div className="weather-icon">
		    <img src={this.resourcePath} alt={description} />
		    </div>
		    <div className='weather-icon-description'>
		    <p>{description}</p>
		    <p>{temp}&#8451;</p>
		    </div>
		    </div>
	    );
	}
    }
}

function Error(props) {
    return(
	    <div className='error'>
	    <img src="Images/error.png" />
	    <p>Something went wrong.</p>
	    <p>Is there a spelling mistake?</p>
	    </div>
    );
}

function Loading(props) {
    return(
	    <div className='weather-container'>
	    <div className='weather-icon'>
	    <p>Weather is loading...</p>
	    </div>
	    </div>
    );    
}

ReactDOM.render(
	<App />,
    document.getElementById('root')
);
