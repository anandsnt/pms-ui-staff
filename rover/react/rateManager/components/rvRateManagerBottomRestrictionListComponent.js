const RateManagerBottomRestrictionListComponent = ({
	divClassNames,
	ulClassNames,
	restrictionTypes
}) => (
	<div className={divClassNames}>
	    <ul className={ulClassNames}>
	    {	restrictionTypes.map((restrictionType, index) => {
				return (
					<li key={'restriction-type-' + index}>
		    	  		<RateManagerRestrictionIconComponent 
		    	  			className={restrictionType.className}
		    	  			text={restrictionType.defaultText}/>
		    	  		<span>{restrictionType.description}</span>
		      		</li>
		      	);
	    	})
	    }
	    </ul>
	</div>
);
