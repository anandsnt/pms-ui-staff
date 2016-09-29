admin.service('adZestStationLanguageConfigSrv', ['ADBaseWebSrvV2', function(ADBaseWebSrvV2){

    this.fetchLanguageList = function(){
    	var url = "ui/show?json_input=zest_station/language_list.json&format=json";
        //var url = '/admin/zest_email_setups.json';
        return ADBaseWebSrvV2.getJSON(url);
    };

    this.saveLanguageList = function(params){
        var url = '/admin/zest_email_setups.json';
        return ADBaseWebSrvV2.postJSON(url, params);
    };
}])