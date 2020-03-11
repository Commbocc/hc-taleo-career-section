define(
		[ 'fs/ResourcesHandler', 'fs/StaticResourcesProvider',
				'fs/ApplyButtonDefinition',
				'fs/ReferCandidateButtonDefinition',
				'fs/AddToJobCartButtonDefinition', 'fs/AddThisButtonDefinition' ],
		function(ResourcesHandler, StaticResourcesProvider,
				ApplyButtonDefinition, ReferCandidateButtonDefinition,
				AddToJobCartButtonDefinition, AddThisButtonDefinition) {

			return {
				applyButtonDefinition : new ApplyButtonDefinition(
						ResourcesHandler
								.getResource("resultListPanel.applyButton"),
						ResourcesHandler
								.getResource("resultListPanel.finishDraftSubmissionButton"),
						ResourcesHandler
								.getResource("resultListPanel.viewEditSubmissionButton"),
						ResourcesHandler
								.getResource("resultListPanel.reApplyButton"),
						'result-list-button'),

				referCandidateButtonDefinition : new ReferCandidateButtonDefinition(
						ResourcesHandler
								.getResource("resultListPanel.referACandidateButton"),
						'result-list-button'),

				addToJobCartButtonDefinition : new AddToJobCartButtonDefinition(
						ResourcesHandler
								.getResource("resultListPanel.addToJobCartAction"),
						'add-to-jobcart'),

				addThisButtonDefinition : new AddThisButtonDefinition(
						StaticResourcesProvider.shareRes,
						StaticResourcesProvider.commonJobDesc)

			}

		});
