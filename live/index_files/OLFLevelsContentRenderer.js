define(
		[ 'jquery', 'fs/OLFLevelsBuilder', 'fs/CheckboxItemRenderer',
				'fs/ShowMoreLessLinkFactory', 'fs/SeeAllOlfLinkFactory' ],
		function($, OLFLevelsBuilder, CheckboxItemRenderer,
				ShowMoreLessLinkFactory, SeeAllOlfLinkFactory) {
			/*
			 * Renders OLF facets in levels structure
			 */
			function OLFLevelsContentRenderer(searchHandler) {
				var self = this;

				this.structureBuilder = new OLFLevelsBuilder();

				this.itemRenderer = new CheckboxItemRenderer();
				this.showLinkFactory = new ShowMoreLessLinkFactory();
				this.seeAllOlfLinkFactory = new SeeAllOlfLinkFactory(searchHandler);

				this.DEFAULT_NR_OF_ELEMENT = 5;
				this.MAX_NR_OF_ELEMENT = 10;

				this.elementsLimit = this.DEFAULT_NR_OF_ELEMENT;

				this.filter = null;
				this.containerId = null;
				this.showMoreID = null;

				this.init = function(filter, containerId) {
					this.filter = filter;
					this.containerId = containerId;
					this.showMoreID = this.filter.id + '-moreless';
				}

				this.render = function() {
					var container = $('#' + this.containerId);
					container.children().remove();

					var levelsLabels = (this.filter.model && this.filter.model.levelList) ? this.filter.model.levelList
							: new Array();

					// get structure of levels with items for rendering
					var levels = this.structureBuilder.buildStructure(
							this.filter.values, this.filter.select,
							this.elementsLimit, levelsLabels);

					$.each(levels, function(index, level) {

						// add fieldSet for OAG
						var fieldSet = addFieldSet(container, level);
						renderLevelLabel(fieldSet, level);
						renderLevelItems(fieldSet, level.index, level.items);
					});

					renderShowMoreLessLink(container);
					renderSeeAllOlfLink(container);
					var showMoreLink = document.getElementById(this.showMoreID);
					if (showMoreLink != null) {
						try {
							showMoreLink.focus();
						} catch (ignore) {
							// in ie8 and ie7 an exception is thrown so we have
							// to ignore it
						}
					}
				}

				this.clear = function() {
					$('#' + this.containerId).children().remove();
				}

				function addFieldSet(container, level) {
					var fieldSetId = "fieldSetId-" + self.filter.id + "-level-"
							+ level.index;
					var fieldSet = $("<div>").attr("role", "group").attr(
							"aria-labelledby", fieldSetId);
					container.append(fieldSet);

					var legend = $("<div>").attr("id", fieldSetId);
					legend.html(level.label);
					legend.addClass("hidden-audible");
					fieldSet.append(legend);
					return fieldSet;
				}

				function renderLevelLabel(container, level) {
					var labelId = self.filter.id + "-level-" + level.index;

					var label = $("<div>").attr("id", labelId);
					label.addClass("filter-level-title");
					label.html(level.label);

					container.append(label);
				}

				function renderLevelItems(container, levelIndex, items) {
					$.each(items, function(index, item) {
						var itemId = self.filter.id + "-level-" + levelIndex
								+ "-item-" + index;

						self.itemRenderer.render(self.filter, container,
								itemId, item);
					});
				}

				function renderShowMoreLessLink(container) {
					// check whether the link should be displayed
					if ((self.filter.values.length != self.filter.select.length)
							&& (self.DEFAULT_NR_OF_ELEMENT < self.filter.values.length)
							&& (self.MAX_NR_OF_ELEMENT > self.filter.select.length)) {

						var link = self.showLinkFactory.getShowMoreLessLink(
								self, container);
						container.append(link);
					}
				}

				function renderSeeAllOlfLink(container) {
					// check whether the link should be displayed
					if (self.filter.olf && self.filter.values.length > 0) {

						var link = self.seeAllOlfLinkFactory
								.getSeeAllOlfLink(self.filter);
						container.append(link);
					}
				}
			}
			// end-of-class-definition

			return OLFLevelsContentRenderer;

		});