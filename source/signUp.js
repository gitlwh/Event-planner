(function(){
	angular.module('myApp.signUp',['firebase']);
})();
(function(){
	'use strict';
	angular.module('myApp.signUp').controller('signUpControl',signUpControl);
	signUpControl.$inject = ['whichToShow','authService'];
	function signUpControl(whichToShow,authService){
		this.charLen = false;
		this.symbols = false;
		this.missNumber = false;
		this.lowerCase = false;
		this.upperCase = false;
		this.passwordMatch = false;
		this.registerErr = false;
		this.registerErrMsg = '';


		this.signUp = function(user) {
			this.newUserObj = angular.copy(user);
			this.userObject = {
				email: this.newUserObj.email,
				password: this.newUserObj.password,
				name: this.newUserObj.name,
				gender: this.newUserObj.gender,
				birthday: this.newUserObj.birthday.toLocaleDateString()
			};

			this.registerErrMsg=authService.createUser(this.userObject)
			if(this.registerErrMsg){
				this.registerErr=true;
			}else{
				whichToShow.setVar(true);
				$('.signUp').modal('hide');
			}
		};


		this.checkPassword = function() {
			var password = document.getElementById('password').value;

			// Check for Character Lengths
			this.charLen = /^[A-Za-z0-9\!\@\#\$\%\^\&\*]{8,50}/.test(password);

			// Check for Symbols
			this.symbols = /[\!\@\#\$\%\^\&\*]/g.test(password);

			// Check for Number
			this.missNumber = /\d/g.test(password);

			// Check for Lowercase Letter
			this.lowerCase = /[a-z]/g.test(password);

			// Check for Uppercase Letter
			this.upperCase = /[A-Z]/g.test(password);
		};
		this.checkSame=function(){
			var password = document.getElementById('password').value;
			var secondPassword = document.getElementById('secondPassword').value;
			this.passwordMatch=(password===secondPassword);
		}

	};
})();