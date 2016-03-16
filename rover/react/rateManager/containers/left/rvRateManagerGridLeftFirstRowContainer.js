const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftFirstRowComponentProps = (state) => {
  
  var textMappings = {
  	'RATE_VIEW': 'All Rates',
  	'ROOM_TYPE_VIEW': 'All Room Types'
  };
  
  return {
    text: textMappings[state.mode]
  }
};

const RateManagerGridLeftFirstRowContainer = connect(
  mapStateToRateManagerGridLeftFirstRowComponentProps
)(RateManagerGridLeftFirstRowComponent);