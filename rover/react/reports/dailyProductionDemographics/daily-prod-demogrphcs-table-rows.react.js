var DailyProductionByDemographicsTableRows = React.createClass({
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  render: function() {
    var className 			= '',
			totalColumnsVisible = 5,
    header 				= this.props.header,
    colText 			= '',
    visibleColCounter 	= 0;

    if (!header.showRevenue) {
      totalColumnsVisible = totalColumnsVisible - 3; //we are hiding 3 columns
    } else if (!header.showAvailable) {
      totalColumnsVisible = totalColumnsVisible - 2; //we are hiding 2 column
    }
    var rows = _.map(this.props.data.listing, function(row, index) {

      return React.DOM.tr({}, _.map(row.valueList, function(colData, colIndex) {
        className = '';

        if ((visibleColCounter + 1) % totalColumnsVisible === 0) {
          className = 'day-end';
        }
        if (_.indexOf(['future_revenue', 'adr', 'rate_revenue'], colData.key) >= 0 && !header.showRevenue) {
          className += ' hidden';
        } else if (_.indexOf(['available', 'res_count'], colData.key) >= 0 && !header.showAvailable) {
          className += ' hidden';
        } else {
          visibleColCounter++;
        }

        colText = row.showInBold ? React.DOM.strong({}, colData.value) : colData.value;
        return React.DOM.td({className: className}, colText);
      }));
    });
    return React.DOM.tbody({}, rows);
  }
});
