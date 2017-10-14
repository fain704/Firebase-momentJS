// Initialize Firebase
// Initialize Firebase
var config = {
apiKey: "AIzaSyAkUQtAzkJ1lOncrdCACG7m2tqltr-A4CY",
authDomain: "traindepot-e1b8d.firebaseapp.com",
databaseURL: "https://traindepot-e1b8d.firebaseio.com",
projectId: "traindepot-e1b8d",
storageBucket: "traindepot-e1b8d.appspot.com",
messagingSenderId: "505232323852"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Initial Values
var name = "";
var destination = "";
var firstTime = "";
var freq = 0;

$("#submit").on("click", function(event) {
    event.preventDefault();

    name = $("#name").val().trim();
    destination = $("#dest").val().trim();
    firstTime = moment($("#firstTime").val().trim(),"HH:mm").format("HH:mm a");
    freq = $("#freq").val().trim();

    database.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime,
        freq: freq,
    });

    $("#name").empty();
    $("#dest").empty();
    $("#firstTime").empty();
    $("#freq").empty();
});
// Firebase watcher + initial loader + order/limit HINT: .on("child_added"
database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    var currentTime = moment();
    var trainStartConverted = moment(sv.firstTime, "HH:mm").subtract(1, "years");
    var diffTime = moment(currentTime).diff(moment(trainStartConverted),"minutes");
    var remainder = diffTime % sv.freq;
    var minutes = sv.freq - remainder;
    var nextTrain = moment(moment(currentTime).add(minutes, "minutes")).format("hh:mm");

    var tr = $("<tr>");
    tr.append("<td>"+sv.name+"</td>");
    tr.append("<td>"+sv.destination+"</td>");
    tr.append("<td>"+sv.freq+"</td>");
    tr.append("<td>"+ nextTrain +"</td>");
    tr.append("<td>"+ minutes +"</td>");

    $("#tableBody").append(tr);
    

    // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

