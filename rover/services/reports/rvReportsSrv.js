sntRover.service('RVreportsSrv', [
	'$q',
	'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {
		var choosenReport = {};

		this.setChoosenReport = function(item) {
			choosenReport = item;
		};

		this.getChoosenReport = function() {
			return choosenReport;
		};

		this.cacheReportList = {};

		this.fetchReportList = function(backToList) {
			var deferred = $q.defer();
			var url = '/api/reports';

			if ( backToList ) {
				deferred.resolve( this.cacheReportList );
			} else {
				rvBaseWebSrvV2.getJSON(url).then(function(data) {
					this.cacheReportList = data;
					deferred.resolve(data);
				}.bind(this), function(data){
					deferred.reject(data);
				});
			}

			return deferred.promise;
		};

		this.fetchReportDetails = function(id, param) {
			var deferred = $q.defer();
			var url = '/api/reports/' + id + 'submit';

			rvBaseWebSrvV2.getJSON(url).then(function(data) {
				this.cacheReportList = data;
				deferred.resolve(data);
			}.bind(this), function(data){
				deferred.reject(data);
			});

			return deferred.promise;
		};
	}
]);