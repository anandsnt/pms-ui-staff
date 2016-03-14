const RateManagerCalendarLeftSideListing = () => ( 
	<div className='pinnedLeft'>
		<table className='rate-calendar'>
			<thead>
				<tr>
	                <th className='cell'>
	                    <button className='button rm-buttonOpenClose grey'> 
	                        Open All
	                    </button>
	                    
	                    <button className='button rm-buttonOpenClose red'> 
	                        Close All
	                    </button>
	                </th>
	            </tr>
			</thead>
			<tbody>
	            <tr className="cell rate">
	            	<td className="first-row force-align">
	            		<span className="name bolder" ng-show="activeToggleButton == 'Rates'">All Rates</span>
	            		<span className="name bolder ng-hide" ng-show="activeToggleButton != 'Rates'">All Room Types</span>
	            	</td>
	            </tr>
	            <tr className="cell rate ng-scope">
	                <td className="first-row force-align">
	                    <a title="Corporate Rate" ng-click="goToRoomTypeCalendarView(rate)">
	                        <span className="name ng-binding" ng-className="{'gray': rateIsChild(rate) == true &amp;&amp; ratesRoomsToggle !== 'ROOMS'}" title="Corporate Rate">
	                        	<span ng-show="rateIsChild(rate) != true" className="base-rate-indicator">B</span>
	                        	Corporate Rate
	                        </span>
	                        <span ng-hide="hideRoomsDownArrow" className="icons icon-double-arrow rotate-right"></span> 
	                    </a>
	                </td>
	            </tr>
			</tbody>			
		</table>
	</div>
);