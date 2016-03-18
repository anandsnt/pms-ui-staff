const RateManagerRestrictionTypes = {
	/*
	 restrictionTypeName: {
	 	'className': 'className'List,

	 	'description': 'description',
	 	'defaultText': 'defaultText'
	 }
	*/
	'CLOSED': {
		'className': 'restriction-icon bg-red icon-cross',
		'description': 'Closed',
		'defaultText': ''
	},
	'CLOSED_ARRIVAL': {
		'className': 'restriction-icon bg-red icon-block',
		'description': 'Closed to Arrival',
		'defaultText': ''
	},
	'CLOSED_DEPARTURE': {
		'className': 'restriction-icon bg-red icon-cross',
		'description': 'Closed to Departure',
		'defaultText': ''
	},
	'MIN_STAY_LENGTH': {
		'className': 'restriction-icon bg-blue',
		'description': 'Min Length of Stay',
		'defaultText': ''
	},
	'MAX_STAY_LENGTH': {
		'className': 'restriction-icon',
		'description': 'Max Length of Stay',
		'defaultText': ''
	},
	'MIN_STAY_THROUGH': {
		'className': 'restriction-icon bg-violet',
		'description': 'Min Stay Through',
		'defaultText': ''
	},
	'MIN_ADV_BOOKING': {
		'className': 'restriction-icon bg-green',
		'description': 'Min Advance Booking',
		'defaultText': ''
	},
	'MAX_ADV_BOOKING': {
		'className': 'restriction-icon',
		'description': 'Max Advance Booking',
		'defaultText': ''
	},
	'MORE_RESTRICTIONS': {
		'className': 'restriction-icon bg-drk R',
		'description': RM_RX_CONST.MAX_RESTRICTION_IN_COLUMN + ' or more Restrictions',
		'defaultText': 'R'
	}		
};