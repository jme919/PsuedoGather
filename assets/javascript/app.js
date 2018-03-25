console.log("It's alive!!!")
var volunteer
var music
var food
var concert
var create
var eventfulURL
var image
var eventDate
var eventTime
var imageName
// ---------------------------------------------------CREATE YOUR OWN EVENT PAGE----------------------------------------------
//  Initialize Firebase//
 var config = {
    apiKey: "AIzaSyC_KjDmCKyHZm_U9NbGWx8CXsfJ6E_Udu0",
    authDomain: "gatherva-ef25f.firebaseapp.com",
    databaseURL: "https://gatherva-ef25f.firebaseio.com",
    projectId: "gatherva-ef25f",
    storageBucket: "gatherva-ef25f.appspot.com",
    messagingSenderId: "19856738575"
  };
  firebase.initializeApp(config);

var database = firebase.database();
var storageRef = firebase.storage();

// Button for adding event
$("form").submit( function(event) {
  event.preventDefault();

  // Grabs user input//
  var eventName = $("#event-name-input").val().trim();
  var details = $("#details-input").val().trim();
  var date = $("#date-input").val().trim();//have not looked in to date yet//
  var email = $("#inputEmail3").val().trim(); 
  var category = $("#cat").val().trim(); 

  //uploading photos/files to storage//
var uploader = document.getElementById("uploader");
var fileButton = document.getElementById("fileButton");
//listen for file selection//
     //Get file
    var file = fileButton.files[0];
    console.log('File: %O', file);
    console.log('image name: ' + imageName);
    //create a storage ref
     // storageRef.ref("event_photos/" + file.name);
    //upload file
    var task = storageRef.ref("event_photos/" + file.name).put(file);
    console.log('task: ' + task.fullPath)
    imageName = file.name;
    //update progress bar
    task.on("state_changed",
        function progress(snapshot){
            console.log('Progress: %O', snapshot);
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.value = percentage;
        },
        function error(err) {
        }, 
        function complete() {
        }
    );



// storageRef.on("child_added", function(imageSnapshot, prevChildKey){
  // console.log(imageSnapshot.val());


// });

  // Creates local object for holding event data//
  var newEvent = {
    name: eventName,
    details: details,
    date: date,
    email: email,
    category: category,
    image: imageName,
  };

  // Uploads event data to the database//
  database.ref().push(newEvent);

  $("#event-name-input").val("");
  $("#details-input").val("");
  $("#date-input").val("");
  $("#inputEmail3").val("");
  $("#cat").val("");
  $("#fileButton").val().trim();
  // Clears all of the text-boxes//


  // Logs everything to console//
  console.log(newEvent.name);
  console.log(newEvent.details);
  console.log(newEvent.email);
  console.log(newEvent.date);
  console.log(newEvent.category);
  console.log(newEvent.image);


  // This needs to be changed to a modal???///
  alert("New Event Has Been Added");

  });



//  Create Firebase event for adding new event to 
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

 console.log(childSnapshot.val());1
 var edate = childSnapshot.val().date;
 var formatDate = moment(edate).format("dddd, MMMM Do YYYY");
 var grabName = childSnapshot.val().image; 
 console.log('grab name: ' + grabName) ;
// var pathReference = storageRef.ref('images/stars.jpg');
  var imgSrc;
  storageRef.ref().child('event_photos/' + grabName).getDownloadURL().then(function(url) {
 imgSrc = url;
 })
  $("#userevents").append(`

 <div class="card m-3 myCard" style="width: 18rem;">
            <img class="card-img-top myCardImg" src="${imgSrc}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${childSnapshot.val().name}</h5>
                    <strong>Category:</strong><span>${childSnapshot.val().category}
                     <p><strong>Date:</strong><span>${formatDate}</span></p>
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            View More
                        </button>
                    <div class="dropdown-menu myDropDown" aria-labelledby="dropdownMenu2">
                        <p class="m-3">${childSnapshot.val().details} </p>
                    </div>
                </div>
            </div>
        </div>


    `)

  });
 


//   --------------------------------------------------------------------------------------------------------

//categories from eventful: music, food



