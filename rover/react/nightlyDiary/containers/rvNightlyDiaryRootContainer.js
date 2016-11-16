const {connect} = ReactRedux;
/**
 * utility method to get visibility status of Next Button
* @return {Bool} visibility status of next Button
*/
const getNextPageButtonStatus = function(state) {
	var totalCount = state.paginationData.total_count,
	perPage = state.paginationData.per_page,
	page = state.paginationData.page;

	if ((perPage * page) < totalCount) {
		return true;
	} else {
		return false;
	}
};
/**
 * utility method to get visibility status of Prev Button
* @return {Bool} visibility status of Prev Button
*/
const getPrevPageButtonStatus = function(state) {
	if (state.paginationData.page === 1) {
		return false;
	} else {
		return true;
	}
};
/**
 * utility method to get class for grid content
* @return {String} classnames
*/
const getClassForRootDiv = function(state) {
	if (getNextPageButtonStatus(state)&&getPrevPageButtonStatus(state)) {
		return 'grid-content scrollable dual-pagination';
	} else if (getPrevPageButtonStatus(state)) {
		return 'grid-content scrollable top-pagination';
	} else if (getNextPageButtonStatus(state)) {
		return 'grid-content scrollable bottom-pagination';
	} else {
		return 'grid-content scrollable';
	}
};

const mapStateToNightlyDiaryRootContainerProps = (state) => ({
    showNextPageButton : getNextPageButtonStatus(state),
    showPrevPageButton : getPrevPageButtonStatus(state),
    ClassForRootDiv : getClassForRootDiv(state)
});

const mapDispatchToNightlyDiaryGoToPreviousPageButtonContainer = (stateProps, dispatchProps, ownProps) => {
    return stateProps;
}

const NightlyDiaryRootContainer = connect(
  mapStateToNightlyDiaryRootContainerProps,
  null,
  mapDispatchToNightlyDiaryGoToPreviousPageButtonContainer
)(NightlyDiaryRootComponent);