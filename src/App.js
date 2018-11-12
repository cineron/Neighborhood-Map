import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
//use new React Error Boundary
import ErrorBoundary from './ErrorBoundary';
import VenueList from './VenueList.js';
import axios from 'axios';
import { slide as Menu } from 'react-burger-menu';

class App extends Component {
constructor(props) {
    super(props);
    //initialize state to hold API data
this.state = {
        venues: [],
        lookUp: '',
        allMarkers: [],
        sortedSpots: []
    };
    // console.log("clickedOnSpot:" + this.clickedOnSpot())
    this.vens = [];
}
// load the map
// Idea to load Google Maps this way from Elharony Youtube video
// https://www.youtube.com/watch?v=W5LhLZqj76s
componentDidMount() {
    this.getVenues();
    // this.renderMap() //move to a callback function after rendering markers
}

// loads the new script (loadGMapScript)
// initMap here is a call to the initMap on line 62-ish
renderMap = () => {
    loadGMapsScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyB6fUiE5X9kPlFVUyccN9PgVP-gRR-er0c&callback=initMap'
    );

    // make renderMap visible to React
    window.initMap = this.initMap;
};

//method for retrieving info from FourSquare API
getVenues = () => {
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
    const parameters = {
        client_id: 'DQW0VVBWUKAMMBNUKZS1D4BGR4U02BE2QTNQEMPZJKHI2IFO',
        client_secret: 'W0422IG25V4HL4FQMQLUSNESOFFG2RKO3VZFRCX4KSE1JOG5',
        query: 'burgers',
        ll: [32.811312, -96.770208],
        v: '20180811'
    };
    //axios is a library for request and responses //
    // https://github.com/axios/axios //
    axios
        .get(endPoint + new URLSearchParams(parameters))
        .then(response => {
            console.log(response);
            // console.log("response:" + response.data.response.groups[0].items);

            //add venues from FourSquare to state
            this.setState(
                {
                    venues: response.data.response.groups[0].items
                },
                this.renderMap()
            );
            // this.vens = response.data.response.groups[0].items;
            // console.log("this.vens:" + this.vens);
        })
        .catch(error => {
            console.log('ERROR!! ' + error);
        });
};

//create map
//from https://developers.google.com/maps/documentation/javascript/tutorial
initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 32.811312, lng: -96.770208 },
        zoom: 15
    });

    // create a (Component) property to hold the markers
    let mapMarkers = [];
    //add info window
    const infowindow = new window.google.maps.InfoWindow();

    //loop over venues and add them to state
    console.log(this.state.venues);
    this.state.venues.forEach(eachVenue => {
        //add markers to map by creating marker objects
        const marker = new window.google.maps.Marker({
            position: { lat: eachVenue.venue.location.lat, lng: eachVenue.venue.location.lng },
            map: map,
            id: eachVenue.venue.id,
            name: eachVenue.venue.name,
            animation: window.google.maps.Animation.DROP
        });
        // console.log(this.state);
        // console.log("marker tilte:"+marker.title);

        //content for info window
        const contentString = `<h3>${eachVenue.venue.name}</h3><p>${eachVenue.venue.location.address}</p>`;

        //connect infowindow to marker
        //click on a marker
        marker.addListener('click', function() {
            //animate marker code from Google Maps Docs!
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => {
                marker.setAnimation(null);
            }, 1000);

            //change content
            infowindow.setContent(contentString);

            //open an infowindow
            infowindow.open(map, marker);
            // Push the marker to the array of markers.
        });
        mapMarkers.push(marker);
    });
    this.setState({ sortedSpots: mapMarkers, allMarkers: mapMarkers });
    console.log(this.state.allMarkers);
};

//Searching///////
// create list of venues
// trigger from https://developers.google.com/maps/documentation/javascript/reference/event#event.trigger
clickedOnSpot = venue => {
    const marker = this.state.allMarkers.find(m => m.id === venue.id);
    window.google.maps.event.trigger(marker, 'click');
};

// Loop thru the markers and filter for venues that match the lookUp string. https://www.youtube.com/watch?v=5J6fs_BlVC0&t=1939s
// logic from 
siftSpots = lookUp => {
    // debugger;
    // Filter venue list per lookUp.
    let searchedVenues = this.state.allMarkers.filter(venue => venue.name.toLowerCase().includes(lookUp.toLowerCase()));

    this.state.allMarkers.forEach(marker => {
        // Toggle marker visibility per lookUp match.
        // logic from https://www.youtube.com/watch?v=5J6fs_BlVC0&t=1939s
        marker.name.toLowerCase().includes(lookUp.toLowerCase())
            ? marker.setVisible(true)
            : marker.setVisible(false);
    });

    // sortedSpots is the result of searchedVenues filter, update lookUp input.
    this.setState({ sortedSpots: searchedVenues, lookUp });
};

render() {
    return (
        <div className="App">
            <header>
                <h1 className="site-title">Burgers in East Dallas</h1>
            </header>
            <ErrorBoundary>
                <Menu>
                    <VenueList
                        clickedOnSpot={this.clickedOnSpot}
                        allMarkers={this.state.allMarkers}
                        siftSpots={this.siftSpots}
                        sortedSpots={this.state.sortedSpots}
                    />
                </Menu>
            </ErrorBoundary>
            <main>
                <ErrorBoundary>
                    <div id="map"role="application" aria-label="map" /> />
                </ErrorBoundary>
            </main>
        </div>
    );
}
}

/*
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>

Idea for placing Google maps logic here from Elharony Youtube video
https://www.youtube.com/watch?v=W5LhLZqj76s
*/

//"function" keyword can be used b/c this block is outside React.
// re-create the copied function from Google Documents to here.
function loadGMapsScript(url) {
//get the "script" tag
let index = window.document.getElementsByTagName('script')[0];

//add a <script> tag
let script = window.document.createElement('script');
script.src = url;
script.async = true;
script.defer = true;

//insert this script before other scripts
index.parentNode.insertBefore(script, index);
}

export default App;