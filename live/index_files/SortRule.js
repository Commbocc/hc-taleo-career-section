define(function() {

	function SortRule(compareFunction, whenEqualRule) {
		this.compare = function(a, b) {
			var result = compareFunction(a, b);
			if (result == 0 && whenEqualRule) {
				result = whenEqualRule.compare(a, b);
			}
			return result;
		}
	}
	// end-of-class-definition

	return SortRule;

});