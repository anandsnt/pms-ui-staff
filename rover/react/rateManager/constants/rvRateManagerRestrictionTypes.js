const RateManagerRestrictionTypes = {
	/*
	 restrictionTypeName: {
	 	className: classNameList,
	 	description: description,
	 	defaultText: defaultText
	 }
	*/
	'CLOSED': {
		className: 'restriction-icon bg-red icon-cross',
		description: 'Closed',
		defaultText: ''
	},
	'CLOSED_TO_ARRIVAL': {
		className: 'restriction-icon bg-red icon-block',
		description: 'Closed to Arrival',
		defaultText: ''
	},
	'CLOSED_TO_DEPARTURE': {
		className: 'restriction-icon bg-red icon-cross',
		description: 'Closed to Departure',
		defaultText: ''
	},
	'MIN_LENGTH_OF_STAY': {
		className: 'restriction-icon bg-blue',
		description: 'Min Length of Stay',
		defaultText: ''
	},
	'MAX_LENGTH_OF_STAY': {
		className: 'restriction-icon',
		description: 'Max Length of Stay',
		defaultText: ''
	},
	'MIN_STAY_THROUGH': {
		className: 'restriction-icon bg-violet',
		description: 'Min Stay Through',
		defaultText: ''
	},
	'MIN_ADVANCE_BOOKING': {
		className: 'restriction-icon bg-green',
		description: 'Min Advance Booking',
		defaultText: ''
	},
	'MAX_ADVANCE_BOOKING': {
		className: 'restriction-icon',
		description: 'Max Advance Booking',
		defaultText: ''
	},
	'HAS_RESTRICTIONS': {
		className: 'restriction-icon bg-drk R',
		description: 'Has Restrictions',
		defaultText: 'R'
	}		
};