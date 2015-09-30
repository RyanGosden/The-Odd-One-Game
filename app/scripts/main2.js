$(function() {

  var boardLevel = 0;
  var colourDegree = [0.3, 0.2, 0.1, 0.09, 0.06];
  var degreeValue = colourDegree[0];
  var arrayPosition = colourDegree.indexOf(degreeValue);
  var startTime;
  var endTime;
  var wrongBoxes = 0;

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


windowSize();

//initially hide container and penalty warning
$("#menu").fadeIn(200);


//load highScore
var highScore = localStorage.getItem("highScore");
if(!highScore){
  $('#hscore').text("0");
}
else{
  $('#hscore').text(highScore);
}














  //initiate menu
  function windowSize(){
  var windowHeight = window.innerHeight;
  var windowCenter = windowHeight/2;
  //menu container
  var menuLength = $("#menu").height();
  var menuPadding = (windowHeight-menuLength)/2;
  $("#menu").css("margin-top", menuPadding);
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



      $( ".box" ).remove();
      $(document.body).css("backgroundColor", "green");
      setTimeout(function(){
      $(document.body).css("backgroundColor", "#262626");
      }, 100);

      if (arrayPosition < (colourDegree.length) - 1) {
        generateBoard(colourDegree[arrayPosition]);
        arrayPosition = arrayPosition + 1;
        colourDegree[arrayPosition];

      } else {
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

              if(timeScore < highScore){
                localStorage.setItem("highScore" , timeScore);
                $('#hscore').text(timeScore);
              }

              $("#container").fadeOut(400);
              $("#menu").fadeIn(800);
            }
          }

    } else {
      wrongBoxes = wrongBoxes + 5;


      $( "#penalty" ).fadeIn(100).effect( "puff" );
      $( "#container" ).effect( "shake" );
      $(document.body).css("backgroundColor", "red");
      setTimeout(function(){
        $(document.body).css("backgroundColor", "#262626");
      }, 100);
  }
});

  $('#start-button').on('click', function(){
   $("#menu").fadeOut(100);
   $("#score").empty();
   boardLevel = 0;
   wrongBoxes = 0;

   startTime = new Date($.now());
   generateBoard(degreeValue); //Initial Call on load
  });
});
