angular.module('betaberry.darkhounds.net').directive('viewport', [function()    {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/viewport.html',
        controller:     ['$scope', function($scope)                             {
            
        }]
    };
}]);
