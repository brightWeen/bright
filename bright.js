(function () {
    /**
    * Bright
    * @author wenxinzhe <wen.xinzhe@gmail.com>
    * 一个迷你的Jquery,修改自light.js
    *
    * original author:
    * @author    Victor Villaverde Laan <info@freelancephp.net>
    * @link      http://www.freelancephp.net/Bright-4kb-min-jquery-Bright/
    * @license   Dual licensed under the MIT and GPL licenses
    */

    /**
    * Bright function
    */
    var Bright = function (selector, parent) {
        return new Bright.core.init(selector, parent);
    },
    toString = Object.prototype.toString,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    push = Array.prototype.push,
    slice = Array.prototype.slice,
    indexOf = Array.prototype.indexOf;

    //自定义字符集
    var rclass = /[\n\t]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /href|src|style/,
	rtype = /(button|input)/i,
	rfocusable = /(button|input|object|select|textarea)/i,
	rclickable = /^(a|area)$/i,
	rradiocheck = /radio|checkbox/;

    // if global $ is not set
    if (!window.$)
        window.Bright = window.$ = Bright;

    //#region JSLoader (JS异步加载)

    var browserUserAgent = (navigator.userAgent || navigator.vendor || window.opera);
    if (browserUserAgent != null) {
        browserUserAgent = browserUserAgent.toLowerCase();
    }
    var Browser = {
        ie: /(msie)|(windows (ce|phone))/.test(browserUserAgent),
        webkit: /webkit/.test(browserUserAgent),
        moz: /gecko/.test(browserUserAgent),
        opera: /opera/.test(browserUserAgent),
        safari: /safari/.test(browserUserAgent)
    };
    Bright.JsLoader = function (sUrl, fCallback, sBianMa) {
        var _script = document.createElement('script');
        _script.setAttribute('charset', sBianMa || "utf-8");
        _script.setAttribute('type', 'text/javascript');
        _script.setAttribute('src', sUrl);
        document.getElementsByTagName('head')[0].appendChild(_script);
        if (Browser.ie) {
            _script.onreadystatechange = function () {
                if (this.readyState == 'loaded' || this.readyState == 'complete') {
                    _script.parentNode.removeChild(_script);
                    fCallback();
                }
            };
        } else if (Browser.moz || Browser.opera || Browser.webkit) {
            _script.onload = function () {
                _script.parentNode.removeChild(_script);
                fCallback();
            };
        } else {
            _script.parentNode.removeChild(_script);
            fCallback();
        }
    };

    //#endregion

    //#region 迷你模板引擎

    Bright.tmpl = function (str, obj) {
        if (!(Object.prototype.toString.call(str) === '[object String]')) {
            return '';
        }
        // {}, new Object(), new Class()
        // Object.prototype.toString.call(node=document.getElementById("xx")) : ie678 == '[object Object]', other =='[object HTMLElement]'
        // 'isPrototypeOf' in node : ie678 === false , other === true
        if (!(Object.prototype.toString.call(obj) === '[object Object]' && 'isPrototypeOf' in obj)) {
            return str;
        }
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace
        return str.replace(/\{([^{}]+)\}/g, function (match, key) {
            var value = obj[key];
            return (value !== undefined) ? '' + value : '';
        });
    };

    //#endregion

    /**
    * Bright.core
    * Contains the core functions
    */
    Bright.core = Bright.prototype = {

        // init function, set selected elements
        init: function (selector, parent) {
            var els;
            selector = selector || window; // default is window
            parent = parent || document; // default is document

            //绑定 DOMElement
            if (typeof selector == "object") {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            }
            els = (typeof selector == 'string')
			? Bright.selector(selector, parent) // use selector method
			: els = selector;

            this.length = 0;
            push.apply(this, els);
            return this;
        },
        length: 0,
        // get the element of given index (return all elements when no index given)
        get: function (index) {
            return (typeof index == 'undefined')
				? this[0]
				: this[index];
        },

        // get number of selected elements
        size: function () {
            return this.length;
        },

        // 遍历元素集合
        each: function (fn) {
            //console.log(this);
            for (var i = 0, l = this.length; i < l; i++)
                fn.call(this[i], i, this);
            //fn.call(this.els[i], thi);
            return this;
        },
        //获取或设置元素数组所有属性
        attrAll: function (name, value) {
            return this.attr(name, value, true);
        },
        // 获取或设置元素属性
        attr: function (name, value, isarray) {
            var _return = this;
            var _isget = typeof value == "undefined" ? true : false;
            if (isarray && this.length > 0) {
                //批量处理
                _return = _isget ? [] : this;
                this.each(function () {
                    if (_isget) {
                        _return.push(this.getAttribute(name));
                    } else {
                        this.setAttribute(name, value);
                    }
                });
            } else {
                if (_isget) {
                    _return = this[0].getAttribute(name);
                } else {
                    this[0].setAttribute(name, value);
                }
            }
            return _return;
        },
        removeAttr: function (name) {
            return this.each(function () {
                //this.attr(this, name, "");
                if (this.nodeType === 1) {
                    this.removeAttribute(name);
                }
            });
        },
        // set styles
        css: function (styles) {
            var _styles = [];
            //接收 string或者json参数
            if (typeof styles == "string") {
                push.apply(_styles, styles.split(";"));
            } else if (typeof styles == "object") {
                for (var name in styles) {
                    _styles.push(name + ":" + styles[name]);
                }
            }
            var _item;
            this.each(function () {
                for (var i = 0, l = _styles.length; i < l; i++) {
                    _item = _styles[i].split(":");
                    this.style[_item[0]] = _item[1];
                }
            });
            return this;
        },

        // add given className
        addClass: function (value) {

            if (value && typeof value === "string") {
                var classNames = (value || "").split(rspace);

                for (var i = 0, l = this.length; i < l; i++) {
                    var elem = this[i];

                    if (elem.nodeType === 1) {
                        if (!elem.className) {
                            elem.className = value;

                        } else {
                            var className = " " + elem.className + " ";
                            for (var c = 0, cl = classNames.length; c < cl; c++) {
                                if (className.indexOf(" " + classNames[c] + " ") < 0) {
                                    elem.className += " " + classNames[c];
                                }
                            }
                        }
                    }
                }
            }
            return this;
        },

        // remove given className
        removeClass: function (value) {
            if ((value && typeof value === "string") || value === undefined) {
                var classNames = (value || "").split(rspace);

                for (var i = 0, l = this.length; i < l; i++) {
                    var elem = this[i];

                    if (elem.nodeType === 1 && elem.className) {
                        if (value) {
                            var className = (" " + elem.className + " ").replace(rclass, " ");
                            for (var c = 0, cl = classNames.length; c < cl; c++) {
                                className = className.replace(" " + classNames[c] + " ", " ");
                            }
                            elem.className = className.substring(1, className.length - 1);

                        } else {
                            elem.className = "";
                        }
                    }
                }
            }
            return this;
        },

        // has given className
        hasClass: function (className) {
            for (var i = 0; i < this.length; i++) {
                if (this[i].className.match(new RegExp('\\b' + className + '\\b')))
                    return true;
            }
            return false;
        },

        // hide elements
        hide: function () {
            this.each(function () {
                this.style["display"] = 'none';
            });
            return this;
        },

        // show elements
        show: function (other) {
            //other:inline inline-block
            var _show = other ? other : "block";
            this.each(function () {
                this.style["display"] = _show;
            });
            return this;
        },

        // set inner html
        html: function (value) {
            if (value == undefined) {
                return this[0] ? this[0].innerHTML : '';
            }
            this.each(function () {
                this.innerHTML = value;
            });
            return this;
        },

        // set inner text
        text: function (value) {
            var name = (document.body.textContent != undefined) ? 'textContent' : 'innerText';
            if (value == undefined) {
                return this[0] ? this[0][name] : '';
            }
            this.each(function () {
                this[name] = value;
            });
            return this;
        },

        // set value
        val: function (value) {
            if (value == undefined) {
                return this.els[0] ? this.els[0].value : '';
            }
            this.each(function (el) {
                el.value = value;
            });

            return this;
        },

        // find children
        find: function (selector) {
            return new this.init(selector, this.get(0));
        },

        click: function (fn) {
            return this.on("click", fn);
        },
        // add event action
        on: function (event, fn) {
            var addEvent = function (el) {
                if (window.addEventListener) {
                    el.addEventListener(event, fn, false);
                } else if (window.attachEvent) {
                    el.attachEvent('on' + event, function () {
                        fn.call(el, window.event);
                    });
                }
            };
            this.each(function () {
                addEvent(this);
            });
            return this;
        },

        // add function to be executed when the DOM is ready
        ready: function (fn) {
            DOMReady.add(fn);
            return this;
        },

        // remove selected elements from the DOM
        remove: function () {
            this.each(function () {
                this.parentNode.removeChild(this);
            });
            return this;
        },
        push: Bright.push,
        sort: [].sort,
        splice: [].splice,
        //扩展方法

        fastclick: function (fn) {
            this.each(function (el) {
                new FastButton(el, function () {
                    fn.call(el);
                });
            });
            return this;
        },
        //股票涨跌幅颜色块
        textStock: function (value, isup) {
            var _this = this;
            var name = (document.body.textContent != undefined) ? 'textContent' : 'innerText';
            var red = 'red';
            var green = 'green';
            this.each(function () {
                if (isup == 0) {
                }
                else if (isup > 0) {
                    $(this).removeClass("red,green");
                    $(this).addClass("red");
                }
                else if (isup < 0) {
                    $(this).removeClass("red,green");
                    $(this).addClass("green");
                }
                this[name] = value;
            });
            return this;
        }
    };

    var baseSelector = function (selector, context) {
        var sels = selector.split(','),
		el, op, s;
        for (var i = 0; i < sels.length; i++) {
            // trim spaces
            var sel = sels[i].replace(/\s/g, '');

            if (typeof sel == 'string') {
                op = sel.substr(0, 1); // operator
                s = sel.substr(1); // name without operator
                if (op == '#') {
                    el = document.getElementById(s);
                    el = (isDescendant(el, context)) ? el : null;
                } else if (op == '.') {
                    el = getElementsByClassName(s, context);
                } else {
                    el = context.getElementsByTagName(sel);
                }
            }
        }

        return el;

    };
    var html5Selector = function (selector, context) {
        return context.querySelectorAll(selector);
    };
    // Selector, default support:
    // $('#id')        - get element by id
    // $('.className') - get element(s) by class-name
    // $('tagName')    - get element(s) by tag-name
    Bright.selector = function (selector, context) {
        return html5Selector(selector, context);
    };

    // init gets core prototype
    Bright.core.init.prototype = Bright.core;


    /**
    * Helpers
    */

    // DOMReady, add functions to be executed when the DOM is ready
    var DOMReady = (function () {
        var fns = [],
		isReady = false,
		ready = function () {
		    isReady = true;

		    // call all functions
		    for (var i = 0; i < fns.length; i++)
		        fns[i].call();
		};

        // public add method
        this.add = function (fn) {
            // eval string in a function
            if (fn.constructor == String) {
                var strFunc = fn;
                fn = function () { eval(strFunc); };
            }

            // call imediately when DOM is already ready
            if (isReady) {
                fn.call();
            } else {
                // add to the list
                fns[fns.length] = fn;
            }
        };

        // For all browsers except IE
        if (window.addEventListener)
            document.addEventListener('DOMContentLoaded', function () { ready(); }, false);

        // For IE
        // Code taken from http://ajaxian.com/archives/iecontentloaded-yet-another-domcontentloaded
        (function () {
            // check IE's proprietary DOM members
            if (!document.uniqueID && document.expando) return;

            // you can create any tagName, even customTag like <document :ready />
            var tempNode = document.createElement('document:ready');

            try {
                // see if it throws errors until after ondocumentready
                tempNode.doScroll('left');

                // call ready
                ready();
            } catch (err) {
                setTimeout(arguments.callee, 0);
            }
        })();

        return this;
    })();

    // create a static reference
    Bright.ready = DOMReady.add;

    // Check wether an element is a descendant of the given ancestor
    function isDescendant(desc, anc) {
        return ((desc.parentNode == anc) || (desc.parentNode != document) && isDescendant(desc.parentNode, anc));
    };

    // Cross browser function for getting elements by className
    function getElementsByClassName(className, parent) {
        parent = parent || document.getElementsByTagName('body')[0];
        if (typeof (parent.getElementsByClassName) == "function") {
            return parent.getElementsByClassName(className);
        }

        var a = [], re = new RegExp('\\b' + className + '\\b'),
		els = parent.getElementsByTagName('*');
        //getElementsByClassName

        for (var i = 0; i < els.length; i++)
            if (re.test(els[i].className))
                a.push(els[i]);

        return a;
    };

})();
