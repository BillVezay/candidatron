angular
  .module('candidatronApp', ['ng','ngMaterial','ngAnimate','ngAria'])
  .controller('candidatronController', function($scope, $http) {
    

  
    /* INITIALIZATION */


    var configData = {
      'picturesPath' : './resources/faces/',
      'jsonPath' : './resources/candidates.json',
      'picturesExtension' : '.jpg',
      'separators' : {
        'json' : '/',
        'picturePath' : '-',
        'name' : '-',
        'url' : '-'
      }
    }

    var url = window.location.href; 
    var numberOfCandidates ; 

    $scope.urlToShare = '';
    $scope.candidatesList = [];
    $scope.mixed_candidate = {};
    $scope.displayedCandidates = [];
    $scope.selectedIDs = [];

    $http.get(configData.jsonPath)
       .then(function(result){
        for (var key in result.data) {
          $scope.candidatesList.push(result.data[key]);
        }
          numberOfCandidates = $scope.candidatesList.length;
          $scope.loadFromURL();             
        });


    /* END OF */
    /* INITIALIZATION */



    $scope.triggerSwitchCandidates = function () {
      var temp = $scope.displayedCandidates[0];
      $scope.displayedCandidates[0] = $scope.displayedCandidates[1];
      $scope.displayedCandidates[1] = temp;
      $scope.updateMixedCandidate();
    };

    $scope.triggerSelectCandidate = function (thisPosition) {
      var thisID = $scope.selectedIDs[thisPosition];
      $scope.displayedCandidates[thisPosition] = $scope.candidatesList[thisID];
      $scope.updateMixedCandidate();
    };

    $scope.triggerRandomizeAll = function () {
      $scope.randomizeCandidate(0);
      $scope.randomizeCandidate(1);
      $scope.updateMixedCandidate();

    };


    $scope.triggerRandomizeCandidate = function (thisPosition) {
      $scope.randomizeCandidate(thisPosition);
      $scope.updateMixedCandidate();
    };


    $scope.randomizeCandidate = function (thisPosition) {
      var forbiddenValue = -1
      if ($scope.displayedCandidates[thisPosition]) {
        forbiddenValue = $scope.displayedCandidates[thisPosition].ID;
      }
      
      var randomCandidateID = Math.floor((Math.random()*numberOfCandidates));
      while (randomCandidateID == forbiddenValue) {
        randomCandidateID = Math.floor((Math.random()*numberOfCandidates));
      }

      $scope.displayedCandidates[thisPosition] = $scope.candidatesList[randomCandidateID];
    };



    $scope.updateMixedCandidate = function(){
      var candidate0 = $scope.displayedCandidates[0];
      var candidate1 = $scope.displayedCandidates[1];

      console.log(candidate0);
      console.log(candidate1);

    $scope.mixed_candidate = 
      {
        name : $scope.getMixName(candidate0.firstname, candidate0.lastname, candidate1.firstname, candidate1.lastname),
        pictureURL : $scope.getMixPictureURL(candidate0.ID,candidate1.ID),
        slogan : $scope.getMixSlogan(candidate0.slogan,candidate1.slogan),
        party : $scope.getMixParty(candidate0.party,candidate1.party)
      };

      $scope.selectedIDs[0] = $scope.displayedCandidates[0].ID;
      $scope.selectedIDs[1] = $scope.displayedCandidates[1].ID;

      $scope.updateURL();

    };


    /* MIX FUNCTIONS */
   
    $scope.getMixName = function(firstname0, lastname0, firstname1, lastname1) {
      //todo 
      //cases not treated :
      // > both firstnames or both lastnames are compound
      // > separator is different than configData.separator.name

      var thisSeparator = configData.separators.name;
      var firstnameMix = firstname0;
      var lastnameMix = lastname1;

      if($scope.isNameCompound(firstname0)) {
        firstname0_array = firstname0.split(thisSeparator);
        firstnameMix = firstname1+thisSeparator+firstname0_array[1];
      }

      if ($scope.isNameCompound(firstname1)) {
        firstname1_array = firstname1.split('-');
        firstnameMix = firstname1_array[0]+thisSeparator+firstname0;
      }

      if($scope.isNameCompound(lastname0)) {
        lastname0_array = lastname0.split(thisSeparator);
        lastnameMix = lastname1+thisSeparator+lastname0_array[1];
      }

      if($scope.isNameCompound(lastname1)) {
        lastname1_array = lastname1.split(thisSeparator);
        lastnameMix = lastname1_array[0]+thisSeparator+lastname0;
      }

      var nameMix = firstnameMix+' '+lastnameMix;
      return nameMix;
    };

   $scope.getMixPictureURL = function (ID0, ID1) {
      var mixPictureURL = configData.picturesPath+ID0+configData.separators.picturePath+ID1+configData.picturesExtension;
      return mixPictureURL;
    }

    $scope.getMixSlogan = function (slogan0, slogan1) {
      var slogan0_array = slogan0.split(configData.separators.json);
      var slogan1_array = slogan1.split(configData.separators.json);
      var sloganMix = slogan0_array[0]+' '+slogan1_array[1];
      return sloganMix;
    }

    $scope.getMixParty = function (party0, party1) {
      var party0_array = party0.split(configData.separators.json);
      var party1_array = party1.split(configData.separators.json);
      var partyMix = party0_array[0]+' '+party1_array[1];
      return partyMix;
    }

    /* END OF */
    /* MIX FUNCTIONS */


    /*  URL LOGIC */

  $scope.removeHashFromURL = function () {
    history.pushState("", document.title, location.pathname);
  };


    $scope.updateURL = function () {
      var hashresult = $scope.hashFromIDs($scope.displayedCandidates[0].ID, $scope.displayedCandidates[1].ID);
      if(history.pushState) {
        history.pushState(null, null, hashresult);
      }
      else {
        location.hash = hashresult;
      }
      $scope.urlToShare = 'http://www.billvezay.fr/candidatron#'+$scope.displayedCandidates[0].urlname+configData.separators.url+$scope.displayedCandidates[1].urlname;   
      $scope.urlToShare_encoded = encodeURIComponent($scope.urlToShare);
      console.log($scope.urlToShare);
      console.log($scope.urlToShare_encoded);
    };

  $scope.loadFromURL = function () {
    if (location.hash) {
      var array_urlnames = location.hash.substring(2).split(configData.separators.url);
      var ID0 = -1 ;
      var ID1 = -1 ;
      for (var i = 0 ; i < numberOfCandidates ; i++) {
        if ($scope.candidatesList[i].urlname == array_urlnames[0]) {
          ID0 = i;
        }
        if ($scope.candidatesList[i].urlname == array_urlnames[1]) {
          ID1 = i;
        }
      }
      if (ID0 > -1 && ID1 > -1) {
        $scope.displayedCandidates[0] = $scope.candidatesList[ID0];
        $scope.displayedCandidates[1] = $scope.candidatesList[ID1];
        $scope.updateMixedCandidate();
      }
    } 
    else {
      console.log("error : wrong URL");
      $scope.removeHashFromURL();
      $scope.triggerRandomizeAll();
    }
  };



    $scope.hashFromIDs = function (ID0, ID1) {
     var hash = '#'+$scope.candidatesList[ID0].urlname+configData.separators.url+$scope.candidatesList[ID1].urlname;
     return hash;
   };


    /* END OF */
    /* URL LOGIC */


    /* TOOLBOX */

    $scope.isNameCompound = function (thisString) {
      return (thisString.includes(configData.separators.name));
    }

    /* END OF */
    /* TOOLBOX */



  });