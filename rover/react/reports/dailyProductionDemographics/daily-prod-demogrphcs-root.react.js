//React.initializeTouchEvents(true);

var DailyProductionByDemographics = React.createClass({
  toggleRevenue: function() {
    var curHeadr 			= this.state.header;
    curHeadr.showRevenue 	= !curHeadr.showRevenue;
    if (!curHeadr.showRevenue) {
      curHeadr.colspan = 2;
      curHeadr.showAvailable = true; //show revnue & show availability are mutulay exclusive
    } else {
      curHeadr.colspan = curHeadr.colspan + 3;
    }
    this.props.startedRendering();
    setTimeout(function() {
      this.setState({
        header: curHeadr
      });
    }.bind(this), 20);
  },

  toggleAvailability: function() {
    var curHeadr 			= this.state.header;
    curHeadr.showAvailable 	= !curHeadr.showAvailable;
    if (!curHeadr.showAvailable) {
      curHeadr.colspan = 3;
      curHeadr.showRevenue = true; //show revnue & show availability are mutulay exclusive
    } else {
      curHeadr.colspan = curHeadr.colspan + 2;
    }
    this.props.startedRendering();
    setTimeout(function() {
      this.setState({
        header: curHeadr
      });
    }.bind(this), 20);

  },

  componentWillReceiveProps: function(nextProps) {
    //only data will change from parent, we will reset ui fiter selection once we have new data
    var newState 	= {};
    newState.data 	= nextProps.data;
    newState.header = this.getInitialState().header;
    this.props.startedRendering();
    setTimeout(function() {
      this.setState(newState);
    }.bind(this), 50);
  },

  getInitialState: function() {
    var headerProps = {
      colspan 		: 5,
      showAvailable : true,
      showRevenue 	: true
    };
    var state = {
      data 	 : this.props.data,
      header : headerProps,
      scroll : {
        left : null,
        right: null
      },
      toggleRevenue 		: this.toggleRevenue,
      toggleAvailability 	: this.toggleAvailability
    };
    return state;
  },

  componentDidMount: function() {
    var leftSc 	= this.state.scroll.left,
    rightSc	= this.state.scroll.right;

    leftSc.on('scroll', function() {
      rightSc.scrollTo(rightSc.x, leftSc.y);
    });

    rightSc.on('scroll', function() {
      leftSc.scrollTo(leftSc.x, rightSc.y);
    });

    this.props.completedRendering();
  },

  componentDidUpdate: function() {
    this.props.completedUpdating();
    var leftSc 	= this.state.scroll.left,
    rightSc	= this.state.scroll.right;
    leftSc.scrollTo(0, 0);
    rightSc.scrollTo(0, 0);
  },

  componentWillUnmount: function() {
    var leftSc 	= this.state.scroll.left,
    rightSc	= this.state.scroll.right;

    leftSc.off('scroll');
    rightSc.off('scroll');
    leftSc.destroy();
    rightSc.destroy();
  },

  render: function() {
    return React.DOM.span({}, React.createElement(DailyProductionLeftSide, this.state),
			React.createElement(DailyProductionRightSide, this.state));
  }
});
