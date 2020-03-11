define([ 'fs/autosuggest/Autosuggest', 'fs/autosuggest/AutosuggestOLF',
		'fs/autosuggest/AutosuggestPhrase', 'fs/autosuggest/AutosuggestText' ],
		function(Autosuggest, AutosuggestOLF, AutosuggestPhrase,
				AutosuggestText) {

			function create() {
				console.log("creating autosuggests");
				
				Autosuggest.create();
				AutosuggestOLF.create();
				AutosuggestPhrase.create();
				AutosuggestText.create();
			}
			// end-of-create-method

			return {
				create : create
			};
		});