define(
		[ 'jquery', 'fs/advancedsearchcriteria/TextCriteriaField',
				'fs/advancedsearchcriteria/RadioCriteriaField',
				'fs/advancedsearchcriteria/OLFCriteriaField',
				'fs/advancedsearchcriteria/CheckboxCriteriaField',
				'fs/Utilities' ],
		function($, TextCriteriaField, RadioCriteriaField, OLFCriteriaField,
				CheckboxCriteriaField, Utilities) {

			function CriteriaRegistrator(advancedSearchPanel) {

				var textRegisteringStrategy = {
					applies : function(type) {
						return type == "TextCriteriaField";
					},
					register : function(data) {
						advancedSearchPanel
								.registerCriteriaField(new TextCriteriaField(
										data.id, data.fieldId));
					}
				};

				var radioRegisteringStrategy = {
					applies : function(type) {
						return type == "RadioCriteriaField";
					},
					register : function(data) {
						advancedSearchPanel
								.registerCriteriaField(new RadioCriteriaField(
										data.id, data.fieldId));
					}
				};

				var olfRegisteringStrategy = {
					applies : function(type) {
						return type == "OLFCriteriaField";
					},
					register : function(data) {
						var criteriaField = new OLFCriteriaField(data.id,
								data.fieldId, data.suggestId);

						Utilities.getInstance().callWhenWindowLoaded(
								function() {
									criteriaField.init(data.values);
								});

						advancedSearchPanel
								.registerCriteriaField(criteriaField);
					}
				};

				var checkboxRegisteringStrategy = {
					applies : function(type) {
						return type == "CheckboxCriteriaField";
					},
					register : function(data) {
						advancedSearchPanel
								.registerCriteriaField(new CheckboxCriteriaField(
										data.id, data.fieldId));
					}
				};

				var strategies = [ textRegisteringStrategy,
						radioRegisteringStrategy, olfRegisteringStrategy,
						checkboxRegisteringStrategy ];

				function applyStrategy(data) {
					for ( var i = 0; i < strategies.length; i++) {
						strategy = strategies[i];
						if (strategy.applies(data.type)) {
							strategy.register(data);
							return;
						}
					}
					throw "No strategy appllies for type:" + data.type;
				}

				this.register = function(criteriaFieldsToRegisterArray) {
					for ( var i = 0; i < criteriaFieldsToRegisterArray.length; i++) {
						applyStrategy(criteriaFieldsToRegisterArray[i]);
					}
				};

			}
			// end-of-class-definition

			return CriteriaRegistrator;

		});