React.initializeTouchEvents(true);

var DailyProductionByDemographics = React.createClass({
	render: function(){
		return React.DOM.span({}, DailyProductionLeftSide({data: this.props.data}), 
			DailyProductionRightSide({data: this.props.data}));
	}
});

var DailyProductionLeftSide = React.createClass({
	render: function() {
		return React.DOM.div({
			className: 'statistics-headings',
			id: 'stats-report-heading'
		},
		React.DOM.div({
			className: 'scrollable',
			id: 'stats-report-heading-scroll'
		}, DailyProductionListDemographics({
			data: this.props.data
		})));
	}
});

var DailyProductionListDemographics = React.createClass({
	render: function(){
		return React.DOM.ul({
			className: 'wrapper'
		},
		React.DOM.li({
			className: 'main-heading action-row'
		},
		React.DOM.div({
			className: 'switch-button disabled on'
		}),
		React.DOM.div({
			className: 'switch-button disabled on'
		})),
		_.map(this.props.data, function(row, index){
			var listItem = React.DOM.em({}, row.displayLabel);
			if(row.showInBold) {
				listItem = React.DOM.strong({}, row.displayLabel);
			}
			return React.DOM.li({}, listItem);
		}));
	}
});

var DailyProductionRightSide = React.createClass({
	render: function() {
		return React.DOM.div({
			id: 'stats-report-content',
			className: 'statistics-content scrollable'
		},
		React.DOM.div({
			className: 'wrapper'
		}, DailyProductionByDemographicsTable({data: this.props.data})));
	}
});

var DailyProductionByDemographicsTable = React.createClass({
	render: function(){
		return React.DOM.table({
			className: 'statistics-reports'
		}, DailyProductionByDemographicsTableRows({data: this.props.data}));
	}
});

var DailyProductionByDemographicsTableRows = React.createClass({
	render: function() {
		var rows = _.map(this.props.data, function(row, index){
			return React.DOM.tr({}, _.map(row.valueList, function(colData, index){
				var className = '';
				if((index+1) % 5 === 0){
					className = 'day-end';
				}
				return React.DOM.td({className: className}, colData);
			}));
		});
		return React.DOM.tbody({}, rows);
	}
});

var DailyProductionByDemographicsTableHeader = React.createClass({
	render: function(){
		var dates = _.map(this.props.data, function(row, index){
			return "fs";
		});

		return React.DOM.thead({}, React.DOM.tr({}, dates));
	}
});

