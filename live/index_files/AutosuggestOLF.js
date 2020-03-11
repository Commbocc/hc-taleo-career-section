define(
		[ 'jquery', 'fs/Utilities', 'fs/StaticResourcesProvider','jquery-ui' ],
		function($, Utilities, StaticResourcesProvider) {

			function create() {
				$
						.widget(
								"criteria.autosuggestOLF",
								$.criteria.autosuggest,
								{

									options : {
										serviceURL : "/careersection/rest/suggestions/olf"
									},

									processing : false,

									postponedSelect : false,

									oldValue : null,

									lastSelection : null,

									id : function(value) {

										var self = this;
										var idElement = self.element
												.siblings("#"
														+ self.element
																.attr("id")
														+ "-olfid")

										if (value == null) {
											return idElement.val()
										}
										idElement.val(value)
									},

									valid : function() {
										return (!this.element.val())
												|| this.id()
									},

									_create : function() {
										var self = this

										this.element
												.on(
														"autosuggestolfenter",
														function(event, data) {
															self.close(event)
															self
																	._trySelectCurrent(data.value)
														})

										this.element
												.on(
														"autosuggestolftyped",
														function(event, data) {
															if (this.oldValue != data.value) {
																self
																		._textValueChanged(data.value)
																this.oldValue = data.value

																if (event
																		&& !Utilities
																				.getInstance()
																				.isArrowKey(
																						event.keyCode)) {
																	if (self.lastSelection
																			&& self.lastSelection.value == data.value) {
																		self
																				.search(data.value)
																	}
																}
															}
														})

										this.element
												.on(
														"autosuggestolfsuggested",
														function(event, data) {
															self.processing = false
															self
																	._tryMatch(
																			data.suggestions,
																			data.term)
															self
																	._executePosponedSearch()
														})

										this.element
												.on(
														"autosuggestolfselect",
														function(event, data) {
															self
																	._selected(data.item)
															self
																	._trigger("afterselect")
														})

										return $.criteria.autosuggest.prototype._create
												.call(this)
									},

									_textValueChanged : function(term) {
										this.id("")
										this.postponedSelect = false
										if (term) {
											this.processing = this
													._isLongEnough(term)
										}
									},

									_executePosponedSearch : function() {
										if (this.postponedSelect) {
											this.postponedSelect = false
											this._triggerSelection()
										}
									},

									_triggerSelection : function() {
										var self = this
										this._trigger("select", null, {
											item : {
												id : self.id(),
												value : self.element.val()
											}
										})
									},

									_selected : function(item) {
										if (item) {
											this.id(item.id)
											this.element.val(item.value)

											this.lastSelection = item
										}
										this.processing = false
									},

									_trySelectCurrent : function(term) {
										if (!this.processing) {
											this._triggerSelection()
										} else {
											this.postponedSelect = true
										}
									},

									_tryMatch : function(suggestions, term) {

										if (!term) {
											return null
										}

										var matched = Utilities
												.getInstance()
												.findFirstWhereValueEqualToExtractedValue(
														suggestions,
														term.toLowerCase(),
														function(item) {

															var firstColonIndex = item.value
																	.indexOf(',')
															var valueToMatch = (firstColonIndex == -1) ? item.value
																	: item.value
																			.substr(
																					0,
																					firstColonIndex)
															return valueToMatch
																	.toLowerCase()
														})

										if (matched) {
											this._selected(matched)
										}
									},

									_transformSuggestions : function(data,
											request) {
										if (data.length == 0) {
											return [ this._noMatch ]
										}

										if (this.postponedSelect) {
											return []
										}

										return data
									},

									_noMatch : {
										value : StaticResourcesProvider.noMatchFound,
										id : ""
									}

								});
			}
			// end-of-create-method

			return {
				create : create
			};
		});