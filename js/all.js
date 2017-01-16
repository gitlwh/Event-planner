(function(){
	angular.module('myApp',["firebase",'myApp.dashboard','myApp.firebaseAuth','myApp.value','myApp.signUp','myApp.logIn','myApp.event','ngMessages']);
})();

(function(){
	angular.module('myApp.dashboard',['firebase']);
})();

(function(){
	angular.module('myApp.value',[]);
})();

(function(){
	angular.module('myApp.signUp',['firebase']);
})();

(function(){
	angular.module('myApp.firebaseAuth',["firebase"]);
})();

(function(){
	angular.module('myApp.event',[]);
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

(function(){
	angular.module('myApp.logIn',['firebase']);
})();

(function(){
	'use strict';
	angular.module('myApp.value').factory('whichToShow',function(){
		alert("running2");
		var values={logged:false};
		return {
			getVar: function(){
				return values;
			},
			setVar: function(value){
				values.logged=value;
			}

		};
	});
})();



(function(){
	'use strict';
	angular.module('myApp.event').controller('eventControl',eventControl);
	eventControl.$inject=['authService'];
	function eventControl(authService){
		function init() {
			alert("init!");
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

(function(){
	'use strict';
	angular.module('myApp.logIn').controller('logInControl',logInControl);
	logInControl.$inject = ['authService'];
	function logInControl(authService){
		this.user= {};
		this.loginError = false;
		this.loginErrMsg = '';

		this.logIn = function(formUser) {
			alert("login!");
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

(function() {
	'use strict';

	angular
		.module('myApp.firebaseAuth')
		.factory('authService', authService);

	authService.$inject = ['$firebase','$firebaseAuth','$firebaseArray'];

	function authService($firebase,$firebaseAuth,$firebaseArray) {
		var config = {
		    apiKey: "AIzaSyB-VqalJDYnATOF9PNi-Skb-wieBJS9d0o",
		    authDomain: "meeup-48d03.firebaseapp.com",
		    databaseURL: "https://meeup-48d03.firebaseio.com",
		    storageBucket: "meeup-48d03.appspot.com",
		    messagingSenderId: "979783221109"
		};
		firebase.initializeApp(config);
		var authObj = $firebaseAuth();
		var ref = firebase.database().ref();

		var services = {
			loginWithPwd:loginWithPwd,
			createUser:createUser,
			setOnAuth:setOnAuth,
			logOutUser:logOutUser,
			writeNewEvent:writeNewEvent,
			removeEvent:removeEvent,
			getEvent:getEvent
		};
		return services;

		function loginWithPwd(userObj) {
			var message;
			authObj.$signInWithEmailAndPassword(userObj.email, userObj.password).then(function(firebaseUser) {
				console.log("Signed in as:", firebaseUser.uid);
			}).catch(function(error) {
				console.error("Authentication failed:", error);
				message=error;
			});
			return message;
		}

		function createUser(user) {
			var message=""
			console.log(user);
			authObj.$createUserWithEmailAndPassword(user.email, user.password).then(function(firebaseUser) {
				console.log("User " + firebaseUser.uid + " created successfully!");
				var updates = {};
			    updates['/users/' + firebaseUser.uid] = { name : user.name,
			      	gender:user.gender,
			      	birthday:user.birthday
			    };
			    
			    ref.update(updates);
			    
			    loginWithPwd(user);
			    //add login
			}).catch(function(error) {
				console.error("Error: ", error);
				message=error;
			});
			return message;
		}


		function setOnAuth(authDataCallback) {
			authObj.$onAuthStateChanged(authDataCallback);
		}

		function logOutUser() {
			authObj.$signOut();
		}

		function writeNewEvent(eObj) {
		  // A post entry.
			var userObj = authObj.$getAuth();

		  	// Write the new post's data simultaneously in the posts list and the user's post list.
		  	var updates = {};
		  	console.log(eObj);
		  	/*
		  	updates['/events/' + userObj.uid] = [{ topic : eObj.topic,
		  		type:eObj.type,
		  		host:eObj.host,
		  		startDate:eObj.startDate,
		  		endDate:eObj.endDate,
		  		location:eObj.location,
		  		guest:eObj.guest,
		  		msg:eObj.msg
			    }];*/
			var userObj = authObj.$getAuth();
			console.log("userid:"+userObj.uid);
			var eventsRef = ref.child('events').child(userObj.uid);
			var list= $firebaseArray(eventsRef);
			list.$add(eObj);
			//console.log(updates['/events/' + userObj.uid])
		  	//ref.update(updates);
		}

		function removeEvent(eventObj) {
			var userObj = authObj.$getAuth();
			console.log(eventObj);
			var eventRef = ref.child('events').child(userObj.uid).child(eventObj.$id.toString());
			eventRef.remove()
			/*
			var list= $firebaseArray(eventRef);
			list.$remove(eventObj.$id.tostring()); 
			var updates = {};
			updates['/events/' + userObj.uid]={};
			console.log(list);
			console.log(list[0]);
			ref.update(updates);
			
			var list= $firebaseArray(eventRef);
			var i;
			console.log("in remove");
			console.log(list);
			for (i = 0; i < list.length; i++) { 
    			console.log(list[i]);
			}
			list.$remove(eventObj);
			for (i = 0; i < list.length; i++) { 
    			console.log(list[i]);
			}
			if(list.length==0){
				console.log("is zero");
			}
			var updates = {};
			updates['/events/' + userObj.uid]=list;
			ref.update(updates);

			.child(eventId);
			eventRef.remove();*/
		}

		function getEvent(){
			var userObj = authObj.$getAuth();
			var eventsRef = ref.child('events').child(userObj.uid);
			console.log(userObj);
			//console.log(eventRef);
			return $firebaseArray(eventsRef);
		}

	}

})();
