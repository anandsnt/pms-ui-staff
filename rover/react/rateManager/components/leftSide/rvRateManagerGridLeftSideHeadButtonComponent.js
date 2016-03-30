const RateManagerGridLeftSideHeadButtonComponent = ({ 
	openAllClass, 
	closeAllClass, 
	openAllEnabled,
	closeAllEnabled,
	onOpenAllClick,
	onCloseAllClick,
	showOpenAll,
	showCloseAll
	}) => (
	<thead>
		<tr>
	        <th className='cell'> 
	         {
	         	showOpenAll ? 
	          
	            (<button disabled={!openAllEnabled} onClick = {(e) => onOpenAllClick(e)} 
	            	className={'button rm-buttonOpenClose ' + openAllClass}> 
	                Open All
	            </button>)
	            :
	            ''
	         }
	         {
	         	showOpenAll ? 
	            (<button disabled={!closeAllEnabled} onClick = {(e) => onCloseAllClick(e)} 
	            	className={'button rm-buttonOpenClose ' + closeAllClass}> 
	                Close All
	            </button>)
	            :
	            ''
	         }
	        </th>
	    </tr>
	</thead>
)