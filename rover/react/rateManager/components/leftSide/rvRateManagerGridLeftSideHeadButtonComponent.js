const RateManagerGridLeftSideHeadButtonComponent = ({ 
	openAllClass, 
	closeAllClass, 
	openAllEnabled,
	closeAllEnabled,
	onOpenAllClick,
	onCloseAllClick 
	}) => (
	<thead>
		<tr>
	        <th className='cell'>        
	            <button disabled={!openAllEnabled} onClick = {(e) => onOpenAllClick(e)} 
	            	className={'button rm-buttonOpenClose ' + openAllClass}> 
	                Open All
	            </button>
	            <button disabled={!closeAllEnabled} onClick = {(e) => onCloseAllClick(e)} 
	            	className={'button rm-buttonOpenClose ' + closeAllClass}> 
	                Close All
	            </button>
	        </th>
	    </tr>
	</thead>
)