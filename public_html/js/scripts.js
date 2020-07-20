
let currentSection = 'home';

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
    navButtons[0].style.opacity = '0.8';
    navButtons[0].style.filter = 'grayscale(0)';
})

window.addEventListener('scroll', function(e) {
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
    //console.log(currentSection);
});