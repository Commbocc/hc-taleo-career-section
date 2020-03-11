define(
		[ 'jquery', 'fs/URLBuilder' ],
		function($, URLBuilder) {

			function FieldPanel(divId, searchHandler) {
				this.divId = divId;
				this.parser = null;
				this.invalidOLFValues = [];
				
				var self = this;

				this.callSearch = function() {
					if (self.advancedSearchPanel.isVisible) {
						return;
					}
					self.panelData = self.gatherPanelData();
					self.searchHandler.refresh({
						type : "CRITERIA"
					});
				}

				this.refresh = function(event) {
					if (event.type != "CRITERIA") {
						this.applyPanelData();
					}
				}

				this.setSearchHandler = function(_searchHandler) {
					this.searchHandler = _searchHandler;
					$('#' + this.divId).find('#search').click(function() {
						if (self.advancedSearchPanel.isVisible) {
							self.advancedSearchPanel.callSearch();
						} else {
							self.callSearch();
						}
					});

					var autosuggestOptions = {
						afterselect : this.callSearch
					}
					$("#" + divId).find('.criteriaFieldInput').each(function() {
						var suggestId = $(this).attr("suggestid");
						if ($(this).attr("isautosuggest") == "true") {
							if ($(this).attr("isolf") == "true") {
								$(this).autosuggestOLF(autosuggestOptions)
							} else if ($(this).attr("isphrase") == "true") {
								$(this).autosuggestPhrase(autosuggestOptions);
							} else {
								$(this).autosuggestText(autosuggestOptions);
							}
						}

					});

					$('#' + divId).find('#clearButton').click(function() {
						self.searchHandler.clear();
					});

					this.searchHandler.registerDataProvider('fieldData', this);
					this.searchHandler.registerRefreshListener(this);
				}

				this.getData = function() {
					return this.panelData.fieldData;
				}

				this.getFieldValue = function(id) {
					return {
						id : this.panelData.fieldData.fields[id],
						label : this.panelData.inputValues[id]
					};
				}

				this.isValid = function() {
					return !$(":data('criteria-autosuggestOLF')").is(function(input) {
						return !$(this).autosuggestOLF("valid")
					})
				}

				this.gatherPanelData = function() {

					var fieldData = new Object();
					fieldData.fields = new Object();
					fieldData.valid = this.isValid();

					var inputValues = new Object();

					$("#" + divId).find('.criteriaFieldInput').each(
							function() {
								if ($("#" + this.id).attr("isolf") == "true") {
									fieldData.fields[this.id] = $(
											"#" + this.id + "-olfid").val();
									inputValues[this.id] = this.value;
								} else {
									fieldData.fields[this.id] = this.value;
								}
							});

					return {
						fieldData : fieldData,
						inputValues : inputValues
					};
				}

				this.applyPanelData = function() {
					$("#" + divId)
							.find('.criteriaFieldInput')
							.each(
									function() {
										if ($("#" + this.id).attr("isolf") == "true") {
											$("#" + this.id + "-olfid")
													.val(
															self.panelData.fieldData.fields[this.id]);
											this.value = self.panelData.inputValues[this.id];
										} else {
											this.value = self.panelData.fieldData.fields[this.id];
										}
									});
				}

				this.clear = function() {
					$("#" + divId).find('.criteriaFieldInput').each(function() {
						self.panelData.fieldData.fields[this.id] = "";
						self.panelData.inputValues[this.id] = "";
					});
					self.panelData.fieldData.valid = true;
				}

				this.clearPanel = function() {
					this.clear();
					this.applyPanelData();
				}

				function getSearchIdResource() {
					return 'search';
				}

				// Array.indexOf dosen't work under IE7 standards
				function indexOfArray(array, obj, start) {
					for ( var i = (start || 0); i < array.length; i++) {
						if (array[i] == obj) {
							return i;
						}
					}
					return -1;
				}

				this.updateCriteriaInputs = function() {
					var fields = this.panelData.fieldData.fields;
					var labels = this.panelData.inputValues;
					for ( var key in fields) {
						var textInput = $('#' + divId).find(
								'.criteriaFieldInput#' + key);
						if ($(textInput).attr('isolf') == 'true') {
							textInput.val(labels[key]);
							textInput.next().val(fields[key]);
						} else {
							textInput.val(fields[key]);
							textInput.next().val('');
						}
					}
				}

				this.updatePanelData = function() {
					this.panelData = this.gatherPanelData();
				}

				this.setUrls = function() {
					$('#' + divId).find('#advancedSearch-link').attr('href',
							URLBuilder.getAdvancedSearch());
				}
				
				this.setAdvancedSearchPanel = function(_advancedSearchPanel) {
					this.advancedSearchPanel = _advancedSearchPanel;
				}
				
				this.setSearchHandler(searchHandler);
				this.setUrls();
				this.panelData = this.gatherPanelData();
			}
			// end-of-class-definition

			return FieldPanel;

		});