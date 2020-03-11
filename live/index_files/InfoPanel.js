define(
		[ 'jquery', 'fs/FacetedSearchSettings', 'fs/PageDetails' ],
		function($, FacetedSearchSettings, PageDetails) {

			function InfoPanel(htmlId, searchHandler) {
				this.htmlId = htmlId;

				var RSS_URL = '/careersection/feed/joblist.rss?lang='
						+ FacetedSearchSettings.lang + '&portal='
						+ FacetedSearchSettings.portalNo + '&searchtype=3';

				this.refresh = function(event) {
					this.updateRSSLink(event.data.queryString);
					this.updateInfoPanel(event.data.pagingData);
				}

				this.updateRSSLink = function(queryString) {
					var rssURL = RSS_URL;
					if (queryString && queryString.length > 0) {
						rssURL += '&' + queryString;
					}
					$('#' + htmlId).find('#rssFeedLink').attr('href', rssURL)
							.click(function(event) {
								window.location.href = rssURL
							});
				}

				this.updateInfoPanel = function(pagingData) {
					if (pagingData.totalCount == 0) {
						$('.paging-info').hide();
					} else {
						$('.paging-info').show();
						this.updatePagingInfo(pagingData);
					}
				}

				this.updatePagingInfo = function(pagingData) {
                    var pageDetails = new PageDetails(pagingData);
					var currentPageInfoSpan = $('#' + htmlId).find(
							'#currentPageInfo');
					currentPageInfoSpan.empty();
					currentPageInfoSpan.text(pageDetails.jobOpeningDetailsInfo());
				}

				searchHandler.registerRefreshListener(this);
			}
			// end-of-class-definition

			return InfoPanel;
		});