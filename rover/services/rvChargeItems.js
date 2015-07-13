sntRover.service('RVChargeItems',
	[
		'$q',
		'RVBaseWebSrv',
		'rvBaseWebSrvV2',
		function($q, RVBaseWebSrv, rvBaseWebSrvV2) {

			// will hold all values fetched from server
			this.fetchedItems = {};

			// will hold the current chosen group
			this.currentGroup = '';

			// will update the currentGroup value
			this.setGroup = function(value) {
				this.currentGroup = value;
			};

			// fetch and return data from server
			this.fetchAllItems = function() {
				var deferred = $q.defer();
				var url =  '/staff/items/get_items.json';

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
						// and paying around numbers
						for (var i = 0, j = data.items.length; i < j; i++) {
							var item = data.items[i];

							// lets show this item
							item.show = true;

							// lets show chosen count
							item.count = 0;

							// parse string to float
							item.unit_price = parseFloat( item.unit_price );

							// parse string to int
							if ( !!item.charge_group_value && !isNaN(parseInt(item.charge_group_value)) ) {
								item.charge_group_value = parseInt( item.charge_group_value );
							};

							// parse string to boolean
							item.is_favorite = item.is_favorite === 'true' ? true : false;

							// to show the item as chosen charge item
							item.isChosen = false;

							// to show the modified price by user
							item.modifiedPrice = item.unit_price;

							// to keep track of price entered by user
							item.userEnteredPrice = '';
						};

						for (var i = 0, j = data.non_item_linked_charge_codes.length; i < j; i++) {
							var item = data.non_item_linked_charge_codes[i];

							// lets show this item
							item.show = true;

							// lets show chosen count
							item.count = 0;

							item.unit_price = parseFloat(0);

							// to show the item as chosen charge item
							item.isChosen = false;

							// to show the modified price by user
							item.modifiedPrice = item.unit_price;

							// to keep track of price entered by user
							item.userEnteredPrice = '';
						};

						for (var i = 0, j = data.charge_groups.length; i < j; i++) {
							var item = data.charge_groups[i];

							// parse string to int
							var intValue = parseInt( item.value );

							// only change if it was indeed a #
							if ( !isNaN(intValue) ) {
								item.value = intValue;
							};
						};

						// keep the data fetched once safe on FE
						this.fetchedItems = data;

						deferred.resolve(data);
					},function(data){
						deferred.reject(data);
					});

				return deferred.promise;
			}.bind(this);



			// fetch and return data from server
			this.fetch = function(reservation_id) {
				var deferred = $q.defer();
				//var url =  '/staff/items/' + reservation_id + '/get_items.json';
				var url =  '/staff/items/get_items.json';

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
						// and paying around numbers
						for (var i = 0, j = data.items.length; i < j; i++) {
							var item = data.items[i];

							// lets show this item
							item.show = true;

							// lets show chosen count
							item.count = 0;

							// parse string to float
							item.unit_price = parseFloat( item.unit_price );

							// parse string to int
							if ( !!item.charge_group_value && !isNaN(parseInt(item.charge_group_value)) ) {
								item.charge_group_value = parseInt( item.charge_group_value );
							};

							// parse string to boolean
							item.is_favorite = item.is_favorite === 'true' ? true : false;

							// to show the item as chosen charge item
							item.isChosen = false;

							// to show the modified price by user
							item.modifiedPrice = item.unit_price;

							// to keep track of price entered by user
							item.userEnteredPrice = '';
						};

						for (var i = 0, j = data.non_item_linked_charge_codes.length; i < j; i++) {
							var item = data.non_item_linked_charge_codes[i];

							// lets show this item
							item.show = true;

							// lets show chosen count
							item.count = 0;

							item.unit_price = parseFloat(0);

							// to show the item as chosen charge item
							item.isChosen = false;

							// to show the modified price by user
							item.modifiedPrice = item.unit_price;

							// to keep track of price entered by user
							item.userEnteredPrice = '';
						};

						for (var i = 0, j = data.charge_groups.length; i < j; i++) {
							var item = data.charge_groups[i];

							// parse string to int
							var intValue = parseInt( item.value );

							// only change if it was indeed a #
							if ( !isNaN(intValue) ) {
								item.value = intValue;
							};
						};

						// keep the data fetched once safe on FE
						this.fetchedItems = data;

						deferred.resolve(data);
					},function(data){
						deferred.reject(data);
					});

				return deferred.promise;
			}.bind(this);

			this.postCharges = function(params) {
				var deferred = $q.defer();
				var url = '/staff/items/post_items_to_bill';

				RVBaseWebSrv.postJSON(url, params)
					.then(function(data) {
						deferred.resolve(data);
					}, function(data) {
						deferred.reject(data);
					});

				return deferred.promise;
			};
			this.getReservationBillDetails = function(reservationId){
				var deferred = $q.defer();
				var url = '/api/reservations/'+reservationId+'/bills';

				rvBaseWebSrvV2.getJSON(url)
					.then(function(data) {
						deferred.resolve(data);
					}, function(data) {
						deferred.reject(data);
					});

				return deferred.promise;
			};
		}
	]
);