const RateManagerBottomRestrictionList = () => (
	<div className="pinned-bottom">
	    <ul className="restriction-legends">
	    {
	    	Object.keys(RateManagerRestrictionTypes).map( key => {
	    		var restrictionType = RateManagerRestrictionTypes[key];
	    		return <li>
	    			<RateManagerRestrictionIcon className={restrictionType.className} text={restrictionType.defaultText}/>
	    			<span>{restrictionType.description}</span>
	    		</li>
	    	})
	    }
	    </ul>
	</div>
);