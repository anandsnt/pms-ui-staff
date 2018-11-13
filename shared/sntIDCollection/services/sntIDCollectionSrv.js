angular.module('sntIDCollection').service('sntIDCollectionSrv', function($q, $filter, acuantCredentials, sntIDCollectionUtilsSrv) {

	var that = this;

	var errorMessage = ['Error: The subscription ID provided does not match any active subscription.'];

	/**
	 * [createCORSRequest description]
	 * @param  {[string]} method [http method]
	 * @param  {[string]} url    [API URL]
	 * @return {[object]}        [description]
	 */
	function createCORSRequest(method, url) {
		var xhr = new XMLHttpRequest();

		if ("withCredentials" in xhr) {
			xhr.open(method, url, true);
		} else if (typeof XDomainRequest !== "undefined") {
			xhr = new XDomainRequest();
			xhr.open(method, url);
		} else {
			xhr = null;
		}
		return xhr;
	}

	// This method is common for all GET requests
	// POST and delete method have different other headers based on the API type
	var createRequestObject = function(requestType, url) {
		var requestGetDocument = createCORSRequest(requestType, url);

		requestGetDocument.setRequestHeader("Authorization", "Basic " + btoa(acuantCredentials.username + ":" + acuantCredentials.password));
		requestGetDocument.setRequestHeader("Accept", "application/json");
		return requestGetDocument;
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
			var url = acuantCredentials.assureIDConnectEndpoint + '/AssureIDService/Subscriptions';
			var requestGetDocument = createRequestObject('GET', url);

			requestGetDocument.send();
			requestGetDocument.onload = function() {
				if (requestGetDocument.status === 200) {
					var documentObj = JSON.parse(requestGetDocument.responseText);

					validateSubscription(documentObj);
				} else {
					deferred.reject(errorMessage);
				}
			};
			requestGetDocument.onerror = function() {
				deferred.reject(errorMessage);
			};
		} else {
			deferred.reject(errorMessage);
		}
		return deferred.promise;
	};

	this.getDocInstance = function() {
		var deferred = $q.defer();
		var url = acuantCredentials.assureIDConnectEndpoint + "/AssureIDService/Document/Instance";
		var requestDocInstance = createCORSRequest("POST", url);

		requestDocInstance.setRequestHeader("Authorization", "Basic " + btoa(acuantCredentials.username + ":" + acuantCredentials.password));
		requestDocInstance.setRequestHeader('Content-Type', 'application/json');
		requestDocInstance.setRequestHeader("Accept", "application/json");

		requestDocInstance.send(JSON.stringify({
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
		}));

		requestDocInstance.onload = function() {
			if (requestDocInstance.status === 201) {
				var instanceID = JSON.parse(requestDocInstance.responseText);

				that.instanceID = instanceID;
				deferred.resolve(instanceID);
			} else {
				deferred.reject(['Document instance failed']);
			}
		};
		requestDocInstance.onerror = function() {
			deferred.reject(['Document instance failed']);
		};
		return deferred.promise;
	};

	this.postFrontImage = function(unmodifiedFrontImage) {

		var deferred = $q.defer();
		var url = acuantCredentials.assureIDConnectEndpoint + 'AssureIDService/Document/' + that.instanceID + '/Image?side=0&light=0&metrics=true';
		var requestDocInstance = createCORSRequest("POST", url);

		requestDocInstance.setRequestHeader("Authorization", "Basic " + btoa(acuantCredentials.username + ":" + acuantCredentials.password));
		requestDocInstance.setRequestHeader('Content-Type', 'image/*');
		requestDocInstance.setRequestHeader("Accept", "application/json");
		requestDocInstance.send(unmodifiedFrontImage);
		requestDocInstance.onload = function(response) {
			if (requestDocInstance.status === 201) {
				deferred.resolve({});
			} else {
				deferred.reject(['Document front image posting failed']);
			}
		};
		requestDocInstance.onerror = function() {
			deferred.reject(['Document front image posting failed']);
		};
		return deferred.promise;
	};

	this.postBackImage = function(imageData) {

		var deferred = $q.defer();
		var url = acuantCredentials.assureIDConnectEndpoint + '/AssureIDService/Document/' + that.instanceID + '/Image?side=1&light=0';
		var requestDocInstance = createCORSRequest("POST", url);

		requestDocInstance.setRequestHeader("Authorization", "Basic " + btoa(acuantCredentials.username + ":" + acuantCredentials.password));
		requestDocInstance.setRequestHeader('Content-Type', 'image/*');
		requestDocInstance.setRequestHeader("Accept", "application/json");
		requestDocInstance.send(imageData);
		requestDocInstance.onload = function() {
			if (requestDocInstance.status === 201) {
				deferred.resolve({});
			} else {
				deferred.reject(['Document back side image posting failed']);
			}
		};
		requestDocInstance.onerror = function() {
			deferred.reject(['Document back side image posting failed']);
		};
		return deferred.promise;
	};

	this.getImage = function(side) {
		var deferred = $q.defer();
		var url = acuantCredentials.assureIDConnectEndpoint + 'AssureIDService/Document/' + that.instanceID + '/Image?side=' + side + '&light=0';
		var requestGetDocument = createRequestObject('GET', url);

		requestGetDocument.responseType = 'arraybuffer';
		requestGetDocument.send();
		requestGetDocument.onload = function() {
			if (requestGetDocument.status === 200) {
				var base64String = sntIDCollectionUtilsSrv.base64ArrayBuffer(requestGetDocument.response);

				deferred.resolve(requestGetDocument.response);
			} else {
				deferred.reject(['Document getImage failed']);
			}
		};
		requestGetDocument.onerror = function() {
			deferred.reject(['Document getImage failed']);
		};

		return deferred.promise;
	};

	this.getImageQualityMetric = function(side) {

		var deferred = $q.defer();
		var url = acuantCredentials.assureIDConnectEndpoint + 'AssureIDService/Document/' + that.instanceID + '/Image/Metrics?side=' + side + '&light=0';
		var requestGetDocument = createRequestObject('GET', url);

		requestGetDocument.send();
		requestGetDocument.onload = function() {
			if (requestGetDocument.status === 200) {
				var documentObj = JSON.parse(requestGetDocument.responseText);

				deferred.resolve(documentObj);
			} else {
				deferred.reject(['Document getImageQualityMetric failed']);
			}
		};
		requestGetDocument.onerror = function() {
			deferred.reject(['Document getImageQualityMetric failed']);
		};

		return deferred.promise;
	};

	this.getClassification = function() {

		var deferred = $q.defer();
		var url = acuantCredentials.assureIDConnectEndpoint + 'AssureIDService/Document/' + that.instanceID + '/Classification';
		var requestGetDocument = createRequestObject('GET', url);

		requestGetDocument.send();
		requestGetDocument.onload = function() {
			if (requestGetDocument.status === 200) {
				var documentObj = JSON.parse(requestGetDocument.responseText);

				deferred.resolve(documentObj);
			} else {
				deferred.reject(['Document getClassification failed']);
			}
		};
		requestGetDocument.onerror = function() {
			deferred.reject(['Document getClassification failed']);
		};

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
		var url = acuantCredentials.assureIDConnectEndpoint + '/AssureIDService/Document/' + that.instanceID;
		var requestGetDocument = createRequestObject('GET', url);

		requestGetDocument.send();
		requestGetDocument.onload = function() {
			if (requestGetDocument.status === 200) {
				var documentObj = JSON.parse(requestGetDocument.responseText);
				
				documentObj.Fields = documentObj.Fields ? sntIDCollectionUtilsSrv.formatData(documentObj.Fields) : {};
				deferred.resolve(documentObj);
			} else {
				deferred.reject(['Document getResults failed']);
			}
		};
		requestGetDocument.onerror = function() {
			deferred.reject(['Document getResults failed']);
		};

		return deferred.promise;
	};

	this.deleteDocInstance = function() {
		var deferred = $q.defer();
		var url = acuantCredentials.assureIDConnectEndpoint + '/AssureIDService/Document/' + that.instanceID;
		var requestGetDocument = createCORSRequest("DELETE", url);

		requestGetDocument.setRequestHeader("Authorization", "Basic " + btoa(acuantCredentials.username + ":" + acuantCredentials.password));
		requestGetDocument.setRequestHeader("Accept", "application/json");
		requestGetDocument.send();
		requestGetDocument.onload = function() {
			deferred.resolve({});
		};
		requestGetDocument.onerror = function() {
			deferred.resolve({});
		};

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
	// 		},
	// 		transformRequest: transformRequest
	// 	}).then(function(response) {
	// 		deferred.resolve(response.data);
	// 	}, function(error) {
	// 		deferred.reject(error);
	// 	});
	// 	return deferred.promise;
	// };

});