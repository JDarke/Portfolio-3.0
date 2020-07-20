var delta = 0;
var currentTile = 1;
var touchStart;
var tileHeight;
var tileWidth;
var currentPage = 1;
var pageHeight;
let currentSection = 'home';

var numProjects = document.getElementsByClassName('project__outer').length;

const navButtons = document.getElementsByClassName('navbar__button');

let sections = ['home', 'about', 'work', 'contact'];
let sectionDims = [];

const getSectionDims = () => {
    sectionDims = sections.map((section) => {
        var el = document.getElementById(section);
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
    getSectionDims();
    setTileWidth();
    navButtons[0].style.opacity = '0.8';
    navButtons[0].style.filter = 'grayscale(0)';
    $('.carousel__nav--up').click(function(e) {
        //scrollProjects();
        slideProjects('back');
    });
    $('.carousel__nav--down').click(function(e) {
        //scrollProjects();
        slideProjects('fwd');
    });
    
    $('.l-page__content--portfolio').bind('touchstart', function(e) {
        touchStart = e.originalEvent.touches[0].clientX;
    });
    
    $('.l-page__content--portfolio').bind('mousewheel DOMMouseScroll touchmove', function(e){  
        scrollProjects(e);
    });
})

window.addEventListener('scroll', function(e) {
    scrollTest();
    //console.log(currentSection);
});

window.addEventListener('resize', function(e) {
    //console.log('resize');
    getSectionDims();
    setTileWidth();
    setTileHeight();
});

function scrollTest() {
    
    getSectionDims();
    /*
    if (sectionDims[2].top > 60) {
        console.log('scrollTest' + sectionDims[2].top );
        $(document).bind('scroll',function () { 
            window.scrollTo(0,sectionDims[2].bottom); 
        });
    }*/
    for (var i = 0; i < sectionDims.length; i++) {
        if (sectionDims[i].top < (window.innerHeight - (sectionDims[i].height/1.8)) && sectionDims[i].bottom >= 0) {
            currentSection = sectionDims[i].name;
            for (var j = 0; j < navButtons.length; j++) {
                navButtons[j].style.opacity = '0.4';
                navButtons[j].style.filter = 'grayscale(100)';
            }
            navButtons[i].style.opacity = '.8';
            navButtons[i].style.filter = 'grayscale(0)';
        }
    } 
}


function scrollProjects(e) {
    if (currentTile < 1) {
        currentTile = 1;
    } 
    
    const getDelta = function(e) {
        if (e.originalEvent.changedTouches) {
            var touchEnd = e.originalEvent.changedTouches[0].clientX;
            return touchEnd - touchStart;
        } else {
            return e.originalEvent.wheelDelta;
        }
    };
    
    const tileFinishedMove = function() {
        var currentTileLeft = Math.round($('.project__outer:nth-child(' + currentTile + ')' ).offset().left);
        return ( currentTileLeft === 0 );  // returns true if current tile top is equal to carousel area top.
    };
    
    if ( tileFinishedMove() ) {
        if(getDelta(e) <= 0) {
            if (currentTile < numProjects) {  //check numbers-1?
                slideProjects('fwd');
                console.log('scrollFwd');
            }
        } else if (currentTile > 1) {
            slideProjects('back');
            console.log('scrollBack');
        }
    }
}

function slideProjects(dir) {
    console.log('tileWidth: ' + tileWidth );
    var next;
    var slideTo = tileWidth;
    
    if (dir == 'fwd') {
        next = currentTile + 1;
        slideTo = -Math.abs(slideTo);
    } else if (dir == 'back') {
        next = currentTile - 1;
    }
    
    fadeOut('.project-text');                                                               
    fadeOut('.project__outer:nth-child(' + currentTile + ')');                              // fade out current project tile
    slideX('.project__outer:nth-child(' + currentTile + ') .project__img--sm', slideTo + 'px');    // slide current project mobile img for parallax effect as carousel moves
    fadeIn('.project__outer:nth-child(' + next + ')');                                      // fade in next project
    slideX('.project__outer:nth-child(' + next + ') .project__img--sm', '0px');            // slide next project mobile img for parallax
    slideX('.carousel__inner', '-' + ((next - 1) * tileWidth) + 'px');                            // slide entire carousel up/down one tile height, -1 for zero-indexed multiplier
    
    setTimeout( () => {
        fadeIn('.project-text');
    }, 700);
    setTimeout(/*getProjectInfo*/ console.log('get project info here'), 500);
    
    currentTile = next;
    checkCurrentTile();
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
    $('.project__outer').css({
       height: tileHeight 
    });
  
}
function setTileWidth() {
    tileWidth = $('.project__outer').width();  
}

function setPageHeight() {
    tileHeight = $('.scroll__container').height();
    $('.project__outer').css({
       height: tileHeight 
    });
    $('.carousel__inner').css({
       height: tileHeight * (numProjects - 1),
       transform : 'translateY(-' + ((currentTile - 1) * tileHeight) + 'px)'
    });
}

function fadeIn(selector) {
    $(selector).css({opacity : '1'});
}

function fadeOut(selector) {
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