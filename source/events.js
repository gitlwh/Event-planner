(function(){
	angular.module('myApp.event',[]);
})();
(function(){
	'use strict';
	angular.module('myApp.event').controller('eventControl',eventControl);
	eventControl.$inject=['authService'];
	function eventControl(authService){
		function init() {
			//alert("init!");
            var input = document.getElementById('locationTextField');
            var autocomplete = new google.maps.places.Autocomplete(input);
        }
        google.maps.event.addDomListener(window, 'load', init);

		this.submit=function(eObj) {

			this.event = angular.copy(eObj);
			var location=document.getElementById("locationTextField").value;
			this.myEvent={
				topic:this.event.topic,
				type:this.event.type,
				host:this.event.host,
				startDate:this.event.startDate.toString(),
				endDate:this.event.endDate.toString(),
				location:location,
				guest:this.event.guest||'',
				msg:this.event.msg||''
			}
			authService.writeNewEvent(this.myEvent);
			
			$('#eventForm')[0].reset();
			$('.createEvent').modal('hide');
		}
	};
})();