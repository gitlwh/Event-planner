(function(){
	angular.module('myApp.dashboard',['firebase']);
})();

(function(){
	'use strict';
	angular.module('myApp.dashboard').controller('mainControl',mainControl);

	mainControl.$inject = ['whichToShow','authService'];
	function mainControl(whichToShow,authService){
		var self=this;
		this.values=whichToShow.getVar();
		this.logOut=function(){
			whichToShow.setVar(false);
			authService.logOutUser();
		};
		this.removeEvent=function(eventObj){
			console.log(eventObj);
			authService.removeEvent(eventObj);
		}

		authService.setOnAuth(authDataCallback);
		// Callback to set user's events.
		function authDataCallback(authData) {
			if (authData) {
				console.log("User is logged in with " + authData.email);
				self.eventList=authService.getEvent();
				whichToShow.setVar(true);
			} else {
				console.log("User is logged out");
			}
		}
	}
})();