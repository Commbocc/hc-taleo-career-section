define(
		[ 'jquery', 'fs/Utilities' ],
		function($, Utilities) {
			
			function PopupManager(overlayHtmlId) {

				this.overlayHtmlId = overlayHtmlId;
				this.lastActiveElements = {};
				this.lastActiveElementOnPopupId = null;
				this.zIndexStack = [];

				$('#' + overlayHtmlId).hide();

				this.getContainerMainSection = function() {
					return $('.mainsection');
				}

				this.getContainerDocument = function() {
					return $(document);
				}

				this.getOverlayWidth = function() {
					return this.getContainerMainSection().width();
				}

				this.getOverlayHeight = function() {
					return this.getContainerDocument().height();
				}

				this.getStackElement = function() {
					var stack = this.zIndexStack;
					return stack[stack.length-1];
				}

				this.getCloseByOutsideClickFromStack = function() {
					var stackElement = this.getStackElement();
					return stackElement['closeByOutsideClick'];
				}

				this.getDialogFromStack = function() {
					var stackElement = this.getStackElement();
					return stackElement['dialog'];
				}

				this.getZIndexFromStack = function() {
					return this.getDialogFromStack().zIndex();
				}

				this.pushToStack = function(dialog,closeByOutsideClick){
					var stack = this.zIndexStack;
					stack.push({'dialog':dialog,'closeByOutsideClick':closeByOutsideClick});
					this.showOverlay();
				}

				this.popFromStack = function(){
					var stack = this.zIndexStack;
					stack.pop();
					if(stack.length!=0) {
						this.showOverlay();
					}
				}



				this.showOverlay = function() {

					var overlay = $('#' + overlayHtmlId);
					var dialogZIndex = this.getZIndexFromStack();
					this.overlayCloseBehaviour();
					var self = this;
					overlay.show();
					overlay.on('click', function(event) {
						event.stopPropagation();
						if (self.lastActiveElementOnPopupId) {
							$('#' + self.lastActiveElementOnPopupId).focus();
						}
					});
					overlay.css({
						width : this.getOverlayWidth(),
						height : this.getOverlayHeight(),
						zIndex : dialogZIndex-1
					});
					overlay.offset( this.getContainerMainSection().offset());
					$(window).resize(function(){
						overlay.width(self.getOverlayWidth());
						overlay.height(self.getOverlayHeight())
					});
				}

				this.hideOverlay = function() {

					var overlay = $('#' + overlayHtmlId);
					overlay.hide();
					overlay.off('click');
					this.popFromStack();
				}

				this.closePopup = function(dialog, restoreFocus) {
					dialog.hide();
					this.hideOverlay();
					dialog.attr("aria-hidden", "true");
					if (typeof restoreFocus === 'undefined') {
						this.restoreFocus(dialog);
					}
				}

				this.trapFocus = function(event, dialog) {
					var evt = event || window.event;
					var code = evt.which || evt.keyCode;

					if (!evt.shiftKey && code == 9) {
						if (this.isFocusOnLastElement(dialog)) {
							evt.preventDefault();
							this.setFocusOnFirstElement(dialog);
						}
					} else if (evt.shiftKey && code == 9) {
						if (this.isFocusOnFirstElement(dialog)) {
							evt.preventDefault();
							this.setFocusOnLastElement(dialog);
						}
					}

					evt.stopPropagation();
				}

				this.closeByEsc = function(event, dialog) {

					var evt = event || window.event;
					var code = evt.which || evt.keyCode;

					if (code === 27) {
						this.closePopup(dialog);
					}
				}

				this.isFocusOnFirstElement = function(dialog) {
					return document.activeElement === dialog.find(
							':focusable:first').get(0);
				}

				this.isFocusOnLastElement = function(dialog) {
					return document.activeElement === dialog.find(
							':focusable:last').get(0);
				}

				this.setFocusOnFirstElement = function(dialog) {
					dialog.find(':focusable:first').focus();
				}

				this.setFocusOnLastElement = function(dialog) {
					dialog.find(':focusable:last').focus();
				}

				this.addSpaceEventToButtonLinks = function(dialog) {
					dialog.find("a[role='button']").each(function() {
						Utilities.getInstance().addSpaceEvent(this.id);
					});
				}

				this.openPopup = function(dialog, source) {

					this.setLastActiveElement(dialog, $(':focus'));
					this.openFixedPositionedPopup(dialog, false);


					var container = this.getContainerMainSection();
					var self = this;

					var positionLeft = container.offset().left
							+ (container.outerWidth() - dialog.outerWidth())
							/ 2;

					var verticalAnchor = source ? source : container;
					var positionTop = verticalAnchor.offset().top
							+ (verticalAnchor.outerHeight() - dialog
									.outerHeight()) / 2;

					positionLeft = Math.max(0, Math.floor(positionLeft));
					positionTop = Math.max(0, Math.floor(positionTop));

					dialog.offset({
						left : positionLeft,
						top : positionTop
					});

					dialog.focusout(function(event) {
						self.lastActiveElementOnPopupId = event.target.id;
					});

				}

				this.overlayCloseBehaviour = function() {

					var self = this;
					var dialog = this.getDialogFromStack();
					var closeByOutsideClick = this.getCloseByOutsideClickFromStack();
					if (closeByOutsideClick) {
						$('#' + this.overlayHtmlId).off('click');
						$('#' + this.overlayHtmlId).click(function() {
							self.closePopup(dialog);
						});
					}else {
						$('#' + this.overlayHtmlId).off('click');
					}
				}

				this.openFixedPositionedPopup = function(dialog,
						closeByOutsideClick, closeByEscape) {

					var self = this;
                    dialog.keydown(function(event) {
						if (closeByEscape) {
							self.closeByEsc(event, dialog);
						}
						self.trapFocus(event, dialog);
					});
					dialog.attr("aria-hidden", "false");
					dialog.css('z-index', 1001);
					dialog.css('position', 'absolute');
					dialog.show();
					this.setFocusOnFirstElement(dialog);
					this.addSpaceEventToButtonLinks(dialog);
					this.pushToStack(dialog,closeByOutsideClick);

				}

				this.setLastActiveElement = function(dialog, lastActiveElement) {
					this.lastActiveElements[dialog.attr('id')] = lastActiveElement;
				}

				this.restoreFocus = function(dialog) {
					var lastActiveElement = this.lastActiveElements[dialog
							.attr('id')];
					if (lastActiveElement) {
						lastActiveElement.focus();
					}
					this.lastActiveElements[dialog.attr('id')] = null;
				}
			}
			// end-of-class-definition

			return  PopupManager;

		});
