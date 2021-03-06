angular.module('controller', ['ngCordova'])
// $scope.$on('$ionicView.beforeEnter'
.run(function($rootScope,$window, $ionicPlatform, $ionicSideMenuDelegate, $ionicPopup, $location, $state, $ionicHistory) {
    //后台接口
    $rootScope.interFace = 'http://it.hgits.cn:91/CompanyNews/newsApp/';

    $rootScope.bExit = true;
    if(ionic.Platform.isIOS()){
        $rootScope.bExit = false;
    }
    // 侧导航的退出方法
    $rootScope.exit=function(){
        $ionicPopup.show({
            title: '华软内刊',
            template: '确认退出华软内刊吗?',
            buttons: [{
                text: '<b>取消</b>',
                type: 'button-default'
            },{
                text: '<b>确认</b>',
                type: 'button-main',
                onTap: function(){
                    ionic.Platform.exitApp();
                    // navigator.app.exitApp(); 
                }
            }]
        });
    }
    //接管android默认的返回事件
    $ionicPlatform.registerBackButtonAction(function(e) {
        e.preventDefault();
        e.stopPropagation();

        var stateNow = ($state.is('tab.home') || $state.is('tab.about') || $state.is('login')|| $state.is('tab.about.new1') || $state.is('tab.about.new2') || $state.is('tab.settings') || $state.is('tab.mine') );
        if (stateNow) {
            $rootScope.exit();
        }
        else{
            $ionicHistory.goBack(-1);
        }
        return false;
    }, 151);
    //日期转换
    $rootScope.dateSwitch = function(date) {
        date=date.replace("T"," ");
        var startTime = new Date().getTime();
        var endTime = new Date(Date.parse(date.replace(/-/g, "/"))).getTime();
        var dates = Math.abs((startTime - endTime)) / 1000;
        if(dates > 31104000){
            dates = Math.floor(dates / 31104000) + "年前";
        }
        else if(dates > 2592000){
            dates = Math.floor(dates / 2592000) + "个月前";
        }
        else if(dates > 86400){
            dates = Math.floor(dates / 86400) + "天前";
        }
        else if(dates > 3600){
            dates = Math.floor(dates / 3600) + "小时前";
        }
        else if(dates > 60){
            dates = Math.floor(dates / 60) + "分钟前";
        }
        else{
            dates = "刚刚";
        }
        return  dates;
    }
    // 头部头像及侧边栏
    $rootScope.bRotate = false;
    $rootScope.$watch(function() { 
        return $ionicSideMenuDelegate.isOpenLeft();
    },function(isOpenLeft) {
        $rootScope.bRotate = isOpenLeft;
        if( isOpenLeft ) {
            $rootScope.toggleLeft = function(){
                $ionicSideMenuDelegate.toggleLeft()
            }  
        } else {
            $rootScope.toggleLeft = function(){
            }
        }
    }); 

})
.controller('loginController', ['$scope', '$rootScope','$window','$ionicLoading','$state','$ionicPopup','$ionicSideMenuDelegate','ionicToast','Req_data',function($scope,$rootScope,$window,$ionicLoading,$state,$ionicPopup,$ionicSideMenuDelegate,ionicToast, Req_data){

    $rootScope.user = {};
    $rootScope.user.username = $window.localStorage.getItem("username");
    $rootScope.user.password = $window.localStorage.getItem("password");

    //显示或隐藏清除按键
    $scope.cleanBtn = function(name){
        if(name == "user") $scope.userVar =!$scope.userVar;
        else if(name == "pwd") $scope.pwdVar=!$scope.pwdVar;
    }
    //清除输入框内容
    $scope.cleanInput = function(name){
        if(name == "user"){
            $rootScope.user.username = "";
            $rootScope.user.password = "";
        }
        else if(name == "pwd")$rootScope.user.password = ""; 
    };
    //发送登录请求             
    $scope.login = function(){   
        $ionicLoading.show();
        Req_data.get_httpReq('login',{'username':$rootScope.user.username,'password':$rootScope.user.password}).success(function(data, status, headers, config){
            $ionicLoading.hide();
            if(data.login){
                $window.localStorage.setItem("username", $rootScope.user.username);
                $window.localStorage.setItem("password", $rootScope.user.password);
                $rootScope.operator =  data.operator;
                (!$rootScope.operator.messagerurl)&&
                    ($rootScope.operator.messagerurl = ($rootScope.operator.sex == 0) ? 'img/icon_m_wev8.jpg' : 'img/icon_w_wev8.jpg');
                
                $state.go('tab.about.new2');
            }
            else{             
                $scope.checkText = '登录失败！请检查用户名和密码是否正确！';
                $scope.loginP = true;
            }    
        }).error(function(data, status, headers, config){
            $ionicLoading.hide();           
            $scope.checkText = '网络异常！服务器请求失败！';
            $scope.loginP = true;
        });
        
    };
    //自动登录
    loginAuto();
    function loginAuto(){
        if($window.localStorage.getItem("username") && $window.localStorage.getItem("password")){
           $rootScope.user.username = $window.localStorage.getItem("username");
           $rootScope.user.password = $window.localStorage.getItem("password");
           $scope.login();
        } 
    };
    //退出登入
    $rootScope.logout = function(){
        $ionicPopup.show({
            title: '退出登录!',
            template: '确定注销此用户吗？',
            buttons: [
            {
                text: '<b>取消</b>',
                type: 'button-default'
            },
            {
                text: '<b>确认</b>',
                type: 'button-main',
                onTap: function(e) { 
                    loginoutDo();                                                
                }
            }]
        });
        function loginoutDo(){
            Req_data.get_httpReq('logout',{'username':$rootScope.user.username,'password':$rootScope.user.password}).success(function(data, status, headers, config){
                $window.localStorage.removeItem("username");
                $window.localStorage.removeItem("password");
                $rootScope.user.username="";
                $rootScope.user.password="";                    
                $state.go('login');
                $ionicSideMenuDelegate.toggleLeft();
            }).error(function(data, status, headers, config){
                $state.go('login');
                $ionicSideMenuDelegate.toggleLeft();
            });
        }
    };
}])
.service('Req_data', ['$http', '$state', '$rootScope','$ionicLoading', 'ionicToast',function($http, $state, $rootScope,$ionicLoading,ionicToast){
    var http_req = function(name,params){
            var sParam = '';
            for(var i in params){
               sParam += ( i +'='+ params[i] +'&' );
            };
            return $http({
              method: 'JSONP',
              url:  $rootScope.interFace + 'newsApp_'+ name +'.do?'+ sParam +'&callback=JSON_CALLBACK',
            });
        },
        http_content = function(name,type,params,success, error){
            var sParam = '';
            for(var i in params){
               sParam += ( i +'='+ params[i] +'&' );
            };
            $ionicLoading.show();
            $http({
                method: 'JSONP',
                url: $rootScope.interFace+'newsApp_'+ name + type +'.do?'+ sParam +'callback=JSON_CALLBACK'
            }).success(function(data, status, headers, config) {
                //没有登录
                $ionicLoading.hide();
                if(data.invalidSession){
                    $state.go('login',{ reload : true }); 
                }
                //登录
                else{
                    success(data);
                } 
            }).error(function(data, status, headers, config){
                console.log('请求失败');
                error&&error();
                $ionicLoading.hide();
                ionicToast.show($rootScope.tips+',请检查网络设置', 'bottom','warn', false, 1000);
            });
        },
        listScope,
        contentData = {},
        reqContent = function(){
            $rootScope.tips="获取内容失败";
            http_content(listScope.newsBtn,'Detail',{'id': listScope.newsId}, function(data){
                contentData = data;

                $state.go('content');
                $ionicLoading.hide();

            })
        };


    return {
        'get_httpReq':function(name,params){
            return http_req(name,params);
        },
        'get_content':function(name,type,params,success, error){
            return http_content(name,type,params,success, error);
        },
        'transferScope': function(scope){
            listScope = scope;
            reqContent();
        },
        'get_listScope' : function(){
            return listScope;
        },
        'get_contentData': function(){
            return contentData;
        }
    }

}])
.directive('basicFun', ['$timeout', '$rootScope','$state','Req_data',function($timeout,$rootScope,$state,Req_data) {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: './templates/basic.html',
        scope: {
            s_addr: '@saddr',
            d_addr: '@daddr'
        },
        controller: function($scope){
            $scope.newsBtn = $scope.d_addr;
            $scope.contentBtn = function(newsId,index){
                $scope.newsId = newsId;
                $scope.index = index;
                Req_data.transferScope($scope);
            };
            
        },
        link: function(scope, element, attrs) {
            var currentPage = 0,  //后台默认从1开始
                pageSize = 7;
            scope.newscontant = [];
            scope.refreshTips = false;
            var time_re,time_lo;
            //刷新操作  
            scope.doFresh = function(){
                time_re && $timeout.cancel(time_re);
                time_re = $timeout(function(){           
                    currentPage = 0;
                    basicFunHttp(function(data){
                        scope.refreshTips = false;
                        scope.newscontant = data.docList;
                        console.log(scope.newscontant);
                        scope.$broadcast('scroll.refreshComplete');
                        scope.noMoreItemsAvailable = false;
                    },function(){
                        scope.$broadcast('scroll.refreshComplete');
                        scope.refreshTips = true;
                                     
                    });
                },500); 
            }
            //加载更多
            scope.noMoreItemsAvailable = false;
            scope.refreshTips = false;
            scope.loadMore = function() {
                time_lo && $timeout.cancel(time_lo);
                time_lo = $timeout(function(){
                    scope.refreshTips = false;
                    basicFunHttp(function(data){                       
                        if ( data.docList.length !== 0 ) {
                            for(var i = 0; i < data.docList.length; i++) {
                                scope.newscontant.push(data.docList[i]);
                            };               
                        }
                        else {
                            scope.noMoreItemsAvailable = true;
                        }
                        scope.$broadcast('scroll.infiniteScrollComplete');      
                    },function(){
                        scope.noMoreItemsAvailable = true;
                        scope.$broadcast('scroll.infiniteScrollComplete');
                        scope.refreshTips = true;   
                    }); 
                },500); 
            };
            //动态快讯数据请求
            function basicFunHttp(success,error){
                scope.refreshTips = false;
                Req_data.get_httpReq(scope.s_addr,{'currentPage':++currentPage,'pageSize':pageSize}).success(function(data, status, headers, config){
                    data.invalidSession?$state.go('login'):success(data);          
                }).error(function(data, status, headers, config){           
                    console.log('请求失败');
                    error();
                });
            }
        }
        
    };
}])

