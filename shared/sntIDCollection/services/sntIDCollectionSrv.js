angular.module('sntIDCollection').service('sntIDCollectionSrv', function($http, $q, $filter, acuantCredentials, sntIDCollectionUtilsSrv) {

	var that = this;

	var errorMessage = ['Error: The subscription ID provided does not match any active subscription.'];

	var apiRequestHeader = {
		'Authorization': 'Basic ' + btoa(acuantCredentials.username + ':' + acuantCredentials.password),
		'Accept': 'application/json'
	};
	var imageApiRequestHeader = {
		'Authorization': 'Basic ' + btoa(acuantCredentials.username + ':' + acuantCredentials.password),
		'Accept': 'application/json',
		'Content-Type': 'image/*'
	};

	this.isValidSubsription = false;
	this.instanceID;

	this.validateCredentials = function() {

		var deferred = $q.defer();

		if (acuantCredentials.username &&
			acuantCredentials.password &&
			acuantCredentials.assureIDConnectEndpoint &&
			acuantCredentials.subscriptionID) // All the variables should be non empty
		{
			var validateSubscription = function(subscriptions) {
				if (subscriptions.length > 0) {
					var chk = false;
					var appSubscription = $filter('filter')(subscriptions, {
						'Id': acuantCredentials.subscriptionID
					})[0];

					chk = appSubscription ? appSubscription.IsActive : false;
					if (!chk) {
						deferred.reject(errorMessage);
					} else {
						that.isValidSubsription = true;
						deferred.resolve({});
					}
				} else {
					deferred.reject(errorMessage);
				}
			};

			$http({
				method: 'GET',
				url: acuantCredentials.assureIDConnectEndpoint + '/AssureIDService/Subscriptions',
				data: {},
				headers: apiRequestHeader
			}).then(function(response) {
				validateSubscription(response.data);
			}, function(error) {
				deferred.reject(error);
			});
		} else {
			deferred.reject(errorMessage);
		}
		return deferred.promise;
	};

	this.getDocInstance = function() {
		var deferred = $q.defer();

		$http({
			method: 'POST',
			url: acuantCredentials.assureIDConnectEndpoint + '/AssureIDService/Document/Instance',
			data: {
				'AuthenticationSensitivity': 0,
				'ClassificationMode': 0,
				'Device': {
					'HasContactlessChipReader': false,
					'HasMagneticStripeReader': false,
					'SerialNumber': 'xxx',
					'Type': {
						'Manufacturer': 'xxx',
						'Model': 'xxx',
						'SensorType': 3
					}
				},
				'ImageCroppingExpectedSize': 0,
				'ImageCroppingMode': 1,
				'ManualDocumentType': null,
				'ProcessMode': 0,
				'SubscriptionId': acuantCredentials.subscriptionID
			},
			headers: {
				'Authorization': 'Basic ' + btoa(acuantCredentials.username + ':' + acuantCredentials.password),
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then(function(response) {
			that.instanceID = response.data;
			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	this.postFrontImage = function(unmodifiedFrontImage) {

		var deferred = $q.defer();
		var url = acuantCredentials.assureIDConnectEndpoint + 'AssureIDService/Document/' + that.instanceID + '/Image?side=0&light=0&metrics=true';
		
		$http({
			method: 'POST',
			url: url,
			data: unmodifiedFrontImage,
			headers: imageApiRequestHeader
		}).then(function(response) {
			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	this.postBackImage = function(imageData) {
		var deferred = $q.defer();
		
		$http({
			method: 'POST',
			url: acuantCredentials.assureIDConnectEndpoint + '/AssureIDService/Document/' + that.instanceID + '/Image?side=1&light=0',
			data: imageData,
			headers: imageApiRequestHeader
		}).then(function(response) {
			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	this.getImage = function(side) {
		var deferred = $q.defer();

		$http({
			method: 'GET',
			url: acuantCredentials.assureIDConnectEndpoint + 'AssureIDService/Document/' + that.instanceID + '/Image?side=' + side + '&light=0',
			headers: apiRequestHeader,
			responseType: 'arraybuffer'
		}).then(function(response) {
			var base64String = sntIDCollectionUtilsSrv.base64ArrayBuffer(response.data);

			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	this.getImageQualityMetric = function(side) {
		var deferred = $q.defer();

		$http({
			method: 'GET',
			url: acuantCredentials.assureIDConnectEndpoint + 'AssureIDService/Document/' + that.instanceID + '/Image/Metrics?side=' + side + '&light=0',
			headers: apiRequestHeader
		}).then(function(response) {
			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	this.getClassification = function() {
		var deferred = $q.defer();

		$http({
			method: 'GET',
			url: acuantCredentials.assureIDConnectEndpoint + 'AssureIDService/Document/' + that.instanceID + '/Classification',
			headers: apiRequestHeader
		}).then(function(response) {
			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	this.getImageDetails = function(side) {
		var deferred = $q.defer(),
			responses = {},
			promises = [];

		var onSuccessFetchImage = function(response) {
			responses['image'] = response;
		};

		var onSuccessFetchImageQualityMetrics = function(response) {
			responses['quality_metrics'] = response;
		};

		var onSuccessFetchImageClassification = function(response) {
			responses['image_classification'] = response;
		};


		var failure = function(error) {
			deferred.reject(error);
		};

		promises.push(that.getImage(side).then(onSuccessFetchImage, failure));
		promises.push(that.getImageQualityMetric(side).then(onSuccessFetchImageQualityMetrics, failure));
		promises.push(that.getClassification(side).then(onSuccessFetchImageClassification, failure));

		$q.all(promises).then(function() {
			deferred.resolve(responses);
		});

		return deferred.promise;
	};

	this.getResults = function() {

		var deferred = $q.defer();

		$http({
			method: 'GET',
			url: acuantCredentials.assureIDConnectEndpoint + '/AssureIDService/Document/' + that.instanceID,
			data: {},
			headers: apiRequestHeader
		}).then(function(response) {
			response.data.Fields = response.data.Fields ? sntIDCollectionUtilsSrv.formatData(response.data.Fields) : {};

			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	this.deleteDocInstance = function() {
		var deferred = $q.defer();

		$http({
			method: 'DELETE',
			url: acuantCredentials.assureIDConnectEndpoint + '/AssureIDService/Document/' + that.instanceID,
			data: {},
			headers: apiRequestHeader
		}).then(function(response) {
			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	// this.faceMatch = function(facialMatchData) {
	// 	var deferred = $q.defer();
	// 	$http({
	// 		method: 'POST',
	// 		url: 'https://cssnwebservices.com/CSSNService/CardProcessor/FacialMatch',
	// 		data: facialMatchData,
	// 		cache: false,
	// 		contentType: 'application/octet-stream; charset=utf-8;',
	// 		dataType: 'json',
	// 		processData: false,
	// 		headers: {
	// 			'Authorization': 'LicenseKey ' + acuantCredentials.LicenseKey,
	// 			'Accept': 'application/json',
	// 			'Content-Type': 'image/jpg'
	// 		}
	// 	}).then(function(response) {
	// 		deferred.resolve(response.data);
	// 	}, function(error) {
	// 		deferred.reject(error);
	// 	});
	// 	return deferred.promise;
	// };

});