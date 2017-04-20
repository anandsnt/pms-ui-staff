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
					address = {item.address}
					contractLabel = {item.contractLabel}
					contractClass = {item.contractClass}
					showRightSpan = {item.showRightSpan}
					rightSpanClassName = {item.rightSpanClassName}
					accountName={item.accountName}
					showIndicator={item.showIndicator}/>
			)			
		}
	</tbody>
)