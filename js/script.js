function testWebP(callback) {
    let webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
    if (support == true) {
        document.querySelector('body').classList.add('webp');
    }else{
        document.querySelector('body').classList.add('no-webp');
    }
});

function ibg(){
    let ibg=document.querySelectorAll(".ibg");
    for (var i = 0; i < ibg.length; i++) {
        if(ibg[i].querySelector('img')){
            ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
        }
    }
 }
    
ibg();
(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);

					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};

					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = "max";

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}

	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {

				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {

				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	dynamicAdapt();

	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 } 
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}

	function customAdapt() {
		const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());
const popupLinks = document.querySelectorAll('.popup-link');
const lockPadding = document.querySelectorAll('.lock-padding');
let body = document.querySelector('body');

let unlock = true;

const timeout = 1000;

if(popupLinks.length > 0){
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener('click', function(e){
            const popupName = popupLink.getAttribute('href').replace('#', '');
            const curentPopup = document.getElementById(popupName);
            popupOpen(curentPopup);
            e.preventDefault();
        });
    }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');

if(popupCloseIcon > 0){
    for (let index = 0; index < popupCloseIcon.length; index++) {
        const el = popupCloseIcon[index];
        el.addEventListener('click', function(e){
            popupClose(el.closest('.popup'))
            e.preventDefault()
        });
    }
}

function popupOpen(curentPopup){
    if(curentPopup && unlock){
        const popupActive = document.querySelector('.popup.open');
        if(popupActive){
            popupClose(popupActive, false);
        }

        else{
            bodyLock();
        }

        curentPopup.classList.add('open');
        curentPopup.addEventListener('click', function(e){
            if(!e.target.closest('.popup__content')){
                popupClose(e.target.closest('.popup'))
            }
        })
    }
}

function popupClose(popupActive, doUnlock = true){
    if(unlock){
        popupActive.classList.remove('open');
        if(doUnlock){
            bodyUnLock();
        }
    }
}

function bodyLock(){
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    if(lockPaddingValue.length > 0){
        for (let index = 0; index < lockPaddingValue.length; index++) {
            const el = lockPaddingValue[index];
            
        }
    }
   
    body.classList.add('lock');

    unlock = false;
    setTimeout(function(){
        unlock = true;
    }, timeout)
}

function bodyUnLock(){
    setTimeout(function(){
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = '0px';
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout)

    unlock = false;
    setTimeout(function(){
        unlock = true;
    }, timeout)
}

document.addEventListener('keydown', function(e){
    if(e.width === 27){
        const popupActive = document.querySelector('.popup.open');
        popupClose(popupActive);
    }
});

(function (){
    if(!Element.prototype.closest){
        Element.prototype.closest = function(css){
            let node = this;
            while(node){
                if(node.mathes(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }
})();

(function (){
    if(!Element.prototype.mathes){
        Element.prototype.mathes = Element.prototype.matchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.moztMatchesSelector ||
        Element.prototype.msMatchesSelector;
    }
})();
let inputs = document.querySelectorAll('input');

for (let index = 0; index < inputs.length; index++) {
    let currentInput = inputs[index];
    let currentInputPlaceholder = currentInput.placeholder;
    
    currentInput.addEventListener('focusin', function(){
        this.placeholder = '';
    })

    currentInput.addEventListener('focusout', function(){
        this.placeholder = currentInputPlaceholder;
    })
}

let textareas = document.querySelectorAll('textarea');

for (let index = 0; index < textareas.length; index++) {
    let currentTextarea = textareas[index];
    let currentTextareaPlaceholder = currentTextarea.placeholder;
    
    currentTextarea.addEventListener('focusin', function(){
        this.placeholder = '';
    })

    currentTextarea.addEventListener('focusout', function(){
        this.placeholder = currentTextareaPlaceholder;
    })
}
let menuIcon = document.querySelector('.icon-menu'),
    headerMenu = document.querySelector('.menu__body'),
    windowWidth = window.innerWidth,
    headerBtn = document.querySelector('.header__button');

menuIcon.addEventListener('click', function(){

	this.classList.toggle('_rotate');
	headerMenu.classList.toggle('_active');
	body.classList.toggle('_lock');
	
});

if(windowWidth <= 770){
    headerBtn.innerHTML = '<i class="fas fa-phone"></i>'
}

$('.main-slider').slick({
    arrows: false,
    dots: true,
    responsive:[
        {
            breakpoint: 539,
            settings: {
                dots: false
            }
        }
    ]
})

$('.options__row').slick({
    slidesToShow: 3,
    infinite: false,
    responsive:[
        {
            breakpoint: 1427,
            settings: {
                slidesToShow:2
            },
            
        },
        {
            breakpoint: 999,
            settings: {
                slidesToShow:1
            },
            
        }
    ]
})

$('.services__slider').slick({
    slidesToShow: 3,
    infinite: false,
    responsive:[
        {
            breakpoint: 1431,
            settings: {
                slidesToShow:2
            },
            
        },
        {
            breakpoint: 971,
            settings: {
                slidesToShow:1
            },
            
        },
    ]
})

