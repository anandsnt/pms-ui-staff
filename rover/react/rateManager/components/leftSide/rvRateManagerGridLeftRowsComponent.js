const RateManagerGridLeftRowsComponent = ({ leftListingData, onItemClick, onItemClickActionType, goToPrevPage, goToNextPage }) => (
	
	<tbody>
		<tr className="cell rate loader">
	        <td>        
	           <button type="button" 
	           		className="button blue"
	           		onClick={(e) => { goToPrevPage(e); }}>
	               prev
	           </button>
	        </td>
	    </tr>
		{
			leftListingData.map((item, index) => 
				<RateManagerGridLeftRowComponent
					key = {item.id}
					index = {index}
					trClassName = {item.trClassName}
					tdClassName = {item.tdClassName}
					onClick = {(e, index) => { onItemClick(e, index); }}
					leftSpanClassName = {item.leftSpanClassName}
					showIconBeforeText = {item.showIconBeforeText}
					iconClassBeforeText = {item.iconClassBeforeText}
					textInIconArea = {item.textInIconArea}
					leftSpanText = {item.leftSpanText}
					showRightSpan = {item.showRightSpan}
					rightSpanClassName = {item.rightSpanClassName}/>
			)			
		}	

		<tr className="cell rate loader">
	        <td>
	           <button type="button" 
	           		className="button blue"
	           		onClick={(e) => { goToNextPage(e); }}>
	               next
	           </button>
	        </td>
	    </tr>	
	</tbody>
)