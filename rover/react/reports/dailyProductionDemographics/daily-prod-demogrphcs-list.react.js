var DailyProductionListDemographics = React.createClass({
  render: function() {
    return React.DOM.ul({
      className: 'wrapper'
    },
	React.DOM.li({
  		className: 'main-heading action-row'
	},

	DailyProductionRevenueToggle({header: this.props.header, toggleRevenue: this.props.toggleRevenue}),
	DailyProductionAvailabilityToggle({header: this.props.header, toggleAvailability: this.props.toggleAvailability})),

	_.map(this.props.data, function(row, index) {
	  var listItem = React.DOM.em({}, row.displayLabel);
	  if (row.showInBold) {
	    listItem = React.DOM.strong({}, row.displayLabel);
	  }
	  return React.DOM.li({}, listItem);
	}));
  }
});
