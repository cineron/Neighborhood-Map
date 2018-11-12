import React, { Component } from "react";

// code used from React docs
// https://reactjs.org/docs/react-api.html#reactfragment
// matching logic from https://www.youtube.com/watch?v=5J6fs_BlVC0&t=1939s
class VenueList extends Component {
	render() {
		return (
			<React.Fragment>
				<input
					type="search"
					placeholder="Filter by Name"
					value={this.props.lookUp}
					onChange={event => {
						this.props.siftSpots(event.target.value);
					}}
					className="venues-filter"
					aria-label="Filter by Name"
				/>
				<ul className="venues-list">
					{this.props.sortedSpots && 
					this.props.sortedSpots.length > 0 && 
					this.props.sortedSpots.map((venue, index) => (
						<li className="venue-list-item" key={index}>
							<button className="venue-list-item-button" 
							key={index} 
							onClick={() => {
								this.props.clickedOnSpot(venue);
							}}>
							{venue.name}
							</button>
						</li>
					))}
				</ul>
			</React.Fragment>
		);
	}
}

export default VenueList;
