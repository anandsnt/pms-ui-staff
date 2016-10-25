var DailyProductionByDemographicsTableHeader = React.createClass({
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },
	
    render: function() {
        var header = this.props.header,
            dateHeaderProp 	= {
                dataCell: 'colspan',
                colSpan: header.colspan
            },
            indvdlColumns = [
                React.DOM.th(
                    {
                        className: header.showAvailable ? '' : 'hidden',
                        style: { whiteSpace: 'nowrap' }
                    },
                    'Rooms Occ'
                ),

                React.DOM.th(
                    {
                        className: (header.showAvailable ? '' : 'hidden') + (!header.showRevenue ? ' day-end' : '')
                    },
                    'Rooms Available'
                ),

                React.DOM.th(
                    {
                        className: header.showRevenue ? '' : 'hidden'
                    },
                    'Forecast Room Revenue'
                ),

                React.DOM.th(
                    {
                        className: header.showRevenue ? '' : 'hidden'
                    },
                    'ADR'
                ),

                React.DOM.th(
                    {
                        className: header.showRevenue ? 'day-end' : 'hidden'
                    },
                    'Actual Room Revenue'
                )
            ],
            dates = [],
            indvdlColumnsWithinDateList = [];

        _.map(this.props.data.dates, function(row, index) {
            dates.push(React.DOM.th(dateHeaderProp, tzIndependentDate(row).toComponents().date.toShortDateString()));
            indvdlColumnsWithinDateList = indvdlColumnsWithinDateList.concat(indvdlColumns);
        });

        return React.DOM.thead({}, React.DOM.tr({}, dates), React.DOM.tr({className: 'bottom-row'}, indvdlColumnsWithinDateList));
    }
});
