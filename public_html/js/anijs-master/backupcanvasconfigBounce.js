(function() {

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  
    var field = document.getElementById("field");
    var ball = document.getElementById("ball");
  
    var maxX = field.clientWidth - ball.offsetWidth;
    var maxY = field.clientHeight - ball.offsetHeight;
  
    var duration = 4; // seconds
    var gridSize = 100; // pixels
  
    var start = null;
    var stretchFactor;
  
    function step(timestamp) {
      var progress, x, y;
      if(start === null) {
        start = timestamp;
        stretchFactor = 1;
      }
  
      progress = (timestamp - start) / duration / 1000; // percent
  
      x = stretchFactor * Math.sin(progress * 2 * Math.PI); // x = ƒ(t)
      y = Math.cos(progress * 2 * Math.PI); // y = ƒ(t)
  
      ball.style.left = maxX/2 + (gridSize * x) + "px";
      ball.style.bottom = maxY/2 + (gridSize * y) + "px";
  
      if(progress >= 1) start = null; // reset to start position
      requestAnimationFrame(step);
    }
  
    requestAnimationFrame(step);
  
  })();
  

---------------------------------

  
// Give every particle some life
function update() {
  // In this function, we are first going to update every
  // particle's position according to their velocities
  for (var i = 0; i < particles.length; i++) {
    p = particles[i];

    // Change the velocities
    if (p.x + p.radius > W) {
      
      p.vx *= -1;
    } else if (p.x - p.radius < 0) {
      p.vx *= -1;
    }

    if (p.y + p.radius > H) {
    
      p.vy *= -1;
    } else if (p.y - p.radius < 0) {
      p.vy *= -1;
    }
    p.x += p.vx;
    p.y += p.vy;

    // We don't want to make the particles leave the
    // area, so just change their position when they
    // touch the walls of the window
    

    // Now we need to make them attract each other
    // so first, we'll check the distance between
    // them and compare it to the minDist we have
    // already set

    // We will need another loop so that each
    // particle can be compared to every other particle
    // except itself
    for (var j = i + 1; j < particles.length; j++) {
      p2 = particles[j];
      distance(p, p2);
    }
  }
}


------


window.requestAnimFrame = (function () {
    return (
      function (callback) {
        window.setTimeout(callback, 1000 / 30);
      }
    );
  })();
  
  
  const canvas = document.getElementById("canvas");
  
  const context = canvas.getContext("2d");
  
  // Set the canvas width and height to occupy full window
  let W = $('.about__screen').width(),
    H = $('.about__screen').height();
  canvas.height = H / 1;
  
  // Some variables for later use
  let particleCount = 10,
    particles = [],
    minDist = 80,
    dist;
  
  // Function to paint the canvas black
  function paintCanvas() {
    W = $('.about__screen').width(),
    H = $('.about__screen').height();
    canvas.width = W * 1;
    canvas.height = H * 1;
    // fill black
    context.fillStyle = "rgba(0,0,0,.1)";
    context.fillRect(0, 0, W, H);
  }
  
  class Particle {
    constructor() {
      // Position them randomly on the canvas
      // Math.random() generates a random value between 0
      // and 1 so we will need to multiply that with the
      // canvas width and height.
      this.x = (Math.random() * W) / 2;
      this.y = (Math.random() * H) / 2;
  
      // We would also need some velocity for the particles
      // so that they can move freely across the space
      this.vx = -1 + Math.random() * 2;
      this.vy = -1 + Math.random() * 2;
  
      // Now the radius of the particles. I want all of
      // them to be equal in size so no Math.random() here..
      this.radius = 4;
  
      // This is the method that will draw the Particle on the
      // canvas. It is using the basic fillStyle, then we start
      // the path and after we use the `arc` function to
      // draw our circle. The `arc` function accepts four
      // parameters in which first two depicts the position
      // of the center point of our arc as x and y coordinates.
      // The third value is for radius, then start angle,
      // end angle and finally a boolean value which decides
      // whether the arc is to be drawn in counter clockwise or
      // in a clockwise direction. False for clockwise.
      this.draw = function () {
        context.fillStyle = "rgba(120,120,120,1)";
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  
        // Fill the color to the arc that we just created
        context.fill();
      };
    }
  }
  
  // Time to push the particles into an array
  for (var i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Function to draw everything on the canvas that we'll use when
  // animating the whole scene.
  function draw() {
    // Call the paintCanvas function here so that our canvas
    // will get re-painted in each next frame
    paintCanvas();
  
    // Call the function that will draw the balls using a loop
    for (var i = 0; i < particles.length; i++) {
      p = particles[i];
      p.draw();
    }
  
    //Finally call the update function
    update();
  }
  
  // Give every particle some life
  function update() {
    // In this function, we are first going to update every
    // particle's position according to their velocities
    for (var i = 0; i < particles.length; i++) {
      p = particles[i];
  
      // Change the velocities
      p.x += p.vx;
      p.y += p.vy;
  
      // We don't want to make the particles leave the
      // area, so just change their position when they
      // touch the walls of the window
      if (p.x + p.radius > W) p.x = p.radius;
      else if (p.x - p.radius < 0) {
        p.x = W - p.radius;
      }
  
      if (p.y + p.radius > H) p.y = p.radius;
      else if (p.y - p.radius < 0) {
        p.y = H - p.radius;
      }
  
      // Now we need to make them attract each other
      // so first, we'll check the distance between
      // them and compare it to the minDist we have
      // already set
  
      // We will need another loop so that each
      // particle can be compared to every other particle
      // except itself
      for (var j = i + 1; j < particles.length; j++) {
        p2 = particles[j];
        distance(p, p2);
      }
    }
  }
  
  // Distance calculator between two particles
  function distance(p1, p2) {
    var dist,
      dx = p1.x - p2.x,
      dy = p1.y - p2.y;
  
    dist = Math.sqrt(dx * dx + dy * dy);
  
    // Draw the line when distance is smaller
    // then the minimum distance
    if (dist <= minDist) {
      // Draw the line
      context.beginPath();
      context.strokeStyle = "rgba(120,120,120," + (1.2 - dist / minDist) + ")";
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.stroke();
      context.closePath();
  
      // Some acceleration for the partcles
      // depending upon their distance
      var ax = dx / 50000,
        ay = dy / 50000;
  
      // Apply the acceleration on the particles
      p1.vx -= ax;
      p1.vy -= ay;
  
      p2.vx += ax;
      p2.vy += ay;
    }
  }
  
  function animloop() {
    draw();
    requestAnimFrame(animloop);
  }
  
  
  