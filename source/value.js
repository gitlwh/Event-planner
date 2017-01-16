(function(){
	angular.module('myApp.value',[]);
})();
(function(){
	'use strict';
	angular.module('myApp.value').factory('whichToShow',function(){
		//alert("running2");
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