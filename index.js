jQuery(document).ready(function($){

    // auth stuff
  var client_secret = "442a36b49f294d4aa8bfd6ad06fbafee";
  var client_id = "pJHC1bSqgkjI40JLoUOnbqFxYE6XkP99";
  var o_auth_endpoint = "https://us.battle.net/oauth/token";

  var access_token = "";

access_token='USH7578z511BEzl27ldDKGY2I6In8wHkb4';
var endpoint = 'https://us.api.blizzard.com/hearthstone/cards?';
var cards;


// Fetch the cards
function startGame(){
    var pages = 64;
    var page = Math.round(Math.random()*pages);
  fetch(endpoint+"locale=en_US&page="+page+"&access_token="+access_token)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    procCards(data);
  });

}

// Process the cards into the slider
  function procCards(cards){
    var limit = 40;
    var count = 0;
    var html = "";
  for (var key in cards['cards']){
    count++;
    let img = cards['cards'][count-1]['image'];
    html += "<div><img src='"+img+"' /></div>";
  }
    $(".output").html(html);
    slickify();


}

    // Event listeners
  $(".startGame").on('click', startGame);

  $(".output").on('afterChange init', function(slick){
      $(".slick-current img").attr("usemap", "#image-map");
      $("area").each(function(){
          $(this).attr('data-game',"show");
      })
      $(".slick-current img").each(function(){
          if (this.complete){
              draw_canvas();
          }
      })
      $('map').imageMapResize();
  })

  $("area").on('click', function(e){
        e.preventDefault();
      $(this).attr('data-game', 'hide');
      draw_canvas();
  })

//lazyLoaded
$(".output").on('lazyLoaded', function(slick){
      draw_canvas();
  });
 


});


function slickify(){
$('.output').slick({lazyLoad: 'ondemand'});
}

function draw_canvas(){

    // resize the canvas and place it over the image
    let position = $('.output img').position();
    let canvasLeft = position.left + $('.output').offset().left;
    let canvasTop = position.top + $('.output').offset().top;
    let canvasWidth = $('.output img').width();
    let canvasHeight = $('.output img').height();

    $('map').imageMapResize();

    //let canvasCss = "z-index: 999; position: absolute; top: "+canvasTop+"; left: "+canvasLeft+"; width: "+canvasWidth+"; height: "+canvasHeight+";";
    $('#canvas').css({"z-index" : 999, "position" : "absolute",  "top" : canvasTop+"px",  "left" : canvasLeft+"px",  "width" : canvasWidth+"px",  "height" : canvasHeight+"px", "pointer-events" : "none"});
    $('#canvas').position

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    
    c.setAttribute('width',canvasWidth);
    c.setAttribute('height',canvasHeight);

    // clear the canvas
    ctx.clearRect(0, 0, c.width, c.height);

    let start = $("map > area").attr('coords');

    // Draw poly
    $("map area").each(function(){

        if ( $(this).attr('data-game') == "hide"){
            return;
        }
        ctx.beginPath();
        
        var coords = $(this).attr('coords').split(",");
        ctx.moveTo(coords[0], coords[1]);
        // loop through coords
        for( var i=2; i<coords.length-1; i+=2){
            ctx.lineTo(coords[i], coords[i+1]);
        };
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fill();

    });
    
}