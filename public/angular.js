angular.module('Donate',[])
.controller('ctrldetails',function($scope,$http)
{
    $http.get('http://127.0.0.1:5800/creatorprofile')
    .success(function(response)
    {
        $scope.table=response;
    })

$scope.donate=function(cryptId)
    {
        
        $http.get('http://127.0.0.1:5800/transfer/'+cryptId)
        .success(function(response)
        {
            $scope.tab=response;

            // let popup=document.getElementById("popup");
            // popup.classList.add("open-popup");


            // $http.get('http://127.0.0.1:5800/getjson')
            // .success(function(response)
            //  {
            //          $scope.table=response;
            //     })
        })
    }
})

angular.module('Transactions',[])
.controller('ctrldetails',function($scope,$http)
{
    $http.get('http://127.0.0.1:5800/alltransactions')
    .success(function(response)
    {
        $scope.table=response;
    })
    

})