describe('rvOverBookingSrv', function () {

	beforeEach(function() {
        module('sntRover');

        inject(function(_rvOverBookingSrv_, _$httpBackend_) {
            this.rvOverBookingSrv = _rvOverBookingSrv_;
            this.$httpBackend = _$httpBackend_;
        });
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingRequest();
    });

	describe('.getDateRange(fromDate, toDate)', function () {

		it('Invoke utility method get date range', function() {

			var output = [], 
				sampleData = [
					{ date: '2018-05-01', isWeekend: false },
					{ date: '2018-05-02', isWeekend: false },
					{ date: '2018-05-03', isWeekend: false },
					{ date: '2018-05-04', isWeekend: false },
					{ date: '2018-05-05', isWeekend: true  }
				];

			output = this.rvOverBookingSrv.getDateRange('2018-05-01', '2018-05-05');
			expect(output).toEqual(sampleData);
		});
	});

});