// -------------------------------------------------MUSIC PAGE---------------------------------------------------
//for music from eventful
$(document).ready(function(){
    console.log("test1")
    eventfulURL = "http://api.eventful.com/json/events/search?app_key=DGg6NJ2vxT6RkDrW&location=Richmond,+VA&date=Next+week&c=music"
    $.ajax({
        url: eventfulURL,
        method: "Get",
    }).then(function(response){
        console.log(JSON.parse(response));
        for(i=0; i<10; i++){
            music = JSON.parse(response);
            console.log("This is the moment:" + music.events.event[i].start_time);
            eventDate = moment(music.events.event[i].start_time).format("dddd, MMMM Do YYYY, h:mm:ss a");
            eventTime = moment(music.events.event[i].start_time).format("dddd, MMMM Do YYYY, h:mm:ss a");
            if(music.events.event[i].image === null){
                image = "https://images.pexels.com/photos/196652/pexels-photo-196652.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            }else{
                image = music.events.event[i].image.medium.url
            }
            // $("#musicPageInfo").append
            $("#musicPageInfo").append(`<div class="card m-3 myCard" style="width: 18rem;">
                    <img class="card-img-top myCardImg" src=${image}>
                        <div class="card-body">
                            <p class="card-title"><a href="${music.events.event[i].url}">Performer: ${music.events.event[i].title}</a></p>
                            <p class="card-location">Location: ${music.events.event[i].venue_name}</p>
                            <p class="card-date">Date: ${eventDate}</p>
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    View More
                                </button>
                            <div class="dropdown-menu myDropDown" aria-labelledby="dropdownMenu2">
                                <p class="m-3">Description: ${music.events.event[i].description}</p>
                                <p class="m-3">Venue: ${music.events.event[i].venue_name}</p>
                                <p class="m-3">Venue Address: ${music.events.event[i].venue_address}</p>
                            </div>
                        </div>
                    </div>
                </div>`) 
        }        
    })
})
// -------------------------------------------------------FOOD PAGE----------------------------------------------------------
//for food from eventful
$(document).ready(function(){
    console.log("test2")
    eventfulURL = "http://api.eventful.com/json/events/search?app_key=DGg6NJ2vxT6RkDrW&location=Richmond,+VA&date=Next+week&c=food"
    $.ajax({
        url: eventfulURL,
        method: "Get",
    }).then(function(response){
        console.log(JSON.parse(response))
        for(j=0; j<10; j++){
            food = JSON.parse(response)
            if(food.events.event[j].image === null){
                image = "https://images.pexels.com/photos/5929/food-salad-dinner-eating.jpg?auto=compress&cs=tinysrgb&dpr=2&h=350"
            }else{
                image = food.events.event[j].image.medium.url
            }
            // $("#foodPageInfo").append
            $("#foodPageInfo").append(`<div class="card m-3 myCard" style="width: 18rem;">
                    <img class="card-img-top myCardImg" src=${image}>
                        <div class="card-body">
                            <p class="card-title"><a href="${food.events.event[j].url}">Performer: ${food.events.event[j].title}</a></p>
                            <p class="card-location">Location: ${food.events.event[j].venue_name}</p>
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    View More
                                </button>
                            <div class="dropdown-menu myDropDown" aria-labelledby="dropdownMenu2">
                                <p class="m-3">${food.events.event[j].description}</p>
                                <p class="m-3">${food.events.event[j].start_time}</p>
                                <p class="m-3">${food.events.event[j].venue_address}</p>
                                <p class="m-3">Date: ${food.events.event[j].start_time}</p>
                            </div>
                        </div>
                    </div>
                </div>`)
        }        
    })
})


// //potentially deleting this
// $("#concert").on("click", function(){


// })

// $("#create").on("click", function(){


// })



//How to obtain list of categories
// eventfulURL = "http://api.eventful.com/rest/categories/list?app_key=DGg6NJ2vxT6RkDrW"
// $.ajax({
//     url: eventfulURL,
//     method: "Get",
// }).then(function(response){
//     console.log(response)
// })
// --------------------------------------------------------MARATHON PAGE---------------------------------------
$("#volunteer").on("click", function () {
    // var justServe = $(this).attr("data-name");
//   start_date=2013-07-04..
    var queryURL = "https://api.amp.active.com/v2/search?query=running&category=event&near=Richmond,VA,US&radius=50&api_key=f52rg4rp2bv9dw9q2n4anp9j"
    console.log("yay api");
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      console.log(response.results.length);
      var marathonImage;

      for (var s=0; s<response.results.length; s++){
        console.log(response.results[s].assetName);
        var eventtime = moment(response.results[s].activityStartDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
        $("#marathonPageInfo").append(`
        <div class="card m-3 myCard" style="width: 18rem;">
            <img class="card-img-top myCardImg" src="${response.results[s].assetImages[0].imageUrlAdr}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${response.results[s].assetTopics[0].topic.topicTaxonomy}</h5>
                    <p><strong>Category:</strong> ${response.results[s].assetName} </p>
                    <p><strong>Location:</strong> ${response.results[s].place.placeName}</p>
                    <p><strong>Date:</strong> ${eventtime}</p>
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            View More
                        </button>
                    <div class="dropdown-menu myDropDown" aria-labelledby="dropdownMenu2">
                        <p class="m-3">Address: ${response.results[s].place.addressLine1Txt},${response.results[s].place.cityName},${response.results[s].place.stateProvinceCode},${response.results[s].place.countryName}</p>
                        <p>Description:${response.results[s].assetDescriptions[0].description}</p>
                    </div>
                </div>
            </div>
        </div>

      `)
      }
      
    })

})


// if(music.events.event[i].image === null){
//     image = "https://images.pexels.com/photos/196652/pexels-photo-196652.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
// }else{
//     image = music.events.event[i].image.medium.url
// }