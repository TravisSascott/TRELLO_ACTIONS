/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so
var fullscreen = t.arg('fullscreen');

const resizeButtonText = document.getElementById("resizeButtonText");
const resizeButton = document.getElementById("resizeButton");

t.render(function(){
  // this function we be called once on initial load
  // and then called each time something changes that
  // you might want to react to, such as new data being
  // stored with t.set()
  
  
  resizeButtonText.value = !fullscreen;
  resizeButton.addEventListener("click", function(event) {
    event.preventDefault();
    t.updateModal({ fullscreen: !fullscreen });    
  });
  
});
