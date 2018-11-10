import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
//use new React Error Boundary
import ErrorBoundary from "./ErrorBoundary";
import VenueList from "./VenueList.js";
import axios from "axios";

class App extends Component {
  constructor(props){
    super(props);
    //initialize state to hold API data
    this.state = {
      venues: [],
    };
  }
  // load the map
  componentDidMount(){
    this.getVenues(); 
    // this.renderMap() //move to a callback function after rendering markers
  }

  // loads the new script (loadGMapScript)
  renderMap = () => {
    loadGMapsScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyB6fUiE5X9kPlFVUyccN9PgVP-gRR-er0c&callback=initMap")

    // make renderMap visible to React
    window.initMap = this.initMap
  }

  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id: "DQW0VVBWUKAMMBNUKZS1D4BGR4U02BE2QTNQEMPZJKHI2IFO",
      client_secret: "W0422IG25V4HL4FQMQLUSNESOFFG2RKO3VZFRCX4KSE1JOG5",
      query: "coffee",
      ll: [32.811312,-96.770208],
      v: "20180811"
    };

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        // console.log(response);
        // console.log(response.data.response.groups[0].items);
        this.setState({
          venues: response.data.response.groups[0].items,
        },
        this.renderMap());
      })
      .catch(error => {
        console.log("ERROR!! " + error)
      });

  };

  //create map
  //from https://developers.google.com/maps/documentation/javascript/tutorial
  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 32.811312,  lng: -96.770208},
      zoom: 15
    });

    //add info window
    const infowindow = new window.google.maps.InfoWindow();

    //loop over venues and add them to state
    this.state.venues.map((eachVenue) => {
      //add markers to map
      const marker = new window.google.maps.Marker({
        position: {lat: eachVenue.venue.location.lat, lng: eachVenue.venue.location.lng},
        map: map,
        title: eachVenue.venue.name,
      });

      //content for info window
      const contentString = `<h3>${eachVenue.venue.name}</h3><p>${eachVenue.venue.location.address}</p>`;

      //connect infowindow to marker
      //click on a marker
      marker.addListener('click', function() {
        //animate marker 
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
					setTimeout(() => {
						marker.setAnimation(null);
    				}, 1000);
        
        //change content
        infowindow.setContent(contentString);
        
        //open an infowindow
        infowindow.open(map, marker);
      });

    });
    

  };

  //Searching///////
  // Loop thru the markers and filter for venues that match the query string.
	filterVenues = (query) => {
		// Filter venue list per query.
		let f = this.venues.filter(venue =>
			venue.name.toLowerCase().includes(query.toLowerCase())
		);
		this.markers.forEach(marker => {
			// Toggle marker visibility per query match.
			marker.name.toLowerCase().includes(query.toLowerCase())
				? marker.setVisible(true)
				: marker.setVisible(false);
		});

		// Filtered venues is the result of f filter, update query input.
		this.setState({ filteredvenues: f, query });
	}



  render() {
    return (
      <div className="App">
        <header>
          <h1 className="site-title">Coffee in East Dallas</h1>
        </header>
        <Menu>
					<VenueList
						clickListItem={this.clickListItem}
						filterVenues={this.filterVenues}
						filteredVenues={this.state.filteredVenues}
					/>
				</Menu>
        <main>
          <ErrorBoundary>
            <div id="map"></div>
          </ErrorBoundary>
        </main>
      </div>
    );
  }
}

/*
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>

Follow along from Elharony Youtube video
https://www.youtube.com/watch?v=W5LhLZqj76s
*/

//"function" keyword can be used b/c this block is outside React. 
// re-create the copied function from Google Documents to here.
function loadGMapsScript(url) {
  //get the "script" tag
  let index = window.document.getElementsByTagName("script")[0];

  //add a <script> tag
  let script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  
  //insert this script before other scripts
  index.parentNode.insertBefore(script, index);
}


export default App;
