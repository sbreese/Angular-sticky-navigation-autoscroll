'use strict';

angular.module('MarriottStickyNavigation', [
    'ngRoute',
    'ngCookies',
    'duScroll',
    'mm.foundation',
    'angular.vertilize'
]).

config(['$routeProvider', '$locationProvider',function ($routeProvider, $locationProvider) {
    $routeProvider.when('/home', {templateUrl: 'html/views/home.html', controller: 'homeCtrl'});
    $routeProvider.when('/', {templateUrl: 'html/views/home.html', controller: 'homeCtrl'});

    $routeProvider.otherwise({redirectTo: '/'});

    /* Uncomment to remove # sign from URL.  Must add base tag to HTML if not to level directory.
     $locationProvider.html5Mode({
     enabled: true,
     requireBase: false
     });
     */
}]).

// Setup scroll easing for duScroll directive
value('duScrollEasing', function (t) { return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; }).
value('duScrollDuration', 700); // .value('duScrollOffset', 0)
'use strict';

angular.module('MarriottStickyNavigation').controller('homeCtrl', [
    '$scope',
    '$rootScope',
    '$window',
    '$document',
    '$timeout',
    '$q','$modal', '$log',
    'scrollService',
    function($scope, $rootScope, $window, $document, $timeout, $q, $modal, $log, scrollService){

        $scope.selectedTravelerType = null;

        $scope.toggleTravelerType = function(travelerType){

            //var travelerTypeResult = ($scope.selectedTravelerType === travelerType) ? null : travelerType;
            //selectTopDestination(travelerTypeResult);
            if (window.innerWidth<= 300) {
                var scrollOffset = 154;
            } else if (window.innerWidth>= 300 && window.innerWidth<= 413) {
                var scrollOffset = 105;
            } else if (window.innerWidth>= 414 && window.innerWidth<= 569) {
                var scrollOffset = 80;
            } else if (window.innerWidth>= 570 && window.innerWidth<= 768) {
                var scrollOffset = 98;
            } else if (window.innerWidth>= 768 && window.innerWidth<= 991) {
                var scrollOffset = 143;
            } else if (window.innerWidth>= 992 && window.innerWidth<= 1199) {
                var scrollOffset = 170;
            } else if (window.innerWidth>= 1200) {
                var scrollOffset = 185;
            } else {
                var scrollOffset = 145;
            }

            scrollService.scrollToElement($document.find('#'+travelerType), scrollOffset);

        };

        function selectTopDestination(travelerType){
            $scope.selectedTravelerType = travelerType;
        }

        var isiPad = navigator.userAgent.match(/iPad/i) != null;

        if (isiPad) {

        }

    }
]);

angular.module('MarriottStickyNavigation')
    .directive('stickyHeader', [
        '$document',
        '$timeout',
        '$rootScope',
        function ($document, $timeout, $rootScope) {

            var STICKY_OFFSET = 40; // offset of element when in "sticky" mode - should match .sticky-header's CSS top property

            function linkFunction(scope, element, attrs) {
                // scroll offset when the input becomes sticky
                var scrollThreshold;

                // keep track of if we are in sticky mode or not
                var isSticky = false;

                // find the internal input element to get it's position
                var inputElement = element.find('.search-wrapper'); //  nav-full start-sticky

                // set initial scroll threshold
                setScrollThreshold();

                // watch for window resize to recalculate when the element should stick
                $rootScope.$on('window.resize', function(){
                    setScrollThreshold();
                });

                $document.on('scroll', function(){
                    updateStickyState();
                });

                function setScrollThreshold(){
                    // don't do anything here if already sticky
                    if (isSticky){
                        return;
                    }

                    // set the threshold for when the element will become sticky - essentially happens once the input
                    // reaches the top, so use the input's top offset
                    // do this in a timeout so elements have time to adjust
                    $timeout(function(){
                        console.log("Element Offset: "+ inputElement.offset().top);
                        console.log("newThreshold: "+ (inputElement.offset().top  - STICKY_OFFSET));
                        var newThreshold = inputElement.offset().top - STICKY_OFFSET;
//alert(newThreshold);
                        // if the threshold changed, set the new threshold and update sticky state
                        if (scrollThreshold !== newThreshold){
                            scrollThreshold = newThreshold;
                            updateStickyState();
                        }
                    }, 100);

                }

                function updateStickyState(){
                    // add/remove sticky class based on scroll position
                    if ($document.scrollTop() >= scrollThreshold){
                        element.addClass('sticky-header');
                        isSticky = true;
                    }
                    else {
                        element.removeClass('sticky-header');
                        isSticky = false;
                    }
                }
            }

            return {
                restrict: 'A',
                link: linkFunction
            };
        }
    ]);
'use strict';

angular.module('MarriottStickyNavigation').factory('scrollService', [
    '$document',
    '$timeout',
    function ($document, $timeout) {

        var timeoutDuration = 50;

        function scrollToElement(element, offset){
            $timeout(function () {
                $document.scrollToElementAnimated(element, offset);
            }, timeoutDuration);
        }

        function hideKeyboard() {
            document.activeElement.blur();
            var inputs = document.querySelectorAll('input');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].blur();
            }
        }

        function scrollToElementById(elementId, offset){
            var element = angular.element($document).find(elementId);
            if (element.length > 0) {
                scrollToElement(element, offset);
                setTimeout(function(){ hideKeyboard();}, 1000);
            }
        }

        return {

            // Do an animated scroll to the given element by ID
            scrollToElementById: function (elementId, offset) {
                scrollToElementById(elementId, offset);
            },

            // Do an animated scroll to the given element
            scrollToElement: function (element, offset) {
                scrollToElement(element, offset);
            }

        };

    }
]);
'use strict';
