var DiaryLib = window.DiaryLib || Object.create(null);

DiaryLib.Models = DiaryLib.Models || Object.create(null);
DiaryLib.Util = DiaryLib.Util || Object.create(null);

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

	Time.prototype.getOffsetFromReference = function(reference_time) {
		var sec_delta;

		if(reference_time instanceof Time) {
			sec_delta = this.getTotalMilliseconds() - reference_time.getTotalMilliseconds();
		} else {
			throw new Error('invalid parameter');
		}

		return sec_delta;
	};
	Time.prototype.getTotalMilliseconds = function() {
		return (this.hours * 360 + this.minutes * 6 + this.seconds) * 10000 + this.milliseconds;
	};
	Time.prototype.convertMillisecondsToTime = function(ms) {
		return new Time(ms);
	};
	Time.prototype.isAM = function() {
		return (this.hours < 12);
	};
	Time.prototype.AMPM = function() {
		return this.isAM() ? 'AM' : 'PM';
	};
	Time.prototype.toString = function(asAMPM) {
		var hours = (this.hours < 10) ? '0' + this.hours : this.hours, 
			min = (this.minutes < 10) ? '0' + this.minutes : this.minutes, 
			ampm = ''; // = ' ' + (this.hours > 11) ? 'PM' : 'AM';

		if(asAMPM) {
			hours = hours % 12;
			ampm = this.AMPM();
		}
		return this.hours + ':' + this.minutes + ampm;
	};

	Time.prototype.constructor = Time;

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
				year: this.getFullYear(),
				toDateString: function() {
					return this.year + '-' + (this.month+1) + '-' + (this.day.length < 2 ? '0' : '') + this.day;
				},
				fromDate: function() {
					var tmp = this.toLocaleDateString().replace(/\//g, '-').split('-').reverse();

					return tmp.shift() + '-' + temp.reverse().join('-');
				}
			},
			time: new Time({
				milliseconds: this.getMilliseconds(),
				seconds: this.getSeconds(),
				minutes: this.getMinutes(),
				hours: this.getHours()
			})
		};
	};
}