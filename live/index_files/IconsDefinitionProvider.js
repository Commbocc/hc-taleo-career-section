define([ 'fs/ResourcesHandler', 'fs/IconDefinition',
		'fs/ApplyButtonDefinition', 'fs/ReferCandidateButtonDefinition',
		'fs/AddToJobCartButtonDefinition', 'fs/AddThisButtonDefinition',
		'fs/FacetedSearchSettings' ], function(ResourcesHandler, IconDefinition,
		ApplyButtonDefinition, ReferCandidateButtonDefinition,
		AddToJobCartButtonDefinition, AddThisButtonDefinition, FacetedSearchSettings) {

	console.log('creating ICONS_DEFINITION');

	function createIconsDefinitions() {
		var hotJobIcon = new IconDefinition('hot-job',
				ResourcesHandler
						.getResource("icons.urgentNeedJob"), function(job,
						isUserLogged, isAddToJobCartAction) {
					if (job.hotJob && FacetedSearchSettings.urgentJobDisplayed) {
						return true;
					}
					return false;
				});
		var addedToJobCart = new IconDefinition('added-to-job-cart',
				ResourcesHandler
						.getResource("icons.addedToJobCartResource"), function(
						job, isUserLogged, isAddToJobCartAction) {
					if (isUserLogged == true && isAddToJobCartAction
							&& job.addedToJobCart) {
						return true;
					}
					return false;
				});
		var draft = new IconDefinition('draft',
				ResourcesHandler
						.getResource("icons.draftSubmission"), function(job,
						isUserLogged, isAddToJobCartAction) {
					if (isUserLogged == true && job.draft) {
						return true;
					}
					return false;
				});
		var alreadyAppliedOn = new IconDefinition('already-applied-on',
				ResourcesHandler
						.getResource("icons.completedSubmission"), function(
						job, isUserLogged, isAddToJobCartAction) {
					if (isUserLogged == true && job.alreadyAppliedOn) {
						return true;
					}
					return false;
				});

		return new Array(hotJobIcon, addedToJobCart, draft, alreadyAppliedOn);
	}

	var iconsDefinitions = createIconsDefinitions();

	return {iconsDefinitions: iconsDefinitions};
});
