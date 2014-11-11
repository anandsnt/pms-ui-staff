sntRover
	.factory('rvDiaryCollection', ['rvDiaryUtil',
	function(util) {
		var slice 	= Array.prototype.slice,
			has 	= Object.prototype.hasOwnProperty,
			define 	= Object.defineProperty,
			create 	= Object.create,
			weakMap = create.bind(null);

		/*Custom Base Array
		   Uses internal dictionary for constant time look ups
		   by generating GUID for each push item.  Includes deep
		   cloning prototype method;  Inherits from Array and 
		   the test equality Collection instanceof Array is true
		*/
		function Collection() {
			var args = slice.call(arguments),
				def = define.bind(this);

			if (!(this instanceof Collection)) {
				return new Collection(args);
			}

			Array.apply(this, args);

			def('__hdict', { value: create(null) });
			def('__index', { value: create(null) });
		}

		Collection.prototype = Object.create(Array.prototype);
		Collection.prototype.iterator = function() {
			var _itr_cur = -1,
				_itr_end = this.length - 1;

			return {
				hasNext: function() {
					return (_itr_cur < _itr_end);
				},
				prev: function() {
					if (_itr_cur > 0) {
						return (--_itr_cur === 0);
					}
				},
				next: function() {
					if (_itr_cur < _itr_end) {
						return (++_itr_cur < _itr_end);
					}
				},
				current: function() {
					return this[_itr_cur];
				}
			};
		};

		Collection.prototype.clone = function() {
			return Simplex.prototype.call(this);
		};

		Collection.prototype.push = function(hash_id, data) {
			var len = this.length;

			if (!isNumber(hash_id)) {
				this._indexMap[hash_id] = {
					idx: cur_len
				};
				this._hashMap[cur_len] = hash_id;
			}

			Object.getPrototypeOf(Collection.prototype).push.call(this, data);
		};

		Collection.prototype.pop = function() {
			var cur_len = this.length - 1,
				hash_id;

			if (Object.prototype.hasOwnProperty.call(this._hashMap, cur_len)) {
				hash_id = this._hashMap[cur_len];
				delete this._hashMap[cur_len];
				delete this._indexMap[hash_id];
			}

			Object.getPrototypeOf(Collection.prototype).pop.call(this);
		};

		Collection.prototype.hashKeys = function() {
			var keys = [];

			Object.keys(this).forEach(function(item) {
				if (item !== 'length' &&
					/^\d*$/.test(item)) {
					keys.push(item);
				}
			});

			return keys;
		};

		Collection.prototype.constructor = Collection;

		/* Simplex is the analogue of the native Object 
		   but with more powerful feature which will include 
		   computed property specifiers and observes on the objects
		   own properties. */
		function Simplex() {
			var args = Array.prototype.call(arguments),
				def = Object.defineProperty.bind(this);

			if (!(this instanceof Node)) {
				return new Simplex(args);
			}

			def('__map', weakMap());
		}

		Simplex.prototype = create(null, {
			constructor: {
				value: Simplex
			},
			copy: {
				value: util.shallowCopy(weakMap(), this)
			},
			clone: {
				value: util.deepCopy(this)
			},
			mixin: {
				value: function() {
					var objs = Array.prototype.call(arguments),
						current = objs.pop(),
						next;

					while ((next = objs.pop())) {
						for (var k in Object.getOwnPropertyNames(current)) {
							next[k] = current[k];
						}
					}
				}
			},
			get: {
				value: function(field) {
					return this[field];
				}
			}
		});


		function SortedList() {
			var args = slice.call(arguments),
				def = define.bind(this),
				comparisonFn = args.pop();

			if (!(this instanceof SortedList)) {
				return new SortedList(args);
			}

			Collection.apply(this, args);	

			def('__head', { value: Node() });

			if(args instanceof Array) {
				(function() { 
					var cur = this.__head;
						
					args.forEach(function(item) {
						if(comparisonFn(cur, item)) {
							cur.next = Node(item);
							cur = cur.next;
						}
					});
				})();
			}

			function Node() {
				var args = slice.call(arguments),
					def = define.bind(this);

				if (!(this instanceof Node)) {
					return new Node(args);
				}

				def('data', { value: undefined });
				def('next', { value: null });
			}
		}

		return {
			Simplex: Simplex,
			Collection: Collection,
			SortedList: SortedList
		};
}]);