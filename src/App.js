import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  // load the map
  componentDidMount(){
    this.renderMap()
  }

  renderMap = () => {
    loadGMapsScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyB6fUiE5X9kPlFVUyccN9PgVP-gRR-er0c&callback=initMap")

    // make renderMap visible to React
    window.initMap = this.initMap;
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
  }


  render() {
    return (
      <main>
        <div id="map"></div>
      </main>
    );
  }
}

/*
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>

Follow along from Elharony Youtube video
https://www.youtube.com/watch?v=W5LhLZqj76s
*/

function loadGMapsScript(url) {
  let index = window.document.getElementsByTagName("script")[0];
  let script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}


export default App;
