const {connect} = ReactRedux;

// Utility function to calculate next page item count
const calculateNextPageItemCount = (state) => {
    var totalPage = Math.ceil(state.paginationData.total_count / state.paginationData.per_page);

    if (state.paginationData.page === totalPage - 1) {
        return state.paginationData.total_count % state.paginationData.per_page;
    }
    return state.paginationData.per_page;
};

const mapStateToNightlyDiaryGoToNextPageButtonContainerProps = (state) => ({
    goToNext: state.callBackFromAngular.goToNextPage,
    nextPageItemCount: calculateNextPageItemCount(state)
});

const mapDispatchToNightlyDiaryGoToNextPageButtonContainer = (stateProps) => {
    var goToNextButtonClicked = () => {};

    goToNextButtonClicked = () => {
        return stateProps.goToNext();
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