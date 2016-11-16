const {connect} = ReactRedux;
const mapStateToNightlyDiaryGoToPreviousPageButtonContainerProps = (state) => (
{
    goToPrev : state.callBackFromAngular.goToPrevPage,
    perPage :state.paginationData.per_page
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
};

const GoToPreviousPageButtonContainer = connect(
  mapStateToNightlyDiaryGoToPreviousPageButtonContainerProps,
  null,
  mapDispatchToNightlyDiaryGoToPreviousPageButtonContainer
)(GoToPreviousPageButtonComponent);