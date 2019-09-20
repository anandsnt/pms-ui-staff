const {connect} = ReactRedux;

// Utility function to calculate next page item count
const calculateNextPageItemCount = (state) => {
    var totalPage = Math.ceil(state.paginationData.totalCount / state.paginationData.perPage);

    if (state.paginationData.page === totalPage - 1) {
        return state.paginationData.totalCount - (state.paginationData.perPage * state.paginationData.page);
    }
    return state.paginationData.perPage;
};

const mapStateToNightlyDiaryGoToNextPageButtonContainerProps = (state) => ({
    goToNextPage: state.callBackFromAngular.goToNextPage,
    nextPageItemCount: calculateNextPageItemCount(state)
});

const mapDispatchToNightlyDiaryGoToNextPageButtonContainer = (stateProps) => {
    var goToNextButtonClicked = () => {};

    goToNextButtonClicked = () => {
        return stateProps.goToNextPage();
    };
    return {
        goToNextButtonClicked,
        ...stateProps
    };
};

const GoToNextPageButtonContainer = connect(
  mapStateToNightlyDiaryGoToNextPageButtonContainerProps,
  null,
  mapDispatchToNightlyDiaryGoToNextPageButtonContainer
)(GoToNextPageButtonComponent);