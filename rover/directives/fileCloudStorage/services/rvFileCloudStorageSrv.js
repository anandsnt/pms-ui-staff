sntRover.service('rvFileCloudStorageSrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2) {
    var service = this;
    
	service.setCardType = function(cardTye) {
		service.cardTye = cardTye;
	};

    service.fetchFiles = function (params) {
        var url = '/sample_json/cards/file_attachments.json';

        params.card_type =  service.cardTye;
        return rvBaseWebSrvV2.getJSON(url, params);
    };

    service.uploadFile = function (params) {
        var url = '/sample_json/cards/file_attachments.json';

        params.card_type =  service.cardTye;
        return rvBaseWebSrvV2.getJSON(url, params);
    };

     service.downLoadFile = function (params) {
        var url = '/sample_json/cards/file_attachments.json';

        params.card_type = service.cardTye;
        return rvBaseWebSrvV2.getJSON(url, params);
    };

    service.deleteFile = function (params) {
        var url = '/sample_json/cards/file_attachments.json';

        params.card_type = service.cardTye;
        return rvBaseWebSrvV2.getJSON(url, params);
    };

}]);