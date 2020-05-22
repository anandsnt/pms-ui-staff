sntRover.service('rvFileCloudStorageSrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2) {
    var service = this;

    service.cardTye = '';

    service.fetchFileAttachments = function (params) {
        var url = '/sample_json/cards/file_attachments.json';

        params.card_type =  service.cardTye;
        return rvBaseWebSrvV2.getJSON(url, params);
    };

}]);