requirejs.config({
	paths : {
		'jquery' : 'common/jquery.min',
		'jquery.cookie' : 'common/jquery.cookie',
		'jquery-ui' : 'common/jquery-ui.min',
		'jquery.dataTables' : 'common/jquery.dataTables.min',
		'fs' : 'facetedsearch'
	},
	shim : {
		'fs/setFullVersionCookie' : {
			deps : [ 'jquery.cookie' ],
			exports : 'setFullVersionCookie'
		},
		'jquery.cookie' : [ 'jquery' ]
	}
});

require(
		[ 'jquery', 'fs/SearchHandler', 'fs/HeaderPanel', 'fs/SessionManager',
				'fs/list/ResultListPanel', 'fs/FieldPanel', 'fs/PopupManager',
				'fs/FilterPanel', 'fs/FilterTopPanel', 'fs/HelpManager',
				'fs/InfoPanel', 'fs/LanguageFilterPanel', 'fs/SortPanel',
				'fs/SaveSearchPanel', 'fs/AdvancedSearchPanel',
				'fs/advancedsearchcriteria/CriteriaRegistrator',
				'fs/QueryStringBuilder', 'fs/URLBuilder',
				'fs/ResourcesHandler', 'fs/autosuggest/AutosuggestsCreator',
				'fs/Utilities', 'fs/FacetedSearchSettings',
				'fs/setFullVersionCookie' ],
		function($, SearchHandler, HeaderPanel, SessionManager,
				ResultListPanel, FieldPanel, PopupManager, FilterPanel,
				FilterTopPanel, HelpManager, InfoPanel, LanguageFilterPanel,
				SortPanel, SaveSearchPanel, AdvancedSearchPanel,
				CriteriaRegistrator, QueryStringBuilder,
				URLBuilder, ResourcesHandler, AutosuggestsCreator, Utilities,
				FacetedSearchSettings, setFullVersionCookie) {

			function createInfoPanel(searchHandler) {
				console.log('creating InfoPanel');
				new InfoPanel('infoPanelContainer', searchHandler);
			}

			function createResultListPanel(searchHandler, queryString) {
				console.log('creating ResultListPanel');
				new ResultListPanel(searchHandler,
						FacetedSearchSettings.multilineViewSetAsDefault,
						queryString);
			}

			function createLanguageFilterPanel(searchHandler, fieldPanel) {
				console.log('creating LanguageFilterPanel');
				var languageFilterPanel = new LanguageFilterPanel(
						'languagesPanel', searchHandler, fieldPanel);

				languageFilterPanel.init();
				searchHandler.registerRefreshListener(languageFilterPanel);
			}

			function createSaveSearchPanel(searchHandler, queryString) {
				console.log('creating SaveSearchPanel');
				var saveSearchPanel = new SaveSearchPanel('saveSearchPanel',
						'showSaveSearch', FacetedSearchSettings.userSignedIn,
						searchHandler);

				saveSearchPanel.init(queryString);
				saveSearchPanel.setUrls();
				searchHandler.registerRefreshListener(saveSearchPanel);

				$("#saveSearchLengthError").find(".messagetext").html(
						ResourcesHandler.getResource(
								"resultListPanel.saveSearchLengthError",
								saveSearchPanel.MAX_SEARCH_NAME_LENGTH));
				Utilities.getInstance().addSpaceEvent('saveSearchSave');
				Utilities.getInstance().addSpaceEvent('saveSearchCancel');
			}

			function createSortPanel(searchHandler, queryString) {
				console.log('creating SortPanel');
				var sortPanel = new SortPanel(searchHandler,
						FacetedSearchSettings.defaultSortingField,
						FacetedSearchSettings.defaultOrder, queryString);
				sortPanel.setDefaultFieldAndOrder();
			}

			function createFieldPanel(searchHandler) {
				console.log('creating FieldPanel');
				var fieldPanel = new FieldPanel('criteriaFields',searchHandler);
				return fieldPanel;
			}

			function createFilterPanel( fieldPanel, queryString,
					searchHandler, filterTopPanel) {
				console.log('creating FilterPanel');
				var filterPanel = new FilterPanel('filter-panel', searchHandler,
						fieldPanel, filterTopPanel);
				filterPanel.init();
				filterPanel.addQueryParamsToFilters(queryString);
				  				 
				if (FacetedSearchSettings.filterPanelOffLayout) {
					$('#filter-panel').hide();
				}
				
				return filterPanel;
			}

			function setupLinks() {
				$('#refer-a-friend-link').attr(
						'href',
						FacetedSearchSettings.agencyPortal ? URLBuilder
								.getReferCandidateProfileURL() : URLBuilder
								.getReferFriendProfileURL());

				Utilities.getInstance().addSpaceEvent('rssFeedLink');

				$('#addToJobCartErrorOk').click(function() {
					PopupManager.closePopup($('#addToJobCartError'));
				});

				$('#footerPanel-viewStandardCareerSection').click(
						setFullVersionCookie);
			}

			console.log('creating FacetedSearchPage...');

			var queryString = QueryStringBuilder.build();

			console.log('creating SearchHandler');
			var searchHandler = new SearchHandler(queryString);

			console.log('creating HeaderPanel');
			var headerPanel = new HeaderPanel('headerPanelContainer',
					FacetedSearchSettings.userSignedIn,
					FacetedSearchSettings.jobCartItemCount);

			console.log('creating SessionManager');
			var sessionManager = new SessionManager(
					FacetedSearchSettings.warningInterval, "sessionWarning",
					"sessionWarningOK", FacetedSearchSettings.timeoutInterval,
					"sessionTimeout", "sessionTimeoutOK",
					FacetedSearchSettings.sessionCSRFTokenName,
					FacetedSearchSettings.sessionCSRFToken,
					FacetedSearchSettings.userSignedIn);

			console.log('creating FilterTopPanel');
			var filterTopPanel = new FilterTopPanel('filterTopPanel',
					searchHandler);

			console.log('creating HelpManager');
			var helpManager = new HelpManager('helpPanel',
					'jobsTableContainer', 'listTopPanel');


			$(document)
					.ready(
							function() {
								AutosuggestsCreator.create();
								
								// info panel
								createInfoPanel(searchHandler);
								
								// resultListPanel
								createResultListPanel(searchHandler,
										queryString);

								// sort panel
								createSortPanel(searchHandler, queryString);
								
								// fieldPanel
								fieldPanel = createFieldPanel(searchHandler);

								// filterPanel
								filterPanel = createFilterPanel(fieldPanel, queryString,
										searchHandler, filterTopPanel);
								
								console.log('creating AdvancedSearchPanel');
								var advancedSearchPanel = new AdvancedSearchPanel(searchHandler,
										fieldPanel, filterPanel, filterTopPanel);

								fieldPanel.setAdvancedSearchPanel(advancedSearchPanel);
								filterPanel.setAdvancedSearchPanel(advancedSearchPanel);
								
								// languageFilterPanel
								if (FacetedSearchSettings.searchOnMultilingualRequisition) {
									createLanguageFilterPanel(searchHandler,
											fieldPanel);
								}

								// saveSearchPanel
								if (FacetedSearchSettings.saveSearchPanelDisplayed) {
									createSaveSearchPanel(searchHandler,
											queryString);
								}

								headerPanel.init();
								sessionManager.init();
								helpManager.init();
								filterTopPanel.init();

								setupLinks();

								// register criteria
								criteriaRegistrator = new CriteriaRegistrator(
										advancedSearchPanel);
								criteriaRegistrator
										.register(FacetedSearchSettings.criteriaFieldsToRegister);
                                console.log('Executing INIT refresh');
                                searchHandler.refresh({
                                    type : "INIT"
                                })
							});


			$(window).resize(function() {
				if (helpManager.opened) {
					helpManager.positionPanel();
				}
			});

			console.log('...FacetedSearchPage created.');

		});
