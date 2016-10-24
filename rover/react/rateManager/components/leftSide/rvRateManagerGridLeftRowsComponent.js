const RateManagerGridLeftRowsComponent = ({ leftListingData, onItemClick, onItemClickActionType, goToPrevPage, goToNextPage, isFirstPage, isLastPage, topPageButtonText, bottomPageButtonText }) => (
	
	<tbody>
		{isFirstPage ? null :
			(<tr className="cell rate loader">
		        <td>        
		           <button type="button" 
		           		className="button blue"
		           		onTouchEnd={(e) => {e.stopPropagation(); goToPrevPage(e); }} onClick={(e) => {e.stopPropagation(); goToPrevPage(e); }}>
		               	{topPageButtonText}
		           </button>
		        </td>
			</tr>)
		}
		{
			leftListingData.map((item, index) => 
				<RateManagerGridLeftRowComponent
					key = {item.id}
					index = {index}
					name = {item.name}
					trClassName = {item.trClassName}
					tdClassName = {item.tdClassName}
					onClick = {(e, index) => { onItemClick(e, index); }}
					leftSpanClassName = {item.leftSpanClassName}
					showIconBeforeText = {item.showIconBeforeText}
					iconClassBeforeText = {item.iconClassBeforeText}
					textInIconArea = {item.textInIconArea}
					leftSpanText = {item.leftSpanText}
					address = {item.address}
					contractLabel = {item.contractLabel}
					contractClass = {item.contractClass}
					showRightSpan = {item.showRightSpan}
					rightSpanClassName = {item.rightSpanClassName}
					accountName={item.accountName}
					showIndicator={item.showIndicator}/>
			)			
		}	
		{isLastPage ? null :
			(<tr className="cell rate loader">
		        <td>
		           <button type="button" 
		           		className="button blue"
		           		onTouchEnd={(e) => {e.stopPropagation(); goToNextPage(e); }}
		           		onClick={(e) => { e.stopPropagation(); goToNextPage(e); }}>
		               	{bottomPageButtonText}
		           </button>
		        </td>
		    </tr>)	
		}
	</tbody>
)