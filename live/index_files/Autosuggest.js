define([ 'jquery', 'fs/ResourcesHandler', 'fs/FacetedSearchSettings', 'jquery-ui' ], function($, ResourcesHandler, FacetedSearchSettings) {

	function create() {

		$.widget("criteria.autosuggest", $.ui.autocomplete, {

			options : {
				messages : {
					noResults: ResourcesHandler.getResource("accessibility.noMatchFound"),
					results: function( amount ) {
						return amount > 1 ? ResourcesHandler.getResource("accessibility.multipleResultAudible").replace('{0}',amount) : ResourcesHandler.getResource("accessibility.singleResultAudible");
					}
				},
				serviceURL : "",
			minLength : 2,
				suggestId : null
			},

			_create : function() {
				var self = this
				self.options.source = self._source
				self.element.keyup(function(event) {
					if (event.keyCode == 13) {
						self._trigger("enter", event, {
							value : self.element.val()
						})
					} else {
						self._trigger("typed", event, {
							value : self.element.val()
						})
					}
				})
				self.element.on("paste", function(event) {
					self._forceSearch()
				})

				self._accessibilityCreateLiveRegion();
				return $.ui.autocomplete.prototype._create.call(this)
			},

			_forceSearch : function() {
				var self = this
				setTimeout(function() {
					var value = self.element.val()
					self._trigger("typed", null, {
						value : value
					})
					self.search(value)
				}, 100)
			},

			_isValid : function(request) {
				if (request.term != this.element.val()) {
					return false
				}

				return this._isLongEnough(request.term)

			},

			_isLongEnough : function(term) {
				return ($.trim(term).length >= this.options.minLength)
			},

			_suggestId : function() {
				return this.options.suggestId ? this.options.suggestId
						: this.element.attr("suggestid")
			},

			_source : function(request, response) {
				var self = this

				if (!this._isValid(request)) {
					response()
				} else {
					$.ajax({
						url : self.options.serviceURL,
						dataType : "json",
						data : {
							term : request.term,
							suggestId : self._suggestId(),
							careerPortalNo : FacetedSearchSettings.portalNo,
							language : FacetedSearchSettings.lang
						},
						success : function(data) {
							if (self._isValid(request)) {
								self._returnData(data, request, response)
							} else {
								response();
							}
						},
						error : function() {
							response()
						}
					})
				}
			},

			_returnData : function(data, request, response) {
				var self = this;
				self._accessibilityAppendToLiveRegion( data );
				response(this._transformSuggestions(data, request))
				this._trigger("suggested", null, {
					suggestions : data,
					term : request.term
				})
			},

			_transformSuggestions : function(data, request) {
				return data;
			},

			_accessibilityAppendToLiveRegion : function( data ) {
				var self = this;
				var message;
				if ( self.options.disabled ) {
					return;
				}
				if ( data && data.length ) {
					message = self.options.messages.results( data.length );
				} else {
					message = self.options.messages.noResults;
				}
				self.liveRegion.children().hide();
				$($( "<div>" ).text( message )).appendTo( self.liveRegion );
			},

			_accessibilityCreateLiveRegion : function() {
				var self = this;
				self.liveRegion = $( "<div>", {
					role: "status",
					"aria-live": "assertive",
					"aria-relevant": "additions"
				} )
					.appendTo( "body" );
				self.liveRegion.addClass("ui-helper-hidden-accessible" );
			}

		});

		$.widget("criteria.autosuggestSimple", $.criteria.autosuggest, {

			ignoreAll : false,

			_create : function() {
				var self = this
				this.element.on(this.widgetEventPrefix.toLowerCase()
						+ "enter", function(event, data) {
					self.ignoreAll = true
					self._triggerSelect(data.value)
				})

				this.element.on(this.widgetEventPrefix.toLowerCase()
						+ "typed", function(event, data) {
					self.ignoreAll = false
				})

				this.element.on(this.widgetEventPrefix.toLowerCase()
						+ "select", function(event, data) {
					self._selected(data.item)
					self._trigger("afterselect")
				})

				return $.criteria.autosuggest.prototype._create.call(this)
			},

			_selected : function(item) {
				if (item) {
					this.element.val(item.value)
				}
			},

			_triggerSelect : function(value) {
				this._trigger("select", null, {
					item : {
						label : value,
						value : value
					}
				})
			},

			_isValid : function(request) {
				if (this.ignoreAll) {
					return false
				}

				return $.criteria.autosuggest.prototype._isValid.call(this,
						request)
			}
		});

	}
	// end-of-create-method

	return {
		create : create
	};
});