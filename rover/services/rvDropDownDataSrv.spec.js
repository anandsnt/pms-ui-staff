describe("RVDropdownDataSrv", function() {
    var RVDropdownDataSrv,
        httpBackend;

    var countriesList = [
        {
            id: 10,
            value: "India"
        },
        {
            id: 11,
            value: "Afghan"
        },
        {
            id: 12,
            value: "Malayasia"
        }
    ];

    beforeEach(function() {
        module("sntRover");

        inject(function(_RVDropdownDataSrv_, _$httpBackend_) {
            RVDropdownDataSrv = _RVDropdownDataSrv_;
            httpBackend = _$httpBackend_;
        });
    });

    afterEach(function() {
        httpBackend.verifyNoOutstandingRequest();
    });

    it("should provide the list of countries upon success", function() {
        var status;

        httpBackend.when('GET', '/ui/country_list').
                respond(200, countriesList);
        RVDropdownDataSrv.fetchCountryList().then(function() {
            status = "success";
        }, function() {
            status = "failure";
        });

        httpBackend.flush(1);

        expect(status).toEqual("success");
    });

    it("should return error upon api failure", function() {
        var status;

        httpBackend.when('GET', '/ui/country_list').
                respond(422, countriesList);
        RVDropdownDataSrv.fetchCountryList().then(function() {
            status = "success";
        }, function() {
            status = "failure";
        });

        httpBackend.flush(1);

        expect(status).toEqual("failure");
    });

});