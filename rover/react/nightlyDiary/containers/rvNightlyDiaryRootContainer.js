const {connect} = ReactRedux;
/**
 * utility method to get visibility status of Next Button
* @return {Bool} visibility status of next Button
*/
const getNextPageButtonStatus = function(state){
	var total_count = state.paginationData.total_count,
	per_page = state.paginationData.per_page,
	page = state.paginationData.page;
	if((per_page*page) < total_count){
		return true;
	}else{
		return false;
	}
};
/**
 * utility method to get visibility status of Prev Button
* @return {Bool} visibility status of Prev Button
*/
const getPrevPageButtonStatus = function(state){
	if(state.paginationData.page === 1){
		return false;
	}else{
		return true;
	}
};
/**
 * utility method to get class for grid content
* @return {String} classnames
*/
const getClassForRootDiv = function(state){
	if(getNextPageButtonStatus(state)&&getPrevPageButtonStatus(state)){
		return 'grid-content scrollable dual-pagination';
	}else if(getPrevPageButtonStatus(state)){
		return 'grid-content scrollable top-pagination';
	}else if(getNextPageButtonStatus(state)){
		return 'grid-content scrollable bottom-pagination';
	}else{
		return 'grid-content scrollable';
	}
};

const mapStateToNightlyDiaryRootContainerProps = (state) => ({
    showNextPageButton		: getNextPageButtonStatus(state),
    showPrevPageButton		: getPrevPageButtonStatus(state),
    ClassForRootDiv       	: getClassForRootDiv(state)
});

const NightlyDiaryRootContainer = connect(
  mapStateToNightlyDiaryRootContainerProps
)(NightlyDiaryRootComponent);