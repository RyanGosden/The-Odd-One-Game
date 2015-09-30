$(function() {

  var boardLevel = 0;
  var colourDegree = [0.3, 0.2, 0.1, 0.09, 0.06];
  var degreeValue = colourDegree[0];
  var arrayPosition = colourDegree.indexOf(degreeValue);
  var startTime;
  var endTime;
  var wrongBoxes = 0;
  var mouseX, mouseY;

  var board = [{
    size: 9,
    pixels: 180
  }, {
    size: 16,
    pixels: 240
  }, {
    size: 25,
    pixels: 300
  }, {
    size: 36,
    pixels: 360
  }, {
    size: 49,
    pixels: 420
  }];

//############# Preloader ######################################################
  var correct = loadAudio('audio/correct');
  var error = loadAudio('audio/error');
  var start = loadAudio('audio/start');
  var gameover = loadAudio('audio/gameover');
  var filesToLoad = 4;
  var filesLoaded = 0;

  function loadAudio(uri)
{
    var audio = new Audio();
    audio.addEventListener('canplaythrough', isAppLoaded, false); // It works!!
    audio.src = Modernizr.audio.ogg ?  uri +'.ogg' :
                Modernizr.audio.mp3 ?  uri +'.mp3' :
                                       url +'.m4a';
    return audio;
}

function isAppLoaded()
{
    filesLoaded++;
    if (filesLoaded === filesToLoad){
    main();
    }
}

function main(){
  //get window size
  windowSize();
  //initially hide container and penalty warning
  $("#menu").fadeIn(900);
}

//load highScore
if(typeof(Storage) !== "undefined") {
  var highScore = localStorage.getItem("highScore");
  if(!highScore){
    $('#hscore').text("0");
  }
  else{
    $('#hscore').text(highScore);
  }
} else {

}


  //initiate menu
function windowSize(){
  var windowHeight = window.innerHeight;
  var windowCenter = windowHeight/2;
  //menu container
  var menuLength = $("#menu").height();
  var menuPadding = (windowHeight-menuLength)/2;
  $("#menu").css("margin-top", menuPadding);
  //menu container
  var descLength = $("#desc").height();
  var descPadding = (windowHeight-descLength)/2;
  $("#desc").css("margin-top", descPadding);
  //box-container container
  var containerLength = $("#container").height();
  var containerPadding = (windowHeight-containerLength)/2;
  $("#container").css("margin-top", containerPadding);
  //Penalty centre
  $("#penalty").css("top", (windowCenter-40));
}

  $( window ).resize(function() {
  windowSize();
  });



function generateBoard(degree) {
  var size = board[boardLevel].size;
  var pixels = board[boardLevel].pixels;

  $("#container").css("width", pixels);
  $("#container").css("height", pixels);
  windowSize();
  for (var i = 0; i < size; i++) {
    $('#container').append('<div class="box"></div>');
  }
    $("#container").fadeIn(1800);
    generateColour(size, degree);
}

function generateColour(size, degree) {
  var randomBox = (Math.floor(Math.random() * (size - 1 + 1)) + 1) - 1;
  var colourSet = getRandomColours(degree);
  $(".box").css("backgroundColor", colourSet[0]);
  $(".box").eq(randomBox - 1).css("backgroundColor", colourSet[1]).addClass("unique");
}

function getRandomColours(degree) {
  var letters = '0123456789ABCDEF'.split('');
  var bkColour = '#';
  var unColour = '#';
  var colourSet = [];

  for (var i = 0; i < 6; i++) {
    bkColour += letters[Math.floor(Math.random() * 16)];
  }

  colourSet.push(bkColour);
  unColour = ColourLuminance(bkColour, degree); // "#7ab8f5" - 20% lighter
  colourSet.push(unColour);
  return colourSet;
}

function ColourLuminance(hex, lum) {
// validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    // convert to decimal and change luminosity
    var rgb = "#",
      c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}

$(document).on("click", ".box", function() {
  if ($(this).hasClass('unique')) {
  correct.play();

  $( ".box" ).remove();
  $(document.body).css("backgroundColor", "green");
  setTimeout(function(){
  $(document.body).css("backgroundColor", "#262626");
  }, 100);

  if (arrayPosition < (colourDegree.length) - 1) {
    generateBoard(colourDegree[arrayPosition]);
    arrayPosition = arrayPosition + 1;
    colourDegree[arrayPosition];
    }
  else {
    degreeValue = colourDegree[0];
    arrayPosition = colourDegree.indexOf(degreeValue);

      if (boardLevel < (board.length) - 1) {
          boardLevel++;
          generateBoard(colourDegree[arrayPosition]);
      } else {
          $('.box').remove();
          endTime = new Date($.now());
          var timeScore = Math.abs((endTime-startTime)+wrongBoxes);
          $("#score").append(timeScore);
            if(timeScore < highScore || !highScore){
              localStorage.setItem('highScore', timeScore);
              $('#hscore').text(timeScore);
            }
            gameover.play();
            $("#container").fadeOut(400);
            $("#menu").fadeIn(800);
            }
        }

  } else {
      wrongBoxes = wrongBoxes + 5;
      error.play();
      $( "#container" ).effect( "shake" );
      $("#penalty").css({ "top" : (mouseY-25),
                          "left" : (mouseX-25)});
      $( "#penalty" ).fadeIn(100).effect( "puff" );
      $(document.body).css("backgroundColor", "red");
      setTimeout(function(){
        $(document.body).css("backgroundColor", "#262626");
      }, 100);
  }
});

$('#start-button').on('click', function(){
 start.play();
 $("#menu").fadeOut(100, function(){
   $("#score").empty();
   boardLevel = 0;
   wrongBoxes = 0;
   startTime = new Date($.now());
   generateBoard(degreeValue); //Initial Call on load
 });
});

$('#how-to-button').on('click', function(){
  $("#menu").fadeOut(100, function(){
    $("#desc").fadeIn(200);
  });
});

$('#return-button').on('click', function(){
  $("#desc").fadeOut(100, function(){
    $("#menu").fadeIn(200);
  });
});

$(document).on("mousemove", function(event){
  mouseX = event.pageX;     // Get the horizontal coordinate
  mouseY = event.pageY;     // Get the vertical coordinate
});

});
