const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftFirstRowComponentProps = (state) => {
  return {
    expandedClass: (!!state.flags&&state.flags.showRateDetail)?'expanded':''
  }
};

const RateManagerGridLeftSideContainer = connect(
  mapStateToRateManagerGridLeftFirstRowComponentProps
)(RateManagerGridLeftSideComponent);