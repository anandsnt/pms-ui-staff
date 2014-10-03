function Model(params) {
	var defDec = function(val) {
		return {
			enumerable: true,
			writable: true,
			value: val
		};
	},
	hop = Object.prototype.hasOwnProperty;

	if(!(this instanceof Model)) {
		return new Model(params);
	}

	Object.defineProperties(this, {
		isUpdating: defDec(false),
		isResolved: defDec(false),
		isDirty: defDec(false)		
	});

	for(var k in params) {
		if(hop.call(params, k)) {
			this[k] = params[k];
		}
	}
}

Model.prototype = {
	constructor: Model,
	reset: function() {
		this.isUpdating = false;
		this.isResolved = false;
		this.isDirty = false;
	}
};

if(typeof Date.prototype.toComponents === 'undefined') {
	Date.prototype.toComponents = function() {
		var __DAYS = ['Monday', 
					  'Tuesday', 
					  'Wednesday', 
					  'Thursday', 
					  'Friday', 
					  'Saturday', 
					  'Sunday'],
			__MONTHS = ['January',
						'February',
						'March',
						'April',
						'May',
						'June',
						'July',
						'August',
						'September',
						'October',
						'November',
						'December'];

		return {
			date: {
				day: this.getDate(),
				weekday: __DAYS[this.getDay()],
				month: this.getMonth(),
				monthName: __MONTHS[this.getMonth()],
				year: this.getFullYear()
			},
			time: {
				milliseconds: this.getMilliseconds(),
				seconds: this.getSeconds(),
				minutes: this.getMinutes(),
				hours: this.getHours()
			}
		};
	};
}

if(typeof Time === 'undefined') {
	function Time(obj) {
		if(!(this instanceof Time)) {
			return new Time(obj);
		}

		obj = (function(val) {
			var cnv = {};

			if(val.toFixed) {
				cnv.milliseconds = val % 1000;
				cnv.seconds = Math.floor(val / 1000);
				cnv.minutes =  Math.floor(val / 60000);
				cnv.hours = Math.floor(val / 3600000);

				return cnv;
			}

			return val;
		})(obj);

		(function(time_params) { 			 
			var defaultDesc = function(val) {
				return {
					enumerable: true,
					writable: true,
					value: val
				};
			};

			Object.defineProperties(this, {
				milliseconds: defaultDesc(time_params.milliseconds || 0),
				seconds: defaultDesc(time_params.seconds || 0),
				minutes: defaultDesc(time_params.minutes || 0),
				hours: defaultDesc(time_params.hours || 0)
			});			
		}).call(this, obj);
	}

	Time.prototype = {
		constructor: Time,
		getOffsetFromReference: function(reference_time) {
			var sec_delta;

			if(reference_time instanceof Time) {
				sec_delta = this.getTotalMilliseconds() - reference_time.getTotalMilliseconds();
			} else {
				throw new Error('invalid parameter');
			}

			return sec_delta;
		},
		getTotalMilliseconds: function() {
			return (this.hours * 360 + this.minutes * 6 + this.seconds) * 10000 + this.milliseconds;
		},
		convertMillisecondsToTime: function(ms) {
			return new Time(ms);
		}
	};
}

	function Observer() {
		this.events = Object.create(null);
	};

	Observer.prototype = {
		observe: function observe(event, action, context) {
			if(!ns.has(this.events, event)) {
				this.events[event] = [];			
			}	
			
			this.events[event].push({ action: action, context: context || this});
		},
		trigger: function trigger(event, data) {
			var e;
			if(ns.has(this.events, event)) {
				for(var i = 0, len = this.events[event].length; i < len; i += 1) {
					e = this.events[event][i];					
					e.action.call(e.context, data);
				}
			}
		},
		clear: function clear(event) {
			if(ns.has(this.events, event)) {
				this.events[event] = [];
			}
		},
		constructor: Observer
	};