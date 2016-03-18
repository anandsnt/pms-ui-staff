const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftRowsContainerProps = (state) => {
  return {
    list: state.list
  };
};

const mapDispatchToRateManagerGridLeftRowsContainerProps = (dispatch) => {
  return {      
  }
};

const RateManagerGridLeftRowsContainer = connect(
  mapStateToRateManagerGridLeftRowsContainerProps, 
  mapDispatchToRateManagerGridLeftRowsContainerProps
)(RateManagerGridLeftRowsComponent);