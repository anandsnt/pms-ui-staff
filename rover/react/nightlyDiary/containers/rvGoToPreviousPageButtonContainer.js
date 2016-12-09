const {connect} = ReactRedux;
const mapStateToNightlyDiaryGoToPreviousPageButtonContainerProps = (state) => (
{
    goToPrev: state.callBackFromAngular.goToPrevPage,
    perPage: state.paginationData.perPage
});

const mapDispatchToNightlyDiaryGoToPreviousPageButtonContainer = (stateProps) => {
    var  goToPrevButtonClicked = () => {};
    
    goToPrevButtonClicked = () => {
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