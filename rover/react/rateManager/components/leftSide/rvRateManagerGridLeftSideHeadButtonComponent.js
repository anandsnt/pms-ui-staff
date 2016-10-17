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
	<div className='pinnedLeft-actions'> 
         <div className="switch-button">
            <input id="rate-toggle" value="" type="checkbox" checked="checked"></input>
            { true?(<label className="data-off">
                <span className="value">Rate</span>
                <span className="switch-icon">Contract Details</span>
            </label>):''
            }
            {                
            false?(<label className="data-on">
                <span className="switch-icon">Rate</span>
                <span className="value">Contract Details</span>
            </label>):''
            }            
        </div>
	</div>
)