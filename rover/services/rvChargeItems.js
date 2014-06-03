sntRover.service('rvChargeItems',
	[
		'$q',
		'RVBaseWebSrv',
		function($q, RVBaseWebSrv) {

			// will hold all values fetched from server
			this.fetchedItems = {};

			// will hold the current chosen group
			this.currentGroup = '';

			// will update the currentGroup value
			this.setGroup = function(value) {
				this.currentGroup = value;
			};
			
			// fetch and return data from server
			this.fetch = function(reservation_id) {
				var deferred = $q.defer();
				var url =  '/staff/items/' + reservation_id + '/get_items.json';

				// if we have fetched items previously
				if (this.fetchedItems.length) {
					deferred.resolve(this.fetchedItems);
					return deferred.promise;
				};

				// else fetch the items
				RVBaseWebSrv.getJSON(url)
					.then(function(data) {

						// we are gonna do some things here
						// that will help with filtering the items
						for (var i = 0, j = data.items.length; i < j; i++) {
							var item = data.items[i];
							
							// lets show this item
							item.show = true;

							// lets show chosen count
							item.show_count = false;
						};

						// keep the data fetched once safe on FE
						this.fetchedItems = data;

						deferred.resolve(data);
					},function(data){
						deferred.reject(data);
					});

				return deferred.promise;
			}.bind(this);

			this.postCharges = function() {
				var url = '/staff/items/post_items_to_bill';

				// RVBaseWebSrv.postJSON(url, params)
			};
		}
	]
);