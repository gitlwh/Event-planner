(function(){
	angular.module('myApp.firebaseAuth',["firebase"]);
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