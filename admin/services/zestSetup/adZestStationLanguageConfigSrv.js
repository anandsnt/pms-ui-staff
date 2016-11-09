admin.service('adZestStationLanguageConfigSrv', ['ADBaseWebSrvV2', function(ADBaseWebSrvV2) {

    this.fetchLanguageList = function() {
    	var url = "/api/kiosk/languages";
        //var url = '/admin/zest_email_setups.json';

        return ADBaseWebSrvV2.getJSON(url);
    };

    this.saveLanguageList = function(params) {
        var url = '/api/kiosk/languages';

        return ADBaseWebSrvV2.putJSON(url, params);
    };
}])