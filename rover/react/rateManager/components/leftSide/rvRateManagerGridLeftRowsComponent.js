const RateManagerGridLeftRowsComponent = ({ list }) => (
	
	<tbody>
		<RateManagerGridLeftFirstRowContainer/>
		{
			list.map((item, index) => 
				<RateManagerGridLeftRowComponent
					key = {item.id}
					id = {item.id}
					trClassName = {item.trClassName}
					tdClassName = {item.tdClassName}
					onClick = {(e) => { console.log('asdasda'); }}
					leftSpanClassName = {item.leftSpanClassName}
					showIconBeforeText = {item.showIconBeforeText}
					iconClassBeforeText = {item.iconClassBeforeText}
					textInIconArea = {item.textInIconArea}
					leftSpanText = {item.leftSpanText}
					showRightSpan = {item.showRightSpan}
					rightSpanClassName = {item.rightSpanClassName}/>
			)			
		}		
	</tbody>
)