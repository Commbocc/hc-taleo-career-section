define(
		[ 'jquery', 'fs/URLBuilder', 'fs/FacetedSearchSettings' ],
		function($, URLBuilder, FacetedSearchSettings) {

			function LanguagesContentRenderer() {
				var self = this;

				this.filter = null;
				this.containerId = null;
				this.dropdownId = null;

				var JOBSEARCH_URL = URLBuilder
						.getJobSearchURLWithoutParam();

				this.init = function(filter, containerId) {
					this.filter = filter;
					this.containerId = containerId;
					this.dropdownId = this.filter.id + '-select';
				}

				this.render = function() {
					var content = $("#" + this.containerId);

					var select = $('<select>').attr("id", this.dropdownId);
					select
							.change(function() {
								self
										.filterSelectChangeEvent(this.options[this.options.selectedIndex].id);
							});

					this.fillOptions(select);

					content.append($('<div>')
							.addClass("language-input-wrapper").append(select));
				}

				this.fillOptions = function(select) {

					for ( var i = 0; i < this.filter.values.length; i++) {
						var option = $('<option>').attr({
							title : this.filter.values[i].text,
							id : this.filter.values[i].id
						});
						option.html(this.filter.values[i].text);
						if (FacetedSearchSettings.lang === this.filter.values[i].id) {
							option.prop("selected", true);
						}
						select.append(option);
					}
				}

				this.filterSelectChangeEvent = function(optionId) {
					if (optionId != "") {
						var link = JOBSEARCH_URL + "?lang=" + optionId
								+ URLBuilder.getReqSource();
						window.location.href = link;
					}
				}

				this.clear = function() {
					$('#' + this.containerId).children().remove();
				}
			}
			// end-of-class-definition

			return LanguagesContentRenderer;

		});