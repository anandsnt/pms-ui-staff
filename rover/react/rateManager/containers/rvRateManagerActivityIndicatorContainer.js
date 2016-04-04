const {connect} = ReactRedux;

const mapStateToRateManagerActivityIndicatorComponentProps = (state) => ({
    showLoader: (state.loader === RM_RX_CONST.ACTIVATE_LOADER)
});
const RateManagerActivityIndicatorContainer = connect(
  mapStateToRateManagerActivityIndicatorComponentProps
)(RateManagerActivityIndicatorComponent);