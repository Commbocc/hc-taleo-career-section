define(
		[ 'jquery', 'fs/StaticResourcesProvider' ],
		function($, StaticResourcesProvider) {

			function ShowMoreLessLinkFactory() {

				this.getShowMoreLessLink = function(renderer, container) {
					var showingMore = renderer.MAX_NR_OF_ELEMENT == renderer.elementsLimit
							|| renderer.MAX_NR_OF_ELEMENT <= renderer.filter.select.length;

					var link = $("<a>").attr("href", "javascript:void(0);")
							.attr("id", renderer.showMoreID).addClass(
									"filter-link-anchor");
					link.html(showingMore ? StaticResourcesProvider.showLess
							: StaticResourcesProvider.showMore);
					link
							.click(function() {
								if (showingMore) {
									renderer.elementsLimit = renderer.DEFAULT_NR_OF_ELEMENT;
								} else {
									renderer.elementsLimit = renderer.MAX_NR_OF_ELEMENT;
								}
								renderer.render();
							});

					var box = $("<div>").addClass("filter-link filter-link-show-more").append(link);
					return box;
				}
			}
			// end-of-class-definition

			return ShowMoreLessLinkFactory;

		});