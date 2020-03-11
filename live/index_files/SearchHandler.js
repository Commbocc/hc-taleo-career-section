define(
		[ 'jquery', 'fs/QueryStringParser', 'fs/URLBuilder',
				'fs/StaticResourcesProvider', 'fs/DateUtils',
				'fs/FacetedSearchSettings', 'fs/CookieStore' ],
		function($, QueryStringParser, URLBuilder, StaticResourcesProvider,
				DateUtils, FacetedSearchSettings, CookieStore) {

			function SearchHandler(queryString) {

				this.callCount = 0;
				this.dataProviders = {};
				this.refreshListeners = [];

				this.registerRefreshListener = function(handler) {
					this.refreshListeners.push(handler);
				};

				this.registerDataProvider = function(name, handler) {
					this.dataProviders[name] = handler;
				};

				this.getRequestPageNo = function() {
					var queryStringParser = new QueryStringParser();

					var queryParams = queryStringParser.parse(queryString);
					if (queryParams.page === undefined) {
						return 1;
					}
					return queryParams.page;
				};

				this.refresh = function(event) {

					var currentInstance = this;
					currentInstance.startCall();

					if (event.type == 'INIT') {
						event.pageNo = this.getRequestPageNo();
					}

					$
							.ajax({
								type : 'POST',
								url : '/careersection/rest/jobboard/searchjobs?lang='
										+ FacetedSearchSettings.lang
										+ '&portal='
										+ FacetedSearchSettings.portalNo
										+ URLBuilder.getReqSource(),
								data : currentInstance.formToJSON(event),
								dataType : 'json',
								headers : {
									'tz' : new DateUtils().getTimeZone(),
                                    'tzname': new DateUtils().getTimeZoneName()
								},
								contentType : 'application/json',
								success : function(data) {

									CookieStore
											.persistQueryCookie(data.queryString);

									if (data.careerSectionUnAvailable) {
										location.reload();
									}

									event.data = data;
									currentInstance.fillData(event);
									currentInstance.finishCall();
								},
								error : function(xhr, textStatus, errorThrown) {
									if (xhr.status != 0 || errorThrown != '') {
										currentInstance.finishCall();
										currentInstance
												.displayUnAvailablePage();
									}
								}
							});
				};


				this.saveSearch = function(name, confirm, callback) {
					var currentInstance = this;
					currentInstance.startCall();

					$.ajax({
						type : 'POST',
						url : '/careersection/rest/savesearch/save?portal='
								+ FacetedSearchSettings.portalNo
								+ URLBuilder.getReqSource(),
						data : JSON.stringify({
							searchData : currentInstance.prepareData(),
							name : name,
							confirmed : confirm
						}),
						dataType : 'json',
						contentType : 'application/json',
						success : function(data) {

							if (data.careerSectionUnAvailable) {
								location.reload();
							}

							currentInstance.finishCall();
							callback.call(null, data);
						},
						error : function(a, b, c) {
							currentInstance.finishCall();
							currentInstance.displayUnAvailablePage();
						}
					});
				};

				this.startCall = function() {
					if (this.callCount++ <= 0) {
						this.showProgress();
					}
				};

				this.finishCall = function() {
					if (--this.callCount <= 0) {
						this.hideProgress();
					}
				};

				this.clear = function() {
					for ( var providerName in this.dataProviders) {
						var provider = this.dataProviders[providerName];
						provider.clear();
					}
					this.refresh({
						type : "CLEAR"
					});
				};

				this.fillData = function(event) {
					for ( var i = 0; i < this.refreshListeners.length; ++i) {
						this.refreshListeners[i].refresh(event);
					}
				};

				// Helper function to serialize all the form fields into a JSON
				// string
				this.formToJSON = function(event) {
					var data = this.prepareData(event);
					if (event.activeFilterId) {
						data.filterSelectionParam.activeFilterId = event.activeFilterId;
					}
					data.pageNo = event.pageNo ? event.pageNo : 1;
					return JSON.stringify(data);
				};

				this.prepareData = function(event) {
					var searchData = {};

					for ( var providerName in this.dataProviders) {
						searchData[providerName] = this.dataProviders[providerName]
								.getData(event);
					}
					return searchData;
				};

				this.showProgress = function() {

					var progress = $('#progressIndicator');
					progress.width(progress.parent().outerWidth());
					progress.height(progress.parent().outerHeight());
					progress.offset(progress.parent().offset());
				};

				this.hideProgress = function() {
					$('#progressIndicator').width(0);
				};

				this.displayUnAvailablePage = function() {
					var url = location.href;
					var tmp = url.split('/');

					tmp[tmp.length - 1] = 'notavailable.ftl';

					window.location.href = tmp.join('/');
				};
			}
			// end-of-class definition

			return SearchHandler;
		});
