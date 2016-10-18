const RateManagerGridLeftSideHeadButtonComponent = ({ 
	openAllClass, 
	closeAllClass, 
	openAllEnabled,
	closeAllEnabled,
	onOpenAllClick,
	onCloseAllClick,
	showOpenAll,
	showCloseAll,
    shouldShowToggle,
    toggleClicked,
    flags,
    toggleClass
	}) => (
	<div className='pinnedLeft-actions'> 
         {shouldShowToggle?(<div className={toggleClass}>
            <input id="rate-toggle" value="" type="checkbox" checked="checked" onClick = {(e) => toggleClicked(e)} ></input>
            { flags.showRateDetail?(<label className="data-off">
                <span className="value">Rate</span>
                <span className="switch-icon">Contract Details</span>
            </label>):''
            }
            {!flags.showRateDetail?(<label className="data-on">
                <span className="switch-icon">Rate</span>
                <span className="value">Contract Details</span>
            </label>):''
            }            
        </div>):''}
	</div>
)