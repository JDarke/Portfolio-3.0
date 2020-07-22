var delta = 0;
let lock = false;
let theme = 'dark';
var html = document.documentElement;
var currentTile = 1;
var touchStart;
var tileHeight;
var tileWidth;
var currentPage = 1;
var pageHeight;
let currentSection = 'home';
let mobile = false;
let viewportWidth, viewportHeight;
getViewportDims();

var numProjects = document.getElementsByClassName('project__outer').length;

const navButtons = document.getElementsByClassName('navbar__button');

let sections = ['home', 'about', 'work', 'contact'];
let sectionDims = [];

const getSectionDims = () => {  // does this actually change?
    sectionDims = sections.map((section) => {
        var el = document.getElementById(section);
        //console.log(sectionDims[2].top)
        return  {
                name: el.id,
                top: el.getBoundingClientRect().top,
                bottom: el.getBoundingClientRect().top,
                height: el.offsetHeight,
                width: el.offsetWidth
        }

    });
}


document.addEventListener('DOMContentLoaded', function(event) {
    getViewportDims()
    getSectionDims();
    setTileWidth();
    setTileHeight();
    navButtons[0].style.opacity = '0.8';
    navButtons[0].style.filter = 'grayscale(0)';

    $('.carousel__nav--up').click(function(e) {
        slideProjects('back');
    });

    $('.carousel__nav--down').click(function(e) {
        slideProjects('fwd');
    });

    $('.navbar__link, .navbar__button, .navbar__button image').bind('click', function(e) {
        setTimeout( () => {
            checkNavScroll();
        }, 700);
    });


    $(window).bind('click', function(e) {
    });

    $('.header__switch-frame').bind('click', function(e) {
        toggleTheme();
    });

    if (mobile) {
        $('.carousel').bind('touchstart', function(e) {
            touchStart = e.originalEvent.touches[0].clientX;
        });
        $('.carousel').bind('touchmove', function(e) {
            scrollProjects(e);
        });
    } 
    
})
//window.addEventListener('scroll', throttle(scrollTest(), 1000), true);
$(window).bind('mousewheel DOMMouseScroll touchmove', function(e){
        if (!lock && $(window).scrollTop == Math.round(sectionDims[2].top) ) {
            scrollLock();
        }
        checkNavScroll();  
        throttle(scrollTest(e), 1000);
});


function throttle(fn, wait) {
    var time = Date.now();
    return function() {
      if ((time + wait - Date.now()) < 0) {
        fn();
        time = Date.now();
      }
    }
  }

window.addEventListener('resize', function(e) {
    // ADD CAROUSEL RESET FUNCTION HERE
    getViewportDims()
    getSectionDims();
    setTileWidth();
    setTileHeight();
    $('.carousel__inner').css({'tansition': 'none'});
    /*setTimeout( () => {
        $('.carousel__inner').css({'transition': 'transform 1.2s ease, -webkit-transform 1.2s ease;'});
    }, 1000);*/
    $('.carousel').removeClass('animated');
    $('.carousel').removeClass('fadeInUp');
    $('.carousel').css({
        opacity: '1',
        transition: 'none'
    });
});

function scrollLock() {

    var target = $('#work').offset().top;
   
    $('html').css({
        'scroll-behavior': 'smooth'
    })
    $(window).scrollTop(target);

    $('#work').bind('mousewheel DOMMouseScroll touchmove', function(e){  
        //console.log('boundScroll');
        scrollProjects(e);
        e.preventDefault();
    });
    lock = true;
}

function scrollUnlock() {
  // console.log('unlock');
    $('#work').unbind('mousewheel DOMMouseScroll touchmove');
    lock = false;
}

function getViewportDims() {
    viewportWidth = $(window).width();                                          //move this inside of checkview() if not needed in this scope
    viewportHeight = $(window).height();
    if (viewportWidth < 820) {
        mobile = true;
    } else mobile = false;
}

function scrollTest(e) {
    getSectionDims();
    var x = $('#work');   
    const getDelta = function(e) {
        if (e.originalEvent.changedTouches) {
            var touchEnd = e.originalEvent.changedTouches[0].clientX;
            return touchEnd - touchStart;
        } else {
            return e.originalEvent.wheelDelta;
        }
    };
    const tileFinishedMove = function() {
        getSectionDims();
        var currentTileLeft = Math.round($('.project__outer:nth-child(' + currentTile + ')' ).offset().left);
        var currentTileTop = Math.round($('.project__outer:nth-child(' + currentTile + ')' ).offset().top);
        if (mobile) {
            return ( currentTileLeft === Math.round($('.carousel').offset().left ));  // returns true if current tile top is equal to carousel area top.
        } else {
            //console.log('currentTileTop: ' + currentTileTop +  'workOffsetTop.top: ' + $('#work').offset().top)
            return ( currentTileTop === Math.round($('#work').offset().top ));
        }
    };
    if (!mobile) {
        if ( tileFinishedMove() ) {
            if(getDelta(e) <= 0) {   // if scrolling down
                if (currentTile < numProjects && sectionDims[2].top <= ((getDelta(e) * -1) * 2)) {  // 
                    scrollLock();
                    //console.log('scrollFwd');
                } else {
                    scrollUnlock();
                }
            } else if (currentTile > 1 && sectionDims[2].top > ((getDelta(e) * -1) * 2) ) {  //if scrolling up
                scrollLock();
                //console.log('scrollBack');
            } else {
                scrollUnlock();
            }
        }
    }
    

   checkNavScroll();
}

