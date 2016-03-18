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
            dispatch({
                type: RM_RX_CONST.OPEN_ALL
            });
        },
        onCloseAllClick: (e) => {
        	e.preventDefault();
            dispatch({
                type: RM_RX_CONST.CLOSE_ALL
            });
        }        
  }
};

const RateManagerGridLeftSideHeadButtonContainer = connect(
  mapStateToRateManagerGridLeftSideHeadButtonContainerProps, 
  mapDispatchToRateManagerGridLeftSideHeadButtonContainerProps
)(RateManagerGridLeftSideHeadButtonComponent);