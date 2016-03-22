const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftSideHeadButtonContainerProps = (state) => {
  return {
    openAllClass: 'green', //TODO: check the logic from actula cntl and change
    closeAllClass: 'red' //TODO: check the logic from actula cntl and change
  }
};

const mapDispatchToRateManagerGridLeftSideHeadButtonContainerProps = (dispatch) => {
  return {
        onOpenAllClick: (e) => {
        	e.preventDefault();
        },
        onCloseAllClick: (e) => {
        	e.preventDefault();
        }        
  }
};

const RateManagerGridLeftSideHeadButtonContainer = connect(
  mapStateToRateManagerGridLeftSideHeadButtonContainerProps, 
  mapDispatchToRateManagerGridLeftSideHeadButtonContainerProps
)(RateManagerGridLeftSideHeadButtonComponent);