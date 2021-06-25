const RateManagerGridLeftSideHeadButtonComponent = ({
	shouldShowPagination,
    goToPrevPage,
    goToNextPage,
    isFirstPage,
    isLastPage,
    prevPageButtonText,
    nextPageButtonText
	}) => (
	<div className='pinnedLeft-actions'>
        {shouldShowPagination ? 
            <div>
                {isFirstPage ? '' : 
                    (<button className="button blue prev"
                        onTouchEnd={(e) => {
                            e.stopPropagation();
                            goToPrevPage(e);
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPrevPage(e);
                        }}>
                        {prevPageButtonText}
                    </button>)
                }
                {isLastPage ? '' :
                    (<button className="button blue next"
                        onTouchEnd={(e) => {
                            e.stopPropagation();
                            goToNextPage(e);
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNextPage(e);
                        }}>
                        {nextPageButtonText}
                    </button>)
                } 
            </div>
            : ''
        }
	</div>
)