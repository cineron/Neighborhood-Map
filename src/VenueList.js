import React, { Component } from "react";

class VenueList extends Component {
	render() {
		return (
			<React.Fragment>
				<input
					type="search"
					placeholder="Filter by Name"
					value={this.props.query}
					onChange={event => {
						this.props.filterVenues(event.target.value);
					}}
					className="venues-filter"
					aria-label="Filter by Name"
				/>
				<ul className="venues-list">
					{this.props.filteredVenues && 
					this.props.filteredVenues.length > 0 && 
					this.props.filteredVenues.map((venue, index) => (
						<li className="venue-list-item" key={index}>
							<button className="venue-list-item-button" 
							key={index} 
							onClick={() => {
								this.props.clickListItem(venue);
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
