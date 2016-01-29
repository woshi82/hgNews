angular.module('camera.ctrl', [])

  .controller('CameraCtrl', function ($scope, $cordovaCamera) {
    $scope.takePicture = function () {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum:true
      };
      $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.cameraimage = "data:image/jpeg;base64," + imageData;
      }, function (err) {
		console.log(err);
      });
    };

    $scope.takePhoto = function () {
      var options = {
        quality:50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      };
      // udpate camera image directive
      $cordovaCamera.getPicture(options).then(function (imageURI) {
        $scope.cameraimage =imageURI;
        alert(imageURI);
      }, function (err) {
    alert(err);
      });
    };

    
  });
