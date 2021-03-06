const html = document.documentElement,
  numProjects = document.getElementsByClassName("project__outer").length,
  navButtons = document.getElementsByClassName("navbar__button"),
  sections = ["home", "about", "work", "contact"],
  canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d");
let delta = 0,
  debounce_timer,
  lock = false,
  theme = "dark",
  currentTile = 1,
  touchStart,
  tileHeight,
  tileWidth,
  currentPage = 1,
  pageHeight,
  currentSection = "home",
  mobile = false,
  viewportWidth,
  viewportHeight,
  sectionDims = [],
  W = $(".about__screen").width(),
  H = $(".about__screen").height(),
  particleCount = 30,
  particles = [],
  minDist = 80,
  dist;

const getSectionDims = () => {
  sectionDims = sections.map((section) => {
    var el = document.getElementById(section);
    return {
      name: el.id,
      top: el.getBoundingClientRect().top,
      bottom: el.getBoundingClientRect().top,
      height: el.offsetHeight,
      width: el.offsetWidth,
    };
  });
};

const setParticles = () => {
  (particleCount = mobile ? 25 : W * 0.15),
    (particles = []),
    (minDist = mobile ? 70 : W * 0.15),
    dist;
  for (var i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
};

document.addEventListener("DOMContentLoaded", function (event) {
  getViewportDims();
  getSectionDims();
  setTileWidth();
  setTileHeight();
  checkNavScroll(); 
  setInterval(() => { 
      checkNavScroll(); 
  }, 700);
  $(".carousel__nav--up").click(function (e) {
    slideProjects("back");
  });

  $(".carousel__nav--down").click(function (e) {
    slideProjects("fwd");
  });

  $(".navbar__link, .navbar__button, .navbar__button image").bind(
    "click",
    function (e) {
      if (!mobile) {
        scrollUnlock();
      }
    }
  );
    
  $("#scr-lk").bind(
    "click", (e) => {
      if (!mobile) {
        scrollLock();
      }
    }
  );

  $(".header__switch-frame").bind("click", function (e) {
    toggleTheme();
  });

  if (mobile) {
    $(".carousel").bind("touchstart", function (e) {
      touchStart = e.originalEvent.touches[0].clientX;
      e.stopPropagation();
    });
    $(".carousel").bind("touchmove", function (e) {
      scrollProjects(e);
    });
  }

  $(".details__popup").click(function (e) {
    e.stopPropagation();
  });

  $(".overlay").bind("mousewheel DOMMouseScroll touchmove", function (e) {
    e.stopPropagation();
  });

  $(".close, .overlay").click(function () {
    overlayToggle();
  });
  animloop();
});

$(window).bind("mousewheel DOMMouseScroll touchmove", function (e) {
  if (debounce_timer) {
    window.clearTimeout(debounce_timer);
  }
  debounce_timer = window.setTimeout(function () {
    scrollTest(e);
    checkNavScroll();
  }, 100);
  //throttle(checkNavScroll(), 50);
});

function throttle(fn, wait) {
  var time = Date.now();
  return function () {
    if (time + wait - Date.now() < 0) {
      fn();
      time = Date.now();
    }
  };
}

window.addEventListener("resize", function (e) {
  getViewportDims();
  getSectionDims();
  setTileWidth();
  setTileHeight();
  setCanvasSize();
  setParticles();
  $(".carousel__inner").css({ tansition: "none" });
  $(".carousel").removeClass("animated");
  $(".carousel").removeClass("fadeInUp");
  $(".carousel").css({
    opacity: "1",
    transition: "none",
  });
});

function scrollLock() {
  if (mobile) {
    $(".carousel").bind("mousewheel DOMMouseScroll touchmove", function (e) {
      e.preventDefault();
      scrollProjects(e);
    });
  } else {
    $("#work").bind("mousewheel DOMMouseScroll touchmove", function (e) {
      e.preventDefault();
      e.stopPropagation();
      scrollProjects(e);
    });
  }
  var target = $("#work").offset().top;
  $(window).scrollTop(target);
  lock = true;
}

function scrollUnlock() {
  $(".carousel").unbind("mousewheel DOMMouseScroll touchmove");
  $("#work").unbind("mousewheel DOMMouseScroll touchmove");
  lock = false;
}

function getViewportDims() {
  viewportWidth = $(window).width();
  viewportHeight = $(window).height();
  if (viewportWidth < 820) {
    mobile = true;
  } else mobile = false;
}

function scrollTest(e) {
  getSectionDims();
  const getDelta = function (e) {
    if (e.originalEvent.changedTouches) {
      var touchEnd = e.originalEvent.changedTouches[0].clientX;
      return touchEnd - touchStart;
    } else {
      return e.originalEvent.wheelDelta;
    }
  };
var delta = getDelta(e);

  if (!mobile /*&& currentSection === 'work'*/) {
    if (delta <= 0) {
      // if scrolling down
      if (
        currentTile < numProjects &&
        (sectionDims[2].top > delta * 3 && sectionDims[2].top < delta  *  -3)
      ) {
        //console.log('SD: ' + sectionDims[2].top);
        scrollLock();
      } else {
        scrollUnlock();
      }
    } else if (currentTile > 1 && (sectionDims[2].top < delta * 3 && sectionDims[2].top > delta  *  -3)) {  // fix this whole logic!
      //if scrolling up
      scrollLock();
      //console.log('SD: ' + sectionDims[2].top);
    } else {
      scrollUnlock();
    }
    console.log('Delta: ' + delta);
    console.log('secTop: ' + sectionDims[2].bottom);
  }
}

function checkNavScroll() {
  getSectionDims();

  var i = 0;
  switch (true) {
    case window.innerHeight - sectionDims[3].top > sectionDims[3].height / 2:
      currentSection = "contact";
      i = 3;
      break;
    case window.innerHeight - sectionDims[2].top > sectionDims[2].height / 2.3:
      currentSection = "work";
      i = 2;
      break;
    case window.innerHeight - sectionDims[1].top > sectionDims[1].height / 2.3:
      currentSection = "about";
      i = 1;
      break;
    default:
      currentSection = "home";
      i = 0;
  }
  for (var j = 0; j < navButtons.length; j++) {
    //navButtons[j].blur();
    if (j !== i) {
      navButtons[j].style.opacity = "0.4";
      navButtons[j].style.filter = "grayscale(100)";
    }
  }
  navButtons[i].style.opacity = ".8";
  navButtons[i].style.filter = "grayscale(0)";
}

function scrollProjects(e) {
  if (!mobile) {
    $(window).scrollTop($("#work").offset().top);
  }
  setTileHeight();
  setTileWidth();
  if (currentTile < 1) {
    currentTile = 1;
  }
  const getDelta = function (e) {
    if (e.originalEvent.changedTouches) {
      var touchEnd = e.originalEvent.changedTouches[0].clientX;
      return touchEnd - touchStart;
    } else {
      return e.originalEvent.wheelDelta;
    }
  };

  const tileFinishedMove = function () {
    getSectionDims();
    var currentTileLeft = Math.round(
      $(".project__outer:nth-child(" + currentTile + ")").offset().left
    );
    var currentTileTop = Math.round(
      $(".project__outer:nth-child(" + currentTile + ")").offset().top
    );
    if (mobile) {
      return currentTileLeft === Math.round($(".carousel").offset().left); // returns true if current tile top is equal to carousel area top.
    } else {
      return currentTileTop === Math.round($("#work").offset().top);
    }
  };
  if (!mobile) {
    if (tileFinishedMove()) {
      if (getDelta(e) <= 0) {
        if (currentTile < numProjects) {
          slideProjects("fwd");
        } else {
          scrollUnlock();
        }
      } else if (currentTile > 1) {
        slideProjects("back");
      } else {
        setTimeout(() => {
          scrollUnlock();
        }, 0);
      }
    }
  } else {
    if (tileFinishedMove()) {
      if (getDelta(e) <= 0) {
        // if scrolling down
        if (currentTile < numProjects) {
          slideProjects("fwd");
        }
      } else if (currentTile > 1) {
        slideProjects("back");
      }
    }
  }
}

function slideProjects(dir) {
  if (!mobile) {
    scrollLock();
    $(window).scrollTop($("#work").offset().top);
  }
  getViewportDims();
  setTileHeight();
  setTileWidth();
  $(".carousel__inner").css({ tansition: "transform 1.2s ease" });
  var next;
  var slideTo;
  $(".carousel__inner").css({
    transition: "transform 1.2s ease;",
  });
  if (mobile) {
    slideTo = tileWidth;
    if (dir == "fwd") {
      next = currentTile + 1;
      slideTo = -Math.abs(slideTo);
    } else if (dir == "back") {
      next = currentTile - 1;
    }
    $(".project-text").removeClass("fadeInUp");
    $(".project-text").removeClass("animated");

    fadeOut(".project-text");
    fadeOut(".project__outer:nth-child(" + currentTile + ")"); // fade out current project tile
    slideX(
      ".project__outer:nth-child(" + currentTile + ") .project__img--sm",
      slideTo + "px"
    ); // slide current project mobile img for parallax effect as carousel moves
    fadeIn(".project__outer:nth-child(" + next + ")"); // fade in next project
    slideX(".project__outer:nth-child(" + next + ") .project__img--sm", "0px"); // slide next project mobile img for parallax
    slideX(".carousel__inner", "-" + (next - 1) * tileWidth + "px"); // slide entire carousel up/down one tile height, -1 for zero-indexed multiplier

    setTimeout(() => {
      fadeIn(".project-text");
    }, 700);
    setTimeout(getProjectInfo, 500);

    currentTile = next;
    checkCurrentTile();
  } else {
    slideTo = tileHeight * 0.7;
    if (dir == "fwd") {
      next = currentTile + 1;
      slideTo = -Math.abs(slideTo);
    } else if (dir == "back") {
      next = currentTile - 1;
    }
    $(".project-text").removeClass("fadeInUp");
    $(".project-text").removeClass("animated");
    $(".project-text").css({
      transition: "opacity 0.5s ease",
    });

    fadeOut(".project-text");
    fadeOut(".project__outer:nth-child(" + currentTile + ")"); // fade out current project tile
    slideY(
      ".project__outer:nth-child(" + currentTile + ") .project__img--sm",
      slideTo + "px"
    ); // slide current project mobile img for parallax effect as carousel moves
    fadeIn(".project__outer:nth-child(" + next + ")"); // fade in next project
    slideY(".project__outer:nth-child(" + next + ") .project__img--sm", "0px"); // slide next project mobile img for parallax
    slideY(".carousel__inner", "-" + (next - 1) * tileHeight + "px"); // slide entire carousel up/down one tile height, -1 for zero-indexed multiplier

    setTimeout(() => {
      fadeIn(".project-text");
    }, 700);

    setTimeout(getProjectInfo, 500);

    currentTile = next;
    checkCurrentTile();
  }
  $(".carousel__inner").css({ tansition: "none" });
}

function checkCurrentTile() {
  if (currentTile === 1) {
    $(".carousel__nav--up").css({
      opacity: "0",
      visibility: "hidden",
    });
  } else
    $(".carousel__nav--up").css({
      opacity: "1",
      visibility: "visible",
    });

  if (currentTile === numProjects) {
    $(".carousel__nav--down").css({
      opacity: "0",
      visibility: "hidden",
    });
  } else
    $(".carousel__nav--down").css({
      opacity: "1",
      visibility: "visible",
    });
}

function setTileHeight() {
  tileHeight = $(".carousel").height();
  if (!mobile) {
    $(".project__outer").css({
      height: tileHeight,
      width: "40vw",
    });
    $(".carousel__inner").css({
      transform: "translateY(-" + (currentTile - 1) * tileHeight + "px)",
    });
  }
}

function setTileWidth() {
  if (mobile) {
    tileWidth = $(".carousel").width();
    $(".project__outer").css({
      height: "auto",
      width: tileWidth,
    });
    $(".carousel__inner").css({
      height: "auto",
      transform: "translateX(-" + (currentTile - 1) * tileWidth + "px)",
    });
  }
}

function getProjectInfo() {
  $.getJSON("portfolio.json", function (portfolio) {
    var project = portfolio["project" + currentTile];
    var madeWith = "";
    var i;
    for (i = 0; i < project.madewith.length; i++) {
      madeWith = madeWith + "<code>" + project.madewith[i] + "</code>";
      madeWith = i < project.madewith.length - 1 ? madeWith + " • " : madeWith;
    }
    $(".project-text").html(
      "<h3>" +
        project.title +
        "</h3><p>" +
        project.description +
        "</p><p>" +
        madeWith +
        '</p><p class="spacer"></p><div class="flex row buttons"><div class="button button--hollow" onclick="overlayToggle()"><a>Details</a></div><div class="button button--hollow"><a target="_blank" rel="noopener noreferrer" href="https://' +
        project.codelink +
        '">Code</a></div><div class="button button--hollow"><a target="_blank" rel="noopener noreferrer" href="' +
        project.url +
        '" >Visit</a></div>'
    );
    $(".project-text-details").html(
      "<h3>" +
        project.title +
        "</h3><p>" +
        project.description +
        "</p><p>" +
        madeWith +
        '</p><p class="spacer"></p><div class="flex row buttons"><div class="button button--hollow"><a target="_blank" rel="noopener noreferrer" href="http://' +
        project.codelink +
        '">Code</a></div><div class="button button--hollow"><a target="_blank" rel="noopener noreferrer" href="http://' +
        project.url +
        '" >Visit</a></div></div><div class="details__text">' +
        project.details +
        "</div>"
    );
  });
}

function fadeIn(selector) {
  $(selector).removeClass("fadeInUp");
  $(selector).removeClass("animated");
  $(selector).css({ opacity: "1" });
}

function fadeOut(selector) {
  $(selector).removeClass("fadeInUp");
  $(selector).removeClass("animated");
  $(selector).css({ opacity: "0" });
}

function slideY(selector, targetY) {
  $(selector).css({
    "-webkit-transform": "translateY(" + targetY + ")",
    transform: "translateY(" + targetY + ")",
  });
}

function slideX(selector, targetX) {
  $(selector).css({
    "-webkit-transform": "translateX(" + targetX + ")",
    transform: "translateX(" + targetX + ")",
  });
}

function overlayToggle() {
  $(".overlay").fadeToggle(300, "swing");
}

function toggleTheme() {
  if (theme === "dark") {
    html.setAttribute("data-theme", "light");
    theme = "light";
  } else {
    html.removeAttribute("data-theme");
    theme = "dark";
  }
  window.setTimeout(function () {}, 1300);
}

window.requestAnimFrame = (function () {
  return function (callback) {
    window.setTimeout(callback, 1000 / 30);
  };
})();

function setCanvasSize() {
  (W = $(".about__screen").width()), (H = $(".about__screen").height());
  canvas.width = W * 1;
  canvas.height = H * 1;
}

setCanvasSize();

function paintCanvas() {
  setCanvasSize();
  // fill black
  context.fillStyle = "rgba(0,0,0,0)";
  context.fillRect(0, 0, W, H);
}

class Particle {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = -1 + Math.random() * 2;
    this.vy = -1 + Math.random() * 2;
    this.radius = 3;
    this.draw = function () {
      context.fillStyle = "rgba(120,120,120,.8)";
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

      // Fill the color to the arc that we just created
      context.fill();
    };
  }
}

setParticles();

function draw() {
  paintCanvas();
  for (var i = 0; i < particles.length; i++) {
    p = particles[i];
    p.draw();
  }
  update();
}

function update() {
  for (var i = 0; i < particles.length; i++) {
    p = particles[i];

    // Change the velocities
    p.x += p.vx;
    p.y += p.vy;

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
    for (var j = i + 1; j < particles.length; j++) {
      p2 = particles[j];
      distance(p, p2);
    }
  }
}

function distance(p1, p2) {
  var dist,
      dx = p1.x - p2.x,
      dy = p1.y - p2.y;
  dist = Math.sqrt(dx * dx + dy * dy);
  if (dist <= minDist) {
    // Draw the line
    context.beginPath();
    context.strokeStyle = "rgba(120,120,120," + (1.2 - dist / minDist) + ")";
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.stroke();
    context.closePath();
    var ax = dx / 50000,
      ay = dy / 50000;
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

function spinIcon() {}
