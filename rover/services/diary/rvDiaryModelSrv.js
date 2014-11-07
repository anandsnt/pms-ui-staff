sntRover
.factory('rvDiaryModelSrv', ['$q', 
	function($q) {
		var slice = Array.prototype.slice,
			hops = Object.prototype.hasOwnProperty;

		function RunLoop() {
			this.queue = [];
		}

		function Observer() {
			this.events = Object.create(null);
		}

		Observer.prototype = {
			observe: function(event, action, context) {
				if(!_.has(this.events, event)) {
					this.events[event] = [];			
				}	
				
				this.events[event].push({ 
					action: action, 
					context: context || this
				});
			},
			notify: function(event, data) {
				var e;
				if(_.has(this.events, event)) {
					for(var i = 0, len = this.events[event].length; i < len; i += 1) {
						e = this.events[event][i];					
						e.action.call(e.context, data);
					}
				}
			},
			clear: function(event) {
				if(_.has(this.events, event)) {
					this.events[event] = [];
				}
			},
			constructor: Observer
		};

		function Model() {
			var define = function(field, val) {
					Object.defineProperty(this, field, { value: val });
				},
				internal_hash = Object.create(null);

			if(!(this instanceof Model)) {
				return new Model(_.object(slice.call(arguments), _.range(arguments.length)));
			}
		}

		Model.prototype = Object.create(Observer.prototype);
		Model.prototype.constructor = Model;
		Model.prototype.set = function(field, val) {

		};

		Model.prototype.get = function(field) {

		};

		Model.prototype.copy = function() {

		};

		Model.prototype.deepCopy = function() {
			newRes = {};

			for(var k in obj) {
				if(hops.call(obj, k)) {
					if(obj[k] instanceof Date) {
						newRes[k] = new Date(obj[k].getTime());
					} else if(_.isArray(obj[k])) {
						newRes[k] = copyArray(obj[k]);
					} else if(_.isObject(obj[k])) {
						newRes[k] = deepCopy(obj[k]);
					} else {
						newRes[k] = obj[k];
					}
				}
			}

			return newRes;
		};
		Model.prototype.copyArray = function(arr) {
			var cur;

    		dest = [];

    		for(var i = 0, len = src.length; i < len; i++) {
    			cur = src[i];
    			dest.push(deepCopy(cur));
    		}

    		return dest;
		};

		Model.prototype.mixin = function(obj) {

		};	
	}
]);