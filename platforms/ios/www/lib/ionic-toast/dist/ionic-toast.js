"use strict";
angular.module("ionic-toast",["ionic"])
	.run(["$templateCache",function(t){
		var o='<div class="ionic_toast" ng-class="ionicToast.toastClass" ng-style="ionicToast.toastStyle"><span class="ionic_toast_close" ng-click="hide()"><i class="ion-close-round toast_close_icon"></i></span><span class="ionic_toast_tip"><i ng-class="ionicToast.iconClass"></i></span><nobr ng-bind-html="ionicToast.toastMessage"></nobr></div>';
		t.put("ionic-toast/templates/ionic-toast.html",o)
	}])

	.provider("ionicToast",function(){
		// this.$get=["$compile","$document","$interval","$rootScope","$templateCache","$timeout",function(t,o,i,n,s,a){
		this.$get=["$compile","$document","$interval","$rootScope","$templateCache","$timeout",function($compile,$document,$interval,$rootScope,$templateCache,$timeout){
			var c,
				e={toastClass:"",toastMessage:"",toastStyle:{display:"none",opacity:0}},
				class_p = {top:"ionic_toast_top",middle:"ionic_toast_middle",bottom:"ionic_toast_bottom"},
				class_type = {yes:"ion-ios-checkmark-outline",no:"ion-ios-close-outline",warn:"ion-ios-information-outline"},
				r_new = $rootScope.$new(),
				p = $compile($templateCache.get("ionic-toast/templates/ionic-toast.html"))(r_new);
				r_new.ionicToast=e,
				$document.find("body").append(p);
				var style_t;
				var u=function(t,o,i){
					$timeout.cancel(style_t),
					o == 0 ? ( r_new.ionicToast.toastStyle.opacity=o,style_t=$timeout(function(){r_new.ionicToast.toastStyle.display=t}, 1000) ) :( r_new.ionicToast.toastStyle.display=t,style_t=$timeout(function(){r_new.ionicToast.toastStyle.opacity=o}, 10) ),
					i()
				};
				return r_new.hide=function(){
					u("none",0,function(){
						// console.log("toast hidden")
					})
				},
				{
					show:function(t,o,type,i,n){
						t&&o&&n&&($timeout.cancel(c),
							n>5e3&&(n=5e3),
							angular.extend(r_new.ionicToast,{toastClass: class_p[o]+" "+(i?"ionic_toast_sticky":"")+" "+ (type? "ionic_toast_icon": ""),toastMessage:t, iconClass: (type? class_type[type]: "")}),
							u("block",1,function(){
								i||(c=$timeout(function(){r_new.hide()},n))}
							))
					},
					hide:function(){r_new.hide()}
				}
					
			}
		]
	});