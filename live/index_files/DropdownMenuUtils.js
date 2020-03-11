define(['jquery'], function($){

	function DropdownMenuUtils(toggleButtonClass, dropdownMenuClass) {
	    this.toggleButtonClass = toggleButtonClass;
	    this.dropdownMenuClass = dropdownMenuClass;
	
	    this.addClickOnHtmlHandler = function () {
	        $('html').click(function (event) {
	            hideAllDropdownMenus();
	        });
	    };
	
	    this.registerCloseMenuHandlers = function (){
	       this.addClickOnHtmlHandler();
	       this.addKeyDownHandler();
	    };
	
	    this.addKeyDownHandler = function (){
	        $('.'+ dropdownMenuClass).keydown(function (e) {
	            if (e.which == 9 || e.which == 27) {
	                hideAllDropdownMenus();
	            }
	        });
	    };
	
	    this.addClickOnToggleButtonAndDroplistHandlers = function () {
	        var selector1 = '.' + dropdownMenuClass;
	        var selector2 = '.' + toggleButtonClass;
	
	        $(selector2).parent().click(function (e) {
	            if (!$(this).hasClass('open')) {
	                hideAllDropdownMenus();
	            }
	
	            $(this).toggleClass('open');
	            $(this).attr("aria-expanded", $(this).hasClass('open'));
	            placeFocusOnFirstListElement(selector1);
	            e.stopPropagation();
	        });
	
	        $(selector1 + ' a').click(function (e) {
	            hideAllDropdownMenus();
	            e.stopPropagation();
	        });
	
	        $(selector1).click(function (e) {
	            e.stopPropagation();
	        });
	
	        $(selector2).parent().keydown(function (e) {
	            // trigger click on enter/space/up,down arrow
	             var target = e.target || e.srcElement;
	            if ((e.which == 13 || e.which == 32 || e.which == 38 ||(e.which == 40)) && target == this) {
	                $(this).click();
	                return false;
	            }
	        });
	    };
	
	    function placeFocusOnFirstListElement(selector1) {
	        $(selector1 + ' li:first-child').attr('tabindex', '0');
	        $(selector1 + ' li:first-child > span').focus();    //this has to be made this way to support hamburger menu
	        $(selector1 + ' li:first-child > a').focus();       //which has either 'a' or 'span' element hidden/active
	    }
	
	    function hideAllDropdownMenus() {
	        var menu = $('.dropdown-menu').parent();
	        focusCurrentlyOpenMenuButton(menu);
	        $(menu).removeClass('open').attr("aria-expanded", "false");
	    }
	
	    function focusCurrentlyOpenMenuButton(menu) {
	        $(menu).each(function () {
	            if ($(this).hasClass('open')) {
	                $(this).focus();
	            }
	        });
	    }
	}
	//end-of-class definition
	  
    return DropdownMenuUtils;
});