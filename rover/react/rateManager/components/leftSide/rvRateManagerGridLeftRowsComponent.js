const RateManagerGridLeftRowsComponent = ({ leftListingData, onItemClick, onItemClickActionType }) => (
	
	<tbody>
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
					showRightSpan = {item.showRightSpan}
					rightSpanClassName = {item.rightSpanClassName}
					showIndicator={item.showIndicator}/>
			)			
		}
	</tbody>
)