function checkNavScroll() {
   
    getSectionDims();
    
    var i = 0;
    switch(true) {
        case (window.innerHeight - sectionDims[3].top > sectionDims[3].height/2.3):
            currentSection = 'contact';
            i = 3;
        break
        case (window.innerHeight - sectionDims[2].top > sectionDims[2].height/2.3):
            currentSection = 'work';
            i = 2;
        break
        case (window.innerHeight - sectionDims[1].top > sectionDims[1].height/2.3):
            currentSection = 'about';
            i = 1;
        break
        default:
            currentSection = 'home';
            i = 0;
    }
    for (var j = 0; j < navButtons.length; j++) {
        if (j !== i) {
        navButtons[j].style.opacity = '0.4';
        navButtons[j].style.filter = 'grayscale(100)';

        }

    }
    navButtons[i].style.opacity = '.8';
    navButtons[i].style.filter = 'grayscale(0)';
}


function scrollProjects(e) {
    
    $(window).scrollTop($('#work').offset().top - (mobile ? 60 : 0));
    setTileHeight();
    //console.log('SP - secDim.top: ' + sectionDims[2].top + ' / ' + 'ct: ' + currentTile);
    setTileWidth();
    if (currentTile < 1) {
        currentTile = 1;
    } 
    //let tileFinishedMove = ();
    const getDelta = function(e) {
        if (e.originalEvent.changedTouches) {
            //console.log('touchPassed');
            var touchEnd = e.originalEvent.changedTouches[0].clientX;
            return touchEnd - touchStart;
        } else {
            return e.originalEvent.wheelDelta;
        }
    };
    
    const tileFinishedMove = function() {
        getSectionDims();
        var currentTileLeft = Math.round($('.project__outer:nth-child(' + currentTile + ')' ).offset().left);
        var currentTileTop = Math.round($('.project__outer:nth-child(' + currentTile + ')' ).offset().top);
        if (mobile) {
            return currentTileLeft === Math.round($('.carousel').offset().left);  // returns true if current tile top is equal to carousel area top.
        } else {
            //console.log('currentTileTop: ' + currentTileTop +  'workOffsetTop.top: ' + $('#work').offset().top)
            return ( currentTileTop === Math.round($('#work').offset().top ));
        }
    };
    if (!mobile) {
        if ( tileFinishedMove() ) {
            if(getDelta(e) <= 0) {
                if (currentTile < numProjects) {  //check numbers-1?
                    slideProjects('fwd');
                } else {
                        scrollUnlock();
                }
            } else if (currentTile > 1) {
                slideProjects('back');
            } else {
                scrollUnlock();
            }
        }
    } else {
        if ( tileFinishedMove() ) {
            if(getDelta(e) <= 0 ) {   // if scrolling down
                if (currentTile < numProjects) {
                    slideProjects('fwd');
                }
               
            } else if (currentTile > 1) {
                slideProjects('back');
            }
        }
    }
}

