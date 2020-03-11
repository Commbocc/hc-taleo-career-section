define(
		[ 'jquery', 'fs/DropdownMenuUtils', 'fs/DropDownMenuKeyboardUtils',
				'fs/list/TableRenderer', 'fs/list/MultilineListRenderer',
				'fs/JobTablePager', 'fs/MultilineQueryParamExtractor',
				'fs/FacetedSearchSettings', 'fs/StaticResourcesProvider' ],
		function($, DropdownMenuUtils, DropDownMenuKeyboardUtils,
				TableRenderer, MultilineListRenderer, JobTablePager,
				MultilineQueryParamExtractor, FacetedSearchSettings,
				StaticResourcesProvider) {

			function ResultListPanel(searchHandler, isMultiline, queryString) {

				this.dropDownMenuUtils = new DropdownMenuUtils('menu-toggle',
						'dropdown-list-searchresults')
				this.dropdownKeyboardActions = new DropDownMenuKeyboardUtils(
						'dropdown-list-searchresults');

				this.tableRenderer = new TableRenderer('jobs')
				this.multilineRenderer = new MultilineListRenderer('jobList')
				this.pager = new JobTablePager('jobPager', searchHandler)
				this.isMultiline = isMultiline
				this.multilineQueryParamExtractor = new MultilineQueryParamExtractor();

				var self = this

				this.refresh = function(event) {
					this.updateVisibility(event.data.pagingData.totalCount > 0)
					getRenderer().renderResults(event.data.requisitionList)

					this.dropDownMenuUtils
							.addClickOnToggleButtonAndDroplistHandlers()
					this.dropDownMenuUtils.registerCloseMenuHandlers();

					this.dropdownKeyboardActions
							.registerKeyboardNavigationActions();
					if (FacetedSearchSettings.addThisEnabled
							&& typeof (addthis) != "undefined"
							&& addthis != null) {
						addthis.button('.addthis_button_compact');
					}

					this.pager.refresh(event.data.pagingData)
				}

				this.updateMultiline = function(queryString) {
					var multilineParameterValue = self.multilineQueryParamExtractor
							.extractMultilineParameter(queryString);
					if (multilineParameterValue != null
							&& self.isMultiline != multilineParameterValue) {
						self.isMultiline = multilineParameterValue;
						$('#listFormatSwitch')
								.text(
										self.isMultiline ? StaticResourcesProvider.singleLine
												: StaticResourcesProvider.multiLine);
					}
				}

				this.clear = function() {
					this.pager.clear()
				}

				this.getData = function() {
					return this.isMultiline
				}

				this.updateVisibility = function(hasResults) {
					if (hasResults) {
						$('#' + getResultListId()).show()
						$('#jobPager').show()
						$('#noResults').hide()
					} else {
						$('#' + getResultListId()).hide()
						$('#jobPager').hide()
						$('#noResults').show()
					}
				}

				function getRenderer() {
					return self.isMultiline ? self.multilineRenderer
							: self.tableRenderer
				}

				function getResultListId() {
					return self.isMultiline ? 'multilineListContainer'
							: 'jobsTableContainer'
				}

				$('#viewAllJobsLink').click(function() {
					searchHandler.clear()
				})

				$('#listFormatSwitch')
						.click(
								function() {
									$('#' + getResultListId()).hide()
									$('#listFormatSwitch')
											.text(
													self.isMultiline ? StaticResourcesProvider.multiLine
															: StaticResourcesProvider.singleLine)
                                    $('#switchViewLinkAudibleDescription')
                                        .text(
                                        self.isMultiline ? StaticResourcesProvider.multiLineViewLinkAudibleDescription
                                            : StaticResourcesProvider.singleLineViewLinkAudibleDescription)

									self.isMultiline = !self.isMultiline

									searchHandler
											.refresh({
												type : "VIEW_FORMAT",
												pageNo : self.pager.currentDisplayedPageNo
											})
								})

				this.updateMultiline(queryString);
				this.updateVisibility(true);
				this.isMultiline ? $('#jobsTableContainer').hide() : $(
						'#multilineListContainer').hide();
				searchHandler.registerRefreshListener(this);
				searchHandler.registerDataProvider('multilineEnabled', this);
			}
			// end-of-class-definition

			return ResultListPanel;
		});