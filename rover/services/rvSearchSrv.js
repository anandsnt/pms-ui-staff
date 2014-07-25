sntRover.service('RVSearchSrv',['$q', 'RVBaseWebSrv', '$vault', function($q, RVBaseWebSrv, $vault){
	
	var self = this;
	
	this.fetch = function(dataToSend, useCache){
		var deferred = $q.defer();
		dataToSend.fakeDataToAvoidCache = new Date();
		var url =  'search.json';

		if ( useCache && !!self.data ) {
			deferred.resolve( self.data );
		} else {
			RVBaseWebSrv.getJSON(url, dataToSend).then(function(data) {
				for(var i = 0; i < data.length; i++){
					data[i].is_row_visible = true;
				}

				self.data = data;
				deferred.resolve(data);
			},function(data){
				deferred.reject(data);
			});
		}		
		
		return deferred.promise;		
	};

	// update the room no. of cached data
	this.updateCache = function(confirmation, data) {
		if ( !self.data ) {
			return;
		};

		for (var i = 0, j = self.data.length; i < j; i++) {
			if ( self.data[i]['confirmation'] === confirmation ) {
				self.data[i]['room'] = data.room;
			};
		};
	};

}]);