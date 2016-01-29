angular.module('elasticText', [])
.directive('msdElastic', function($window){
	return {
		require: 'ngModel',
		restrict: 'AC',
        link: function(scope, element, attrs, ngModel) {
        	var $textarea = element,
        		textarea = element[0],
        		$mirror = angular.element('<textarea id="tMirror" style="position: absolute; left: -9999px; le ft: 5px;  top: 80px; width: 100%; height: 25px; resize: none; overflow-y: scroll; " ></textarea>'),
        		mirror = $mirror[0];

    		$textarea.after($mirror)
    		$textarea.on('input', function(){
    			mirror.value = this.value; 
    			resize();

    		})
    		function resize(){
    			var nowH = mirror.scrollHeight;
    			if(nowH > 64){
    				nowH = 64;
    				$textarea.css('overflow-y', 'scroll');
    			}
    			else {
    				$textarea.css('overflow-y', 'hidden');
    			}
    			textarea.style.height = nowH + 'px';
    		}
        }

	}


})