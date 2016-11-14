const {connect} = ReactRedux;
const mapStateToNightlyDiaryGoToPreviousPageButtonContainerProps = (state) => (
{
    goToPrev: state.callBackFromAngular.goToPrevPage
});

const mapDispatchToNightlyDiaryGoToPreviousPageButtonContainer = (stateProps, dispatchProps, ownProps) => {
    var  goToPrevButtonClicked= () => {};
    goToPrevButtonClicked = (e) => {
        return stateProps.goToPrev();
        };
    return {
        goToPrevButtonClicked,
        ...stateProps
    };
}

const GoToPreviousPageButtonContainer = connect(
  mapStateToNightlyDiaryGoToPreviousPageButtonContainerProps,
  null,
  mapDispatchToNightlyDiaryGoToPreviousPageButtonContainer
)(GoToPreviousPageButtonComponent);