function slideProjects(dir) {    
    getViewportDims();
    setTileHeight();
    setTileWidth();
    $('.carousel__inner').css({'tansition': 'transform 1.2s ease'});
    //console.log('tileWidth: ' + tileWidth );
    var next;
    var slideTo;
    $('.carousel__inner').css({
        transition: 'transform 1.2s ease;'
    })
    if (mobile) {
        slideTo = tileWidth;
        if (dir == 'fwd') {
            next = currentTile + 1;
            slideTo = -Math.abs(slideTo);
        } else if (dir == 'back') {
            next = currentTile - 1;
        }
        $('.project-text').removeClass('fadeInUp');
        $('.project-text').removeClass('animated');
        
        fadeOut('.project-text');                                                               
        fadeOut('.project__outer:nth-child(' + currentTile + ')');                              // fade out current project tile
        slideX('.project__outer:nth-child(' + currentTile + ') .project__img--sm', slideTo + 'px');    // slide current project mobile img for parallax effect as carousel moves
        fadeIn('.project__outer:nth-child(' + next + ')');                                      // fade in next project
        slideX('.project__outer:nth-child(' + next + ') .project__img--sm', '0px');            // slide next project mobile img for parallax
        slideX('.carousel__inner', '-' + ((next - 1) * tileWidth) + 'px');                            // slide entire carousel up/down one tile height, -1 for zero-indexed multiplier
        
        setTimeout( () => {
            fadeIn('.project-text');
            
        }, 700);
        
        setTimeout(null, 500);
        
        currentTile = next;
        checkCurrentTile();
    }  else {
        slideTo = tileHeight * 0.7;
        if (dir == 'fwd') {
            next = currentTile + 1;
            slideTo = -Math.abs(slideTo);
        } else if (dir == 'back') {
            next = currentTile - 1;
        }
        $('.project-text').removeClass('fadeInUp');
        $('.project-text').removeClass('animated');
        $('.project-text').css({
            transition: 'opacity 0.5s ease'
        })
        
        fadeOut('.project-text');                                                               
        fadeOut('.project__outer:nth-child(' + currentTile + ')');                              // fade out current project tile
        slideY('.project__outer:nth-child(' + currentTile + ') .project__img--sm', slideTo + 'px');    // slide current project mobile img for parallax effect as carousel moves
        fadeIn('.project__outer:nth-child(' + next + ')');                                      // fade in next project
        slideY('.project__outer:nth-child(' + next + ') .project__img--sm', '0px');            // slide next project mobile img for parallax
        slideY('.carousel__inner', '-' + ((next - 1) * tileHeight) + 'px');                            // slide entire carousel up/down one tile height, -1 for zero-indexed multiplier
        
        setTimeout( () => {
            fadeIn('.project-text');
        
        }, 700);
        
        setTimeout(null, 500);
        
        currentTile = next;
        checkCurrentTile();
    }
    $('.carousel__inner').css({'tansition': 'none'});
    //console.log('currentTile: ' + currentTile + ' / '+  'tileWidth: ' + tileWidth + ' / ' + 'tileHeight: ' + tileHeight + ' / ' + slideTo)
}

function checkCurrentTile() {
    if (currentTile === 1) {
        $('.carousel__nav--up').css({
            opacity: '0',
            visibility: 'hidden'
        });
    } else $('.carousel__nav--up').css({
            opacity: '1',
            visibility: 'visible'
        });;
        
    if (currentTile === (numProjects) ) {
        $('.carousel__nav--down').css({
            opacity: '0',
            visibility: 'hidden'
        });
    } else $('.carousel__nav--down').css({
            opacity: '1',
            visibility: 'visible'
    });
}

function setTileHeight() {
    tileHeight = $('.carousel').height();
    if (!mobile) {
            
        $('.project__outer').css({
            height: tileHeight,
            width: '40vw'
        });
        $('.carousel__inner').css({
            //height: tileHeight * (numProjects),
            transform : 'translateY(-' + ((currentTile - 1) * tileHeight) + 'px)'
        });
    }   
}
function setTileWidth() {
    if (mobile) {
        tileWidth = $('.carousel').width();  
             
        $('.project__outer').css({
            height: 'auto',
            width: tileWidth
        });
        $('.carousel__inner').css({
            height: 'auto',
            transform : 'translateX(-' + ((currentTile - 1) * tileWidth) + 'px)'
        });
    }

}

function getProjectInfo() {
    $.getJSON('portfolio.json', function(portfolio) {
        var project = portfolio['project' + (currentTile) ];
        var madeWith = "";
        var i;
        for (i=0; i < project.madewith.length; i++) {
            madeWith = madeWith + '<code>' + project.madewith[i] + '</code>';
            madeWith = i < project.madewith.length - 1 ?  madeWith +  ' • ': madeWith
        }
        $('.project-text').html('<h3>' + project.title + '</h3><p>' + project.description + '</p><p>' + madeWith + '</p><p class="spacer"></p><div class="flex row buttons"><div class="button button--hollow" onclick="overlayToggle()"><a>Details</a></div><div class="button button--hollow"><a target="_blank" rel="noopener noreferrer" href="http://' + project.codelink + '">View Code</a></div></div>');
        //$('.project-text-details').html('<h3>' + project.title + '</h3><p>' + project.description + '</p><div class="madewith">' + madeWith + '</div><div class="details__text">' + project.details + '</div>');
    });
}


function fadeIn(selector) {
    $(selector).removeClass('fadeInUp');
    $(selector).removeClass('animated');
    $(selector).css({opacity : '1'});
}

function fadeOut(selector) {
    $(selector).removeClass('fadeInUp');
    $(selector).removeClass('animated');
    $(selector).css({opacity : '0'});
}

function slideY(selector, targetY) {
    $(selector).css({
        '-webkit-transform': 'translateY(' + targetY + ')', 
        'transform' : 'translateY(' + targetY + ')' 
    });  
}


function slideX(selector, targetX) {
    $(selector).css({
        '-webkit-transform': 'translateX(' + targetX + ')', 
        'transform' : 'translateX(' + targetX + ')'    
    });  
}


function overlayToggle() {
    $('.overlay').fadeToggle(300, 'swing');
}

function toggleTheme() {
    if (theme === 'dark') {
        html.setAttribute('data-theme', 'light');
        theme = 'light';
    } else {
        html.removeAttribute('data-theme');
        theme = 'dark';
    }
    window.setTimeout(function() {
    }, 1300);
}  

