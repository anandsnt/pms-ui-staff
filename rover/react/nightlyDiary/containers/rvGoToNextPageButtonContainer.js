const {connect} = ReactRedux;
const mapStateToNightlyDiaryGoToNextPageButtonContainerProps = (state) => (
{
    goToNext: state.callBackFromAngular.goToNextPage
});

const mapDispatchToNightlyDiaryGoToNextPageButtonContainer = (stateProps, dispatchProps, ownProps) => {
    var  goToNextButtonClicked= () => {};
    goToNextButtonClicked = (e) => {
        return stateProps.goToNext();
        };
    return {
        goToNextButtonClicked,
        ...stateProps
    };
}

const GoToNextPageButtonContainer = connect(
  mapStateToNightlyDiaryGoToNextPageButtonContainerProps,
  null,
  mapDispatchToNightlyDiaryGoToNextPageButtonContainer
)(GoToNextPageButtonComponent);