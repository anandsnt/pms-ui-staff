const RateManagerGridLeftSideHeadButtonComponent = ({ 
	openAllClass, 
	closeAllClass, 
	onOpenAllClick,
	onCloseAllClick 
	}) => ( 
	<thead>
		<tr>
	        <th className='cell'>
	            <button onClick = {(e) => onOpenAllClick(e)} 
	            	className={'button rm-buttonOpenClose ' + openAllClass}> 
	                Open All
	            </button>
	            
	            <button onClick = {(e) => onCloseAllClick(e)} 
	            	className={'button rm-buttonOpenClose ' + closeAllClass}> 
	                Close All
	            </button>
	        </th>
	    </tr>
	</thead>
)