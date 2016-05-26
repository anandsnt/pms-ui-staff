var DailyProductionRightSide = React.createClass({
  componentDidMount: function() {
    $('#stats-report-content .wrapper')[0].style.width = (this.props.header.colspan * 110 * this.props.data.dates.length) + 'px';
    var scroll = this.props.scroll.right = new IScroll($('#stats-report-content')[0], {
      probeType: 3,
      scrollbars: 'custom',
      interactiveScrollbars: true,
      scrollX: true,
      scrollY: true,
      mouseWheel: true,
      useTransition: true
    });
    setTimeout(function() {
      scroll.refresh();
    }, 150);
  },
  componentDidUpdate: function() {
    $('#stats-report-content .wrapper')[0].style.width = (this.props.header.colspan * 110 * this.props.data.dates.length) + 'px';
    var scroll = this.props.scroll.right;
    setTimeout(function() {
      scroll.refresh();
    }, 150);
  },
  render: function() {
    return React.DOM.div({
      id      : 'stats-report-content',
      className   : 'statistics-content scrollable'
    },
  React.DOM.div({
      className: 'wrapper'
  }, React.createElement( DailyProductionByDemographicsTable, {data: this.props.data, header: this.props.header})));
  }
});
