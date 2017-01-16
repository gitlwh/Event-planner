(function(){
	angular.module('myApp.logIn',['firebase']);
})();





(function(){
	'use strict';
	angular.module('myApp.logIn').controller('logInControl',logInControl);
	logInControl.$inject = ['authService'];
	function logInControl(authService){
		this.user= {};
		this.loginError = false;
		this.loginErrMsg = '';

		this.logIn = function(formUser) {
			//alert("login!");
			this.user = angular.copy(formUser);
			this.loginErrMsg=authService.loginWithPwd(this.user);
			if(this.loginErrMsg){
				this.loginError = true;
				switch (this.loginErrMsg) {
					case "EMAIL_TAKEN":
						this.loginErrMsg = "Error: The specified email is taken";
						break;
					case "INVALID_EMAIL":
						this.loginErrMsg = "Error: The email you entered is invalid";
						break;
					case "INVALID_PASSWORD":
						this.loginErrMsg = "Error: The specified password is incorrect.";
						break;
					case "INVALID_USER":
						this.loginErrMsg = "Error: The specified user does not exist.";
						break;
					default:
						this.loginErrMsg = "Error: " + error.code;
				}
			}else{
				$('#logInForm')[0].reset();
				$('.logIn').modal('hide');
			}
		};

	};
})();