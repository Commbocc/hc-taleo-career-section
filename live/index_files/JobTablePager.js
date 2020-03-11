define(
		[ 'jquery', 'fs/ResourcesHandler', 'fs/PageDetails'],
		function($, ResourcesHandler, PageDetails) {

			function JobTablePager(htmlId, searchHandler) {

				this.htmlId = htmlId;
				this.currentDisplayedPageNo = 1;

                this.restoreFocus = false;
                this.pageDetails;
	
				this.refresh = function(pagingData) {

					this.currentDisplayedPageNo = pagingData.currentPageNo;
                    this.pageDetails = new PageDetails(pagingData);
					var pageCount = this.pageDetails.getPageCount();

					this.getPagesList().children().remove();

					var firstPage = this.pageDetails.getFirstPage(this.currentDisplayedPageNo);
					var lastPage = this.pageDetails.getLastPage(this.currentDisplayedPageNo);
                    var currentPageItem = null;

					for ( var i = firstPage; i <= lastPage; ++i) {
                        var listItem;

                        if( this.currentDisplayedPageNo == i){
                            currentPageItem =  this.createPageLinkItem(i , true);
                            this.getPagesList().append(currentPageItem);
                        } else {
                            this.getPagesList().append(this.createPageLinkItem(i, false));
                        }
                    }

					var jobTablePager = this;
					this
							.updateNavigationLink(
									'next',
									this.currentDisplayedPageNo == pageCount,
									function(event) {
										jobTablePager
												.gotoPage(jobTablePager.currentDisplayedPageNo + 1);
									});
					this
							.updateNavigationLink(
									'previous',
									this.currentDisplayedPageNo == 1,
									function(event) {
										jobTablePager
												.gotoPage(jobTablePager.currentDisplayedPageNo - 1);
									});
                    this.refreshReloadMessage(this.currentDisplayedPageNo);
                    if(currentPageItem && this.restoreFocus) {
                        this.restoreFocus = false;
                        currentPageItem.children().first().focus();
                    }
                }

				this.updateNavigationLink = function(linkId, disabled, handler) {
					if (disabled) {
						this.disableNavigationLink(linkId);
					} else {
						this.enableNavigationLink(linkId, handler);
					}
				}

				this.enableNavigationLink = function(linkId, handler) {
					var link = this.getContainer().find('#' + linkId);
					link.off('click');
					link.removeClass('navigation-link-disabled');
					link.parent().removeClass('pagerlinkoff');
					link.parent().addClass('pagerlink');
					link.on('click', handler);
                    link.attr("aria-disabled", "false");
				}

				this.disableNavigationLink = function(linkId) {
					var link = this.getContainer().find('#' + linkId);
					link.addClass('navigation-link-disabled');
					link.parent().removeClass('pagerlink');
					link.parent().addClass('pagerlinkoff');
					link.off('click');
                    link.attr("aria-disabled", "true");
				}

				this.getPagesList = function() {
					return this.getContainer().find('ul');
				}

				this.getContainer = function() {
					return $('#' + this.htmlId);
				}

                this.createPageLinkItem = function(pageNo, currentLink) {

                    var anchor = $('<a>').text(pageNo);
                    var pager = this;
                    anchor.attr('href', '#');
                    anchor.attr('title', this.createPageLinkTitle(pageNo));
                    anchor.click(function() {
                        pager.restoreFocus = true;
                        pager.gotoPage(pageNo);
                    });

                    var item = $('<li>');
                    item.append(anchor);
                    if (currentLink){
                        item.addClass('navigation-link-disabled');
                        anchor.attr("aria-disabled", "true");
                    }  else{
                        item.addClass('pagerlink');
                        anchor.attr("aria-disabled", "false");
                    }
					return item;
				}

				this.gotoPage = function(pageNo) {
					this.currentDisplayedPageNo = pageNo;
					searchHandler.refresh({
						pageNo : pageNo,
						type : "PAGE"
					});
				}
                this.createPageLinkTitle = function(pageNo){
                   return ResourcesHandler.getResource('pagerAccessibilityResources.pageNumberLinkTitle').replace('{0}', pageNo);
                }

				this.getCurrentPageNo = function() {
					return this.currentDisplayedPageNo;
				}

				this.clear = function() {
					this.currentDisplayedPageNo = 1;
				}

				this.refreshReloadMessage = function(pCurrentDisplayedPageNo) {
					var reloadMessage = $('#reloadMessage');
					reloadMessage.attr("aria-hidden", "false");
					reloadMessage.html(this.pageDetails.accessibilityJobListReload(pCurrentDisplayedPageNo));
					reloadMessage.attr("aria-hidden", "true");
				}

			}
			// end-of-class-definition

			return JobTablePager;
		});