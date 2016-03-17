const {connect} = ReactRedux;

const mapStateToRateManagerLeftSideHeadButtonContainerProps = (state) => {
  return {
    openAllClass: 'green',
    closeAllClass: 'red'
  }
};

const mapDispatchToRateManagerLeftSideHeadButtonContainerProps = (dispatch) => {
  return {
        onOpenAllClick: (e) => {
        	e.preventDefault();
            dispatch({
                type: 'CLICKED_ON_OPEN_ALL_BUTTON'
            });
        },
        onCloseAllClick: (e) => {
        	e.preventDefault();
            dispatch({
                type: 'CLICKED_ON_CLOSE_ALL_BUTTON'
            });
        }        
  }
};

const RateManagerLeftSideHeadButtonContainer = connect(
  mapStateToRateManagerLeftSideHeadButtonContainerProps, 
  mapDispatchToRateManagerLeftSideHeadButtonContainerProps
)(RateManagerLeftSideHeadButtonComponent);