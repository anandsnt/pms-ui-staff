sntRover.service('RVUpgradesSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){
		

	this.getAllUpgrades = function(param){
		var deferred = $q.defer();
		var url =  '/staff/reservations/room_upsell_options.json';			
		// RVBaseWebSrv.getJSON(url, param).then(function(data) {
		// 	deferred.resolve(data);
		// },function(data){
		// 	deferred.reject(data);
		// });
				
		var data = {
					"upsell_data": [
								{
									"upsell_amount_id": "458",
									"upgrade_room_number": "2008",
									"upsell_amount": "25.00",
									"upgrade_room_type": "DLK",
									"upgrade_room_type_name": "Deluxe Room King",
									"upgrade_room_description": "<ul><li>iPad compatible Entertainment Systems</li>\n<li>Sealy bed</li>\n</ul>",
									"room_type_image": "https://8ebd8b3dcdf6d6f8887d-4d1e022461cbaa577307930af1386d20.ssl.cf2.rackcdn.com/CHA/DOZERQA/room_types/6/images/original/image20140307033524.png?1394184926",
									"no_of_rooms": "155",
									"max_adults": "",
									"max_children": ""
								},
								{
									"upsell_amount_id": "459",
									"upgrade_room_number": "1038",
									"upsell_amount": "50.00",
									"upgrade_room_type": "STDK",
									"upgrade_room_type_name": "Standard Room- King Bed",
									"upgrade_room_description": "<ul><li>Standard Room- King Bed</li><li>Hair dryer</li></ul>",
									"room_type_image": "https://8ebd8b3dcdf6d6f8887d-4d1e022461cbaa577307930af1386d20.ssl.cf2.rackcdn.com/CHA/DOZERQA/room_types/6/images/original/image20140307033524.png?1394184926",
									"no_of_rooms": "130",
									"max_adults": "",
									"max_children": ""
								}
							],
					"header_details": {
									"room_number": "1003",
									"room_type_name": "Deluxe Twin",
									"room_type": "DLT",
									"total_nights": 1,
									"arrival_date": "2014-06-16",
									"departure_date": "2014-06-17",
									"room_status": "NOTREADY",
									"reservation_status": "CHECKING_IN",
									"fo_status": "",
									"room_ready_status": "",
									"use_inspected": "true",
									"use_pickup": "true",
									"checkin_inspected_only": "false"
							}
					};	
					setTimeout(function(){
				deferred.resolve(data);
				}, 
			3000);
			
			return deferred.promise;
		}
		this.selectUpgrade = function(param){
		var deferred = $q.defer();
		var url =  '/staff/reservations/upgrade_room.json';			
		RVBaseWebSrv.postJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});			
			return deferred.promise;
		}

}]);