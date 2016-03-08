var DailyProductionByDemographicsTable = React.createClass({
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  render: function() {
    var headerProps = {
      header: this.props.header,
      data 	: this.props.data
    },
	rowProps = {
  	  header: this.props.header,
  	  data 	: this.props.data
	};

    return React.DOM.table({
      className: 'statistics-reports'
    }, DailyProductionByDemographicsTableHeader(headerProps), DailyProductionByDemographicsTableRows(rowProps));
  }
});