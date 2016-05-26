const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftFirstRowComponentProps = (state) => {
  return {
    text: RM_RX_CONST.VIEW_MODE_TEXT_MAPPINGS[state.mode]
  }
};

const RateManagerGridLeftFirstRowContainer = connect(
  mapStateToRateManagerGridLeftFirstRowComponentProps
)(RateManagerGridLeftFirstRowComponent);