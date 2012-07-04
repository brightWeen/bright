//======================================================== FASTCLICK
//https://developers.google.com/mobile/articles/fast_buttons?hl=zh-CN#code
FastButton = (function (element, handler) {
    this.element = element;
    this.handler = handler;
    element.addEventListener('touchstart', this, false);
    element.addEventListener('click', this, false);
    FastButton.prototype.handleEvent = function (event) {
        switch (event.type) {
            case 'touchstart': this.onTouchStart(event); break;
            case 'touchmove': this.onTouchMove(event); break;
            case 'touchend': this.onClick(event); break;
            case 'click': this.onClick(event); break;
        }
    };
    FastButton.prototype.onTouchStart = function (event) {
        event.stopPropagation();
        this.element.addEventListener('touchend', this, false);
        document.body.addEventListener('touchmove', this, false);
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
        isMoving = false;
    };
    FastButton.prototype.onTouchMove = function (event) {
        if (Math.abs(event.touches[0].clientX - this.startX) > 10 || Math.abs(event.touches[0].clientY - this.startY) > 10) {
            this.reset();
        }
    };
    FastButton.prototype.onClick = function (event) {
        this.reset();
        this.handler.call(this.element, event);
        //this.handler(event);
        if (event.type == 'touchend') {
            preventGhostClick(this.startX, this.startY);
        }
    };
    FastButton.prototype.reset = function () {
        this.element.removeEventListener('touchend', this, false);
        document.body.removeEventListener('touchmove', this, false);
    };
    function preventGhostClick(x, y) {
        coordinates.push(x, y);
        window.setTimeout(gpop, 2500);
    };
    function gpop() {
        coordinates.splice(0, 2);
    };
    function gonClick(event) {
        for (var i = 0; i < coordinates.length; i += 2) {
            var x = coordinates[i];
            var y = coordinates[i + 1];
            if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    };
    document.addEventListener('click', gonClick, true);
    var coordinates = [];
});
function FastButton(element, handler) {
    this.element = element;
    this.handler = handler;
    element.addEventListener('touchstart', this, false);
    element.addEventListener('click', this, false);
};
//FastButton.prototype.handleEvent = function (event) {
//    switch (event.type) {
//        case 'touchstart': this.onTouchStart(event); break;
//        case 'touchmove': this.onTouchMove(event); break;
//        case 'touchend': this.onClick(event); break;
//        case 'click': this.onClick(event); break;
//    }
//};
//FastButton.prototype.onTouchStart = function (event) {
//    event.stopPropagation();
//    this.element.addEventListener('touchend', this, false);
//    document.body.addEventListener('touchmove', this, false);
//    this.startX = event.touches[0].clientX;
//    this.startY = event.touches[0].clientY;
//    isMoving = false;
//};
//FastButton.prototype.onTouchMove = function (event) {
//    if (Math.abs(event.touches[0].clientX - this.startX) > 10 || Math.abs(event.touches[0].clientY - this.startY) > 10) {
//        this.reset();
//    }
//};
//FastButton.prototype.onClick = function (event) {
//    this.reset();
//    this.handler(event);
//    if (event.type == 'touchend') {
//        preventGhostClick(this.startX, this.startY);
//    }
//};
//FastButton.prototype.reset = function () {
//    this.element.removeEventListener('touchend', this, false);
//    document.body.removeEventListener('touchmove', this, false);
//};
//function preventGhostClick(x, y) {
//    coordinates.push(x, y);
//    window.setTimeout(gpop, 2500);
//};
//function gpop() {
//    coordinates.splice(0, 2);
//};
//function gonClick(event) {
//    for (var i = 0; i < coordinates.length; i += 2) {
//        var x = coordinates[i];
//        var y = coordinates[i + 1];
//        if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
//            event.stopPropagation();
//            event.preventDefault();
//        }
//    }
//};
//document.addEventListener('click', gonClick, true);
//var coordinates = [];
//function initFastButtons() {
//    new FastButton(document.getElementById("testBtn"), goSomewhere);
//};
//function goSomewhere() {
//    var theTarget = document.elementFromPoint(this.startX, this.startY);
//    if (theTarget.nodeType == 3) theTarget = theTarget.parentNode;

//    var theEvent = document.createEvent('MouseEvents');
//    theEvent.initEvent('click', true, true);
//    theTarget.dispatchEvent(theEvent);
//};
//========================================================

//var google = {};
//google.ui = {};

//google.ui.FastButton = function (element, handler) {
//    this.element = element;
//    this.handler = handler;

//    element.addEventListener('touchstart', this, false);
//    //element.addEventListener('click', this, false);
//};

//google.ui.FastButton.prototype.handleEvent = function (event) {
//    switch (event.type) {
//        case 'touchstart': this.onTouchStart(event); break;
//        case 'touchmove': this.onTouchMove(event); break;
//        case 'touchend': this.onClick(event); break;
//        case 'click': this.onClick(event); break;
//    }
//};
//google.ui.FastButton.prototype.onTouchStart = function (event) {
//    event.stopPropagation();

//    this.element.addEventListener('touchend', this, false);
//    document.body.addEventListener('touchmove', this, false);

//    this.startX = event.touches[0].clientX;
//    this.startY = event.touches[0].clientY;
//};
//google.ui.FastButton.prototype.onTouchMove = function (event) {
//    if (Math.abs(event.touches[0].clientX - this.startX) > 10 ||
//      Math.abs(event.touches[0].clientY - this.startY) > 10) {
//        this.reset();
//    }
//};
//google.ui.FastButton.prototype.onClick = function (event) {
//    event.stopPropagation();
//    this.reset();
//    this.handler(event);

//    if (event.type == 'touchend') {
//        google.clickbuster.preventGhostClick(this.startX, this.startY);
//    }
//};

//google.ui.FastButton.prototype.reset = function () {
//    this.element.removeEventListener('touchend', this, false);
//    document.body.removeEventListener('touchmove', this, false);
//};
//google.clickbuster = {};
//google.clickbuster.preventGhostClick = function (x, y) {
//    google.clickbuster.coordinates.push(x, y);
//    window.setTimeout(google.clickbuster.pop, 2500);
//};

//google.clickbuster.pop = function () {
//    google.clickbuster.coordinates.splice(0, 2);
//};

//google.clickbuster.onClick = function (event) {
//    //    alert("fafa");
//    for (var i = 0; i < google.clickbuster.coordinates.length; i += 2) {
//        var x = google.clickbuster.coordinates[i];
//        var y = google.clickbuster.coordinates[i + 1];
//        if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
//            event.stopPropagation();
//            event.preventDefault();
//        }
//    }
//};
//document.addEventListener('click', google.clickbuster.onClick, true);
//google.clickbuster.coordinates = [];