angular.module('myApp',['ionic','controller', 'ionic-toast', 'elasticText'])

.config(function($stateProvider,$urlRouterProvider,$ionicConfigProvider){

	$ionicConfigProvider.platform.ios.tabs.style('standard'); 
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');
    $ionicConfigProvider.platform.ios.navBar.alignTitle('center'); 
    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');       
    $ionicConfigProvider.platform.ios.views.transition('ios'); 
    $ionicConfigProvider.platform.android.views.transition('android');

	$urlRouterProvider.otherwise('/login');
    
	$stateProvider
	//登录页（公司新闻）
	.state('login',{
		url:"/login",
		templateUrl:"templates/login.html",
	    controller:'loginController'

		// cache: 'false', //跳转页面刷新请求
		// abstract: true
	})

	.state('tab',{
		url:"/tab",
		templateUrl:"templates/tabs.html",
		abstract: true

	})
	

	//行业资讯
	.state('tab.home', {
	    url: '/home',
	    views:{
	        'tab-home':{
	            templateUrl: "templates/tab-home.html",
	            // controller:'homeController'
	        }
	    }

	})

	.state('content',{
		url:'/content',
		templateUrl:"templates/content.html",
		controller:'contentController',
		cache: 'false', //跳转页面刷新请求

	})

	//首页（公司动态）

	.state('tab.about',{
		url:"/about",
		views:{
			'tab-about':{
				templateUrl:"templates/tab-about.html",
				controller:'aboutController'
			}
		}
	})
	//管理之声
	.state('tab.about.new1',{
		url:"/new1",
		views:{
			'new1':{
				templateUrl:"templates/new1.html",
				// controller: 'managerSound'
			}
		}
		
	})
	//公司动态
	.state('tab.about.new2',{
		url:"/new2",
		views:{
			'new2':{
				templateUrl:"templates/new2.html",
				// controller: 'companyNews'
			}
		}
	})
	//（自由家园）

	.state('tab.freeHome',{
		url:"/freeHome",
		views:{
			'freeHome':{
				templateUrl:"templates/freeHome.html",
				controller:'freeHomeController'
			}
		}
	})

//我的主页


	.state('tab.mine',{
		url:"/mine",
		views:{
			'tab-mine':{
				templateUrl:"templates/tab-mine.html"
			
			}
		}
	})

	.state('thinking',{
			url:"/thinking",
			templateUrl:"templates/myThinking.html"

	})
	.state('publish',{
			url:"/publish",
			templateUrl:"templates/publish.html",
			controller:'PublishCtrl'

	})
	.state('share',{
			url:"/share",
			templateUrl:"templates/myShare.html"

	})

    /*.state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })*/
	



});

