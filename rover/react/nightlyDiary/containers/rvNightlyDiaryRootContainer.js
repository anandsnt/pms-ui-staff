const {connect} = ReactRedux;
/**
 * utility method to get visibility status of Next Button
* @return {Bool} visibility status of next Button
*/
const getNextPageButtonStatus = function(state) {
	var totalCount = state.paginationData.totalCount,
	perPage = state.paginationData.perPage,
	page = state.paginationData.page;

	if ((perPage * page) < totalCount) {
		return true;
	}
	return false;
};
/**
 * utility method to get visibility status of Prev Button
* @return {Bool} visibility status of Prev Button
*/
const getPrevPageButtonStatus = function(state) {
	if (state.paginationData.page === 1) {
		return false;
	}
	return true;
};
/**
 * utility method to get class for grid content
* @return {String} classnames
*/
const getClassForRootDiv = function(state) {
	if (getNextPageButtonStatus(state) && getPrevPageButtonStatus(state)) {
		return 'grid-content scrollable dual-pagination';
	} else if (getPrevPageButtonStatus(state)) {
		return 'grid-content scrollable top-pagination';
	} else if (getNextPageButtonStatus(state)) {
		return 'grid-content scrollable bottom-pagination';
	}
	return 'grid-content scrollable';
};
var getRoomIndex = function (selectedRoomId, roomsList) {   
    if (selectedRoomId) {
        for ( var i = 0; i <  roomsList.length; i++) {
            if (roomsList[i].id === selectedRoomId) {
                    return i;
                }
            }
        }
        return 0;
    };                

const mapStateToNightlyDiaryRootContainerProps = (state) => ({
    showNextPageButton: getNextPageButtonStatus(state),
    showPrevPageButton: getPrevPageButtonStatus(state),
    ClassForRootDiv: getClassForRootDiv(state),
    testValue: getRoomIndex(state.paginationData.selectedRoomId, state.roomsList),
    page: state.paginationData.page
});

const mapDispatchToNightlyDiaryGoToPreviousPageButtonContainer = (stateProps) => {
    return stateProps;
};

const NightlyDiaryRootContainer = connect(
  mapStateToNightlyDiaryRootContainerProps,
  null,
  mapDispatchToNightlyDiaryGoToPreviousPageButtonContainer
)(NightlyDiaryRootComponent);