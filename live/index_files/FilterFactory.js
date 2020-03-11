define([ 'fs/DefaultFilter', 'fs/DefaultFilterRenderer',
		'fs/DropdownContentRenderer', 'fs/OLFLevelsContentRenderer',
		'fs/CheckboxesContentRenderer', 'fs/DefaultLanguageFilterRenderer',
		'fs/LanguagesContentRenderer' ], function(DefaultFilter,
		DefaultFilterRenderer, DropdownContentRenderer,
		OLFLevelsContentRenderer, CheckboxesContentRenderer,
		DefaultLanguageFilterRenderer, LanguagesContentRenderer) {

	function FilterFactory(searchHandler) {

		this.getFilter = function(asSelect, groupId, name, olf, expanded,
				fieldId) {

			var filter = new DefaultFilter(groupId, name, olf, expanded,
					fieldId, searchHandler);
			var filterRenderer = new DefaultFilterRenderer(filter);

			if (asSelect == "true") {
				filterRenderer
						.setContentRenderer(new DropdownContentRenderer());
			} else if (olf == true) {
				filterRenderer
						.setContentRenderer(new OLFLevelsContentRenderer(searchHandler));
			} else {
				filterRenderer
						.setContentRenderer(new CheckboxesContentRenderer());
			}

			filter.setRenderer(filterRenderer);
			return filter;
		}

		this.getLanguageFilter = function(name, code, fieldId) {
			var filter = new DefaultFilter(code, name, false, true, fieldId, searchHandler);
			var filterRenderer = new DefaultLanguageFilterRenderer(filter);
			filterRenderer.setContentRenderer(new LanguagesContentRenderer());
			filter.setRenderer(filterRenderer);
			return filter;
		}
	}
	// end-of-class-definition

	return FilterFactory;

});