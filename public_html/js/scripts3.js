var delta = 0;
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
    getViewportDims()
    getSectionDims();
    setTileWidth();
    setTileHeight();
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
    
    $('.carousel').bind('touchstart', function(e) {
        touchStart = e.originalEvent.touches[0].clientX;
    });
    
    $('.carousel').bind('mousewheel DOMMouseScroll touchmove', function(e){  
        console.log('scroooolll')
        scrollProjects(e);
        e.preventDefault();
    });
})

window.addEventListener('scroll', function(e) {
    console.log('work offsetTop: ' + $('#work').offset().top);
    console.log('sectionDims[2].top: ' + sectionDims[2].top)
    console.log('currentTilePosOffset: ' + Math.round($('.project__outer:nth-child(' + currentTile + ')' ).offset().top))
    scrollTest();
    //console.log(currentSection);
});

window.addEventListener('resize', function(e) {
    //console.log('resize');
    getViewportDims()
    getSectionDims();
    setTileWidth();
    setTileHeight();
});


function getViewportDims() {
    viewportWidth = $(window).width();                                          //move this inside of checkview() if not needed in this scope
    viewportHeight = $(window).height();
    if (viewportWidth < 820) {
        mobile = true;
    } else mobile = false;
}

function scrollTest() {
    getSectionDims();
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
    setTileHeight();
    setTileWidth();
    if (currentTile < 1) {
        currentTile = 1;
    } 
    let tileFinishedMove;
    const getDelta = function(e) {
        if (e.originalEvent.changedTouches) {
            var touchEnd = e.originalEvent.changedTouches[0].clientX;
            return touchEnd - touchStart;
        } else {
            return e.originalEvent.wheelDelta;
        }
    };
    
    if (mobile) {
        tileFinishedMove = function() {
            var currentTileLeft = Math.round($('.project__outer:nth-child(' + currentTile + ')' ).offset().left);
            return ( currentTileLeft === 0 );  // returns true if current tile top is equal to carousel area top.
        };
    } else {
        tileFinishedMove = function() {
            var currentTileTop = Math.round($('.project__outer:nth-child(' + currentTile + ')' ).offset().top);
            getSectionDims();
            //console.log('currentTileTop: ' + currentTileTop +  'workOffsetTop.top: ' + document.getElementById('work').offset().top)
            return ( currentTileTop === $('#work').offset().top );  // returns true if current tile top is equal to carousel area top.
        };
    }
    
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
    getViewportDims();
    setTileHeight();
    setTileWidth();
    //console.log('tileWidth: ' + tileWidth );
    var next;
    var slideTo;
    if (mobile) {
        slideTo = tileWidth;
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
            //fadeIn('.project-text');
        }, 700);
        setTimeout(/*getProjectInfo*/ console.log('get project info here'), 500);
        
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
        //fadeOut('.project-text');                                                               
        fadeOut('.project__outer:nth-child(' + currentTile + ')');                              // fade out current project tile
        slideY('.project__outer:nth-child(' + currentTile + ') .project__img--sm', slideTo + 'px');    // slide current project mobile img for parallax effect as carousel moves
        fadeIn('.project__outer:nth-child(' + next + ')');                                      // fade in next project
        slideY('.project__outer:nth-child(' + next + ') .project__img--sm', '0px');            // slide next project mobile img for parallax
        slideY('.carousel__inner', '-' + ((next - 1) * tileHeight) + 'px');                            // slide entire carousel up/down one tile height, -1 for zero-indexed multiplier
        
        setTimeout( () => {
            //fadeIn('.project-text');
        }, 700);
        setTimeout(/*getProjectInfo*/ null, 500);
        
        currentTile = next;
        checkCurrentTile();
    }
    console.log('currentTile: ' + currentTile + ' / '+  'tileWidth: ' + tileWidth + ' / ' + 'tileHeight: ' + tileHeight + ' / ' + slideTo)
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




function setPageHeight() {
    tileHeight = $('.scroll__container').height();
    $('.project__outer').css({
       height: tileHeight 
    });
    $('.carousel__inner').css({
       height: tileHeight * (numProjects),
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