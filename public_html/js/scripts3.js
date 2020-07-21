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
    $(window).bind('click', function(e) {
        console.log(sectionDims[2].top);
    });
    
    
    /*$('.l-page').bind('mousewheel DOMMouseScroll touchmove', function(e){
        
        console.log('before: ' + currentPage);
        if (!mobile) {
            scrollContainer(e);
        }
        console.log('after: ' + currentPage);
        
    });*/
})
/*
window.addEventListener('scroll', function(e) {
    //console.log('work offsetTop: ' + $('#work').offset().top);
    //console.log('sectionDims[2].top: ' + sectionDims[2].top)
   // console.log('currentTilePosOffset: ' + Math.round($('.project__outer:nth-child(' + currentTile + ')' ).offset().top))
    scrollTest(e);
    //console.log(currentSection);
});

*/

$(window).bind('mousewheel DOMMouseScroll touchmove', function(e){  

        //console.log('work offsetTop: ' + $('#work').offset().top);
        //console.log('sectionDims[2].top: ' + sectionDims[2].top)
       // console.log('currentTilePosOffset: ' + Math.round($('.project__outer:nth-child(' + currentTile + ')' ).offset().top))
        scrollTest(e);
        //console.log(currentSection);
});

window.addEventListener('resize', function(e) {
    //console.log('resize');
    getViewportDims()
    getSectionDims();
    setTileWidth();
    setTileHeight();
    $('.carousel__inner').css({'tansition': 'none'});
    $('.carousel').removeClass('animated');
    $('.carousel').removeClass('fadeInUp');
    $('.carousel').css({
        opacity: '1',
        transition: 'none'
    });
});

function scrollLock() {
    var target = $('#work').offset().top;
    var scrollOptions = {
        left: 0,
        top: target,
        behavior: 'auto'
      }

    console.log('lock');
    $('html').css({
        'scroll-behavior': 'smooth'
    })
    //window.scrollTo(scrollOptions);
    $(window).scrollTop(target);
    //$('html').css({
    //    'scroll-behavior': 'smooth'
    //})
    
    $('#work').bind('mousewheel DOMMouseScroll touchmove', function(e){  
        console.log('boundScroll');
        scrollProjects(e);
        e.preventDefault();
    });
}

function scrollUnlock() {
   console.log('unlock');
    $('#work').unbind('mousewheel DOMMouseScroll touchmove');
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
    console.log('scDimsTop:' + sectionDims[2].top);
    
    const getDelta = function(e) {
        if (e.originalEvent.changedTouches) {
            var touchEnd = e.originalEvent.changedTouches[0].clientX;
            return touchEnd - touchStart;
        } else {
            return e.originalEvent.wheelDelta;
        }
    };
    //console.log(getDelta(e));
    //console.log('secDim.top: ' + sectionDims[2].top + ' / ' + 'ct: ' + currentTile);
    /*if (sectionDims[2].top <= 0 && currentTile < 4) {
        scrollLock();
    } else {
        scrollUnlock();
    }*/
    
        if(getDelta(e) <= 0) {   // if scrolling down
            if (currentTile < numProjects && sectionDims[2].top <= (0 + (0 - getDelta(e)))) {  // 
                scrollLock();
                //console.log('scrollFwd');
            } else {
                    scrollUnlock();
            }
        } else if (currentTile > 1 && sectionDims[2].top > (0 + (0 - getDelta(e))) ) {  //if scrolling up
            scrollLock();
            //console.log('scrollBack');
        } else {
            scrollUnlock();
        }
    


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
    //console.log('SP - secDim.top: ' + sectionDims[2].top + ' / ' + 'ct: ' + currentTile);
    setTileWidth();
    if (currentTile < 1) {
        currentTile = 1;
    } 
    //let tileFinishedMove = ();
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
            return ( currentTileLeft === 0 );  // returns true if current tile top is equal to carousel area top.
        } else {
            console.log('currentTileTop: ' + currentTileTop +  'workOffsetTop.top: ' + $('#work').offset().top)
            return ( currentTileTop === Math.round($('#work').offset().top ));
        }
    };
    /*
    if (mobile) {
        tileFinishedMove = function() {
            var currentTileLeft = Math.round($('.project__outer:nth-child(' + currentTile + ')' ).offset().left);
            return ( currentTileLeft === 0 );  // returns true if current tile top is equal to carousel area top.
        };
    } else {
        tileFinishedMove = function() {
            var currentTileTop = Math.round($('.project__outer:nth-child(' + currentTile + ')' ).offset().top);
            console.log('tileFinMoveCheck');
            getSectionDims();
            //console.log('currentTileTop: ' + currentTileTop +  'workOffsetTop.top: ' + document.getElementById('work').offset().top)
            return ( currentTileTop === $('#work').offset().top );  // returns true if current tile top is equal to carousel area top.
        };
    }*/
    
    if ( tileFinishedMove() ) {
        console.log('tileFinMoveCheckPass');
        if(getDelta(e) <= 0) {
            if (currentTile < numProjects) {  //check numbers-1?
                slideProjects('fwd');
                //console.log('scrollFwd');
            } else {
                    scrollUnlock();
            }
        } else if (currentTile > 1) {
            slideProjects('back');
            //console.log('scrollBack');
        } else {
            scrollUnlock();
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



function setPageHeight() {
    tileHeight = $('.carousel').height();
    $('.project__outer').css({
       height: tileHeight 
    });
    $('.carousel__inner').css({
       height: tileHeight * (numProjects),
       transform : 'translateY(-' + ((currentTile - 1) * tileHeight) + 'px)'
    });
}


/*
function scrollContainer(e) {
    console.log($('.l-page:nth-child(' + currentPage + ')' ).offset().top);
    const getDelta = function(e) {
        if (e.originalEvent.changedTouches) {
            var touchEnd = e.originalEvent.changedTouches[0].clientY;
            return touchEnd - touchStart;
        } else {
            return e.originalEvent.wheelDelta;
        }
    };
    
    const pageFinishedMove = function() {
        var currentPageTop = Math.round($('.l-page:nth-child(' + currentPage + ')' ).offset().top);
        return ( currentPageTop === 0 );  // returns true if current page top is equal to container area top.
    };
    
    if ( pageFinishedMove() ) {
        if(getDelta(e) <= 0) {
            scrollPages('fwd');
        } else {
            scrollPages('back')
        }
    }
}

function scrollPages(str) {   
    var next;
    if (str == 'fwd') {
        next = currentPage + 1;
    } else if (str == 'back') {
        next = currentPage - 1;
    }
    if (next < 1) {
        next = 1;
    } 
    if (next > 4) {
        next = 4;
    } 
    slideY('.scroll__container', '-' + ((next - 1) * 100) + 'vh');              // slide entire carousel up/down one tile height, -1 for zero-indexed multiplier
    
   
    currentPage = next;
}
*/


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