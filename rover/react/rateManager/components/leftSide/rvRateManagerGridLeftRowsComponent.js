const RateManagerGridLeftRowsComponent = ({ list }) => (
	<tbody>
		<RateManagerGridLeftFirstRowContainer/>
		{
			list.map(item => 
				<RateManagerGridLeftRowComponent
				key = {item.id}
				id = {item.id} 
				onClick = {(e) => {
					console.log('asdasda');
				}}
				greyedOut = {item.greyedOut}
				iconClassBeforeText = {item.iconClassBeforeText}
				text = {item.name}
				showIconBeforeText = {item.showIconBeforeText}
				textInIconArea = {item.textInIconArea}
				showArrowIcon = {item.showArrowIcon}
				arrowDirection = {item.arrowDirection}/>
			)			
		}		
	</tbody>
)