//新闻详细
.controller('contentController', ['$scope', '$rootScope','$ionicHistory','$ionicScrollDelegate','$timeout','ionicToast','Req_data',function($scope,$rootScope,$ionicHistory,$ionicScrollDelegate,$timeout, ionicToast, Req_data) {
        var listScope = Req_data.get_listScope();
        init_data();
        $scope.sendComment=function(){
            var str = $scope.content;
            if(str && str.trim().length > 0){
                str = str.replace(/(\r)*\n/g,"<br/>");
                ionicToast.show('发送中', 'bottom','', false, 1000);

                Req_data.get_content(listScope.newsBtn,'Comment',{'id': listScope.newsId, 'content': decToHex(escapeEmoji(str))}, function(data){

                    Req_data.get_content(listScope.newsBtn,'Detail',{'id': listScope.newsId},function(data){
                        $scope.comments=data.comments; 
                        $scope.commentsCount=data.comments.length;

                        listScope.newscontant[listScope.index].commentCount = data.comments.length;
                    })

                    init_style();
                    //初始化textarea
                     init_textarea();
                    //提示
                    ionicToast.show('评论发布成功!', 'bottom','yes', false, 1000);

                })
            }
            else{
                $scope.content=null; 
                ionicToast.show('输入的评论不能为空', 'bottom','warn', false, 1000);
                //初始化textarea
                init_textarea();
            }  
        }
        //公司新闻点赞
        $scope.praise = function(){
            if($scope.praiseBorder == "icon-yuan"){
                $rootScope.tips="点赞失败";
                Req_data.get_content(listScope.newsBtn,'Praise',{'id': listScope.newsId}, function(data){
                    $scope.praiseCount = data.praiseCount;
                    Req_data.get_content(listScope.newsBtn,'Detail',{'id': listScope.newsId}, function(data){
                        $scope.praises = data.praises;
                        listScope.newscontant[listScope.index].praiseCount = data.praiseCount;
                        data.hasPraise?$scope.praiseBorder = "praiseBorder":$scope.praiseBorder = "icon-yuan";
                        console.log('请求成功'); 
                    })

                });
            }
        };
        //解码emoji
        function escapeEmoji(str){
            return escape(str);
        }
        function decToHex(str) { 
            if(str){
                var res="",c; 
                for(var i=0;i <str.length;i++){ 
                    c=str.charCodeAt(i);
                    // res+=( c==35 || c==37 || c==38 || c==43 || c==47 || c==61 || c==63)?"%"+c.toString(16):str.charAt(i);
                    if(c==35 || c==37|| c==38 || c==43 || c==47 || c==61 || c==63){
                        res+= "%"+c.toString(16);
                    }
                    else {
                        res+= str.charAt(i);
                    }
                } 
                return res; 
            }
            else{
                return "";
            }
        } ;
        
        //将br标记替换为换行
        $scope.replaceBr=function(content){
            return unescape(content).replace(/<br\/>/g,'\r\n');
        };

        
        function init_textarea(){
           //初始化textarea
           var textarea = document.getElementById('ping'),
               tMirror = document.getElementById('tMirror');
           tMirror.value = '';
           textarea.setAttribute('style', 'height: 25px; overflow-y: hidden')
           $scope.content=null;
        }
        $rootScope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
        };
        $scope.change = function() {
            
            $scope.one=false;
            $scope.send=true;
            $scope.mystyle={borderColor:'#eb500a'};
            $scope.txt="请输入……";
            $scope.mask=true;
        };      
        $scope.return= function(){
           init_style();
        };
        function init_style(){
           $scope.one=true;
           $scope.send=false;
           $scope.mystyle={borderColor:'#666'};
           $scope.txt="我也评论一句";
           $scope.mask=false;
        };
        
        var backBtnTimer = null;

        $scope.backward = function(){
            $ionicHistory.goBack(-1);
        };
        
        function init_data(){
            var data = Req_data.get_contentData();
            $scope.newsDetail = data.docDetail;
            $scope.point=true;
            
            if(data.docDetail.docdepartmentname == null||data.docDetail.docdepartmentname==""){
                $scope.point=false;
            }
            $scope.praiseCount = data.praiseCount;
            $scope.praises = data.praises;
            if(data.hasPraise){
                $scope.praiseBorder = "praiseBorder";
                $scope.praise = null;
            }
            else{
                $scope.praiseBorder = "icon-yuan";
            }   
            $scope.comments=data.comments;
            $scope.commentsCount=data.comments.length;
            init_style();
        }

}])

.controller('aboutController', function($scope) {
    $scope.title='aboutContent'; 
})
.controller('freeHomeController', function($scope) {

    $scope.title='freeHomeController';

})
// 发表心之声
.controller('PublishCtrl', function($scope, $cordovaCamera) {

  document.addEventListener("deviceready", function () {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
        alert("成功")
      var image = document.getElementById('myImage');
      image.src = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      alert(err)
    });

  }, false);
});






