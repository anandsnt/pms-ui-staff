sntRover
.factory('rvDiaryModelSrv', function() {
	var hops = Object.prototype.hasOwnProperty,
		slice = Array.prototype.slice;

	var set, get;

	set = function(field, val) {

	};

	get = function(field, val) {

	};
	
	function Collection() {
		if(!(this instanceof Collection)) {
			return new Collection()
		}

		Array.apply(this, args);
	}

	Collection.prototype = Object.create(Array.prototype);
	Collection.prototype.constructor = Collection;


});