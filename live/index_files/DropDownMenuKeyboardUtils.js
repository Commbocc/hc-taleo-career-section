define(['jquery'], function($){


	/**
	 * Created by pipalka on 10/8/2014.
	 */
	function DropDownMenuKeyboardUtils(listHeaderClass) {
	    var SPACE_KEY = 32;
	    var UP_KEY = 38;
	    var DOWN_KEY = 40;
	    var menuListSelector = '.' + listHeaderClass;
	    var focusableListContent;
	
	    this.registerKeyboardNavigationActions = function () {
	        $(menuListSelector + ' li').keydown(function (e) {
	            focusableListContent = $(':focus').is('a') ? 'a' : 'span'; //this has to be made this way to support hamburger menu
	            var keyCode = e.which;                                     //which has either 'a' or 'span' element hidden/active
	            var currentElement = $(':focus').parent();
	
	            if (keyCode == UP_KEY) {
	                currentElement = getPreviousListElement(currentElement);
	                e.preventDefault();
	            }
	            else if (keyCode == DOWN_KEY) {
	                currentElement = getNextListElement(currentElement);
	                e.preventDefault();
	            }
	            else if (keyCode == SPACE_KEY) {
	                $(currentElement).find(focusableListContent)[0].click()
	                e.preventDefault();
	            }
	            else if (keyCode !== 0) {
	                var firstLetter = String.fromCharCode(keyCode);
	                var menuList = $(currentElement).parent().children();
	                var foundElement = findElementByFirstLetter(menuList, currentElement, firstLetter);
	                if (foundElement) {
	                    currentElement = foundElement;
	                }
	            }
	            currentElement.find(focusableListContent).focus();
	        });
	    };
	
	    function findElementByFirstLetter(menuList, currentElement, firstLetter) {
	        var currentElementIndex = $(currentElement).index();
	
	        var slicedMenuList = menuList.slice(currentElementIndex + 1);
	        var result = findElement(slicedMenuList, firstLetter);
	        if (!result) {
	            result = findElement(menuList, firstLetter);
	        }
	        return result;
	    }
	
	    function findElement(elementList, firstLetter) {
	        var result = null;
	        var pattern = '^' + firstLetter;
	
	        elementList.each(function () {
	            var text = $(this).find(focusableListContent).text();
	            if (RegExp(pattern).test(text)) {
	                result = $(this);
	                return false;
	            }
	        });
	        return result;
	    }
	
	    function getPreviousListElement(currentElement) {
	        var previousElement;
	        if ($(currentElement).is(':first-child')) {
	            previousElement = $(currentElement).parent().children().last();
	        }
	        else if ($(currentElement).prev().is('li')) {
	            previousElement = $(currentElement).prev();
	        }
	        else {
	            previousElement = $(currentElement).prev().prev();
	        }
	        return previousElement;
	    }
	
	    function getNextListElement(currentElement) {
	        var nextElement;
	        if ($(currentElement).is(':last-child')) {
	            nextElement = $(currentElement).parent().children().first();
	        }
	        else if ($(currentElement).next().is('li')) {
	            nextElement = $(currentElement).next();
	        }
	        else {
	            nextElement = $(currentElement).next().next();
	        }
	        return nextElement;
	    }
	}
	//end-of-class definition
	  
    return DropDownMenuKeyboardUtils;
});