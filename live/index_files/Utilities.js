define(
		[ 'jquery' ],
		function($) {

			var Utilities = (function() {
				var instantiated;

				function init() {

					function findFirstWhereValueEqualToExtractedValue(array,
							value, valueExtractor) {
						var result = $.grep(array, function(item, idx) {
							return valueExtractor(item) == value;
						});
						return result.length > 0 ? result[0] : null;
					}

					function sortAsc(array, valueExtractor) {
						var sorted = array.sort(function(a, b) {
							if (valueExtractor(a) < valueExtractor(b)) {
								return -1;
							} else if (valueExtractor(a) > valueExtractor(b)) {
								return 1;
							}
							return 0;
						});
						return sorted;
					}

					function sortDesc(array, valueExtractor) {
						var sorted = array.sort(function(a, b) {
							if (valueExtractor(a) > valueExtractor(b)) {
								return -1;
							} else if (valueExtractor(a) < valueExtractor(b)) {
								return 1;
							}
							return 0;
						});
						return sorted;
					}

					function sortByRule(values, sortRule) {
						var sorted = values.sort(function(a, b) {
							return sortRule.compare(a, b);
						});
						return sorted;
					}

					function isArrowKey(keyCode) {
						return (keyCode >= 37 && keyCode <= 40);
					}

					function addSpaceEvent(elementId) {
						var element = $('#' + elementId);
						element.keypress(function(event) {
							var evt = event || window.event;
							var code = evt.which || evt.keyCode;
							if (code == 32) {
								event.preventDefault();
								element.click();
							}
						});
					}

        function convertHTMLSpecialCharacters(value){
            return convertHTMLDoubleQuotes(value);
        }

        function convertHTMLDoubleQuotes(value){
            return value.replace(/"/g,"&quot;");
        }

					function callWhenWindowLoaded(functionToCall) {
						if (window.loaded) {
							console.log('window already loaded, calling '
									+ functionToCall + ' immediatelly');
							functionToCall();
						} else {
							console.log('window not loaded yet, registering '
									+ functionToCall + ' to be called on load');
							$(window).on('load', functionToCall);
						}

					}

					return {
						findFirstWhereValueEqualToExtractedValue : findFirstWhereValueEqualToExtractedValue,

						sortAsc : sortAsc,
						sortDesc : sortDesc,
						sortByRule : sortByRule,
            convertHTMLSpecialCharacters : convertHTMLSpecialCharacters,

						isArrowKey : isArrowKey,
						addSpaceEvent : addSpaceEvent,
						
						callWhenWindowLoaded:callWhenWindowLoaded
					};
				}

				return {
					getInstance : function() {
						if (!instantiated) {
							instantiated = init();
						}
						return instantiated;
					}
				};
			})();

			return Utilities;
		});