/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so
window.fullscreen = t.arg('fullscreen');

const resizeButtonText = document.getElementById("resizeButtonText");
const resizeButton = document.getElementById("resizeButton");

t.render(function(){
  // this function we be called once on initial load
  // and then called each time something changes that
  // you might want to react to, such as new data being
  // stored with t.set()
  
  if (window.fullscreen) {
    t.sizeTo("#content");  
  }
  
  const newText = document.createTextNode(!window.fullscreen);
  resizeButtonText.appendChild(newText);
  
  resizeButton.addEventListener("click", function(event) {
    console.log(`hi`);
    event.preventDefault();
    t.updateModal({ 
      accentColor: '#'+Math.floor(Math.random()*16777215).toString(16),
      title: 'Updated Modal',
      fullscreen: !window.fullscreen
    });
    window.fullscreen = !window.fullscreen;
  });
  
});
