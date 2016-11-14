const {connect} = ReactRedux;

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
const getPrevPageButtonStatus = function(state){
	if(state.paginationData.page === 1){
		return false;
	}else{
		return true;
	}
};

const getClassForRootDiv = function(state){
	if(getNextPageButtonStatus(state)&&getPrevPageButtonStatus(state)){
		return 'grid-content scrollable dual-pagination';
	}else if(getPrevPageButtonStatus(state)){
		return 'grid-content scrollable top-pagination';
	}else{
		return 'grid-content scrollable bottom-pagination';
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