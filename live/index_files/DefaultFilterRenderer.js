define(
		[ 'jquery' ],
		function($) {

			function DefaultFilterRenderer(filter) {
				var self = this;
				this.filter = filter;

				this.groupID = "filter-" + this.filter.id + ".filter-group";
				this.headerID = this.filter.id + "-header";
				this.contentID = this.filter.id + "-content";
				this.linkID = this.filter.id + "-link";
				this.expanded = (this.filter.expandedByDefault == 'true');

				this.contentRenderer = null;

				this.setContentRenderer = function(contentRenderer) {
					this.contentRenderer = contentRenderer;
					this.contentRenderer.init(this.filter, this.contentID);
				}

				this.render = function() {
					var container = $('#' + this.groupID);

					renderHeader(container);
					renderContentContainer(container);
					addHeaderClickEvent();

					this.refresh();
				}

				this.refresh = function() {
					var focusedElementId = document.activeElement.id;
					clearContent();

					if (this.filter.values.length > 0) {
						renderContent();
						setActive();
					} else {
						setInactive();
					}

					if (focusedElementId == "") {
						return;
					}
					var elementToFocus = document
							.getElementById(focusedElementId);
					if (elementToFocus != null) {
						elementToFocus.focus();
					}
				}

				function renderContent() {
					if (self.contentRenderer && self.contentRenderer.render) {
						self.contentRenderer.render();
					}
				}

				function clearContent() {
					if (self.contentRenderer && self.contentRenderer.clear) {
						self.contentRenderer.clear();
					}
				}

				function renderHeader(container) {
					var header = document.createElement("div");

					header.id = self.headerID;
					header.className = "filter-header filter-active";

					var arrow = document.createElement("span");
					if (self.expanded) {
						arrow.className = "icon filter-colapse-open";
					} else {
						arrow.className = "icon filter-colapse-close";
					}

					header.appendChild(arrow);

					header.appendChild(createLink());

					container.append(header);
				}

				function createLink() {
					var text = document.createElement("a");
					text.href = "#";
					text.innerHTML = self.filter.name;
					text.id = self.linkID;
					text.setAttribute("role", "button");
					text.setAttribute("aria-expanded", self.expanded);
					return text;
				}

				function setInactive() {
					var header = $('#' + self.headerID);
					if (!header.hasClass('filter-inactive')) {
						$('#' + self.contentID).hide();

						header.removeClass('filter-active').addClass(
								'filter-inactive');
						removeHeaderClickEvent();

                        var link = $('#' + self.linkID);
                        link.attr("aria-disabled", "true");
                        link.attr("aria-expanded", "false");

						var icon = $('#' + self.headerID + " .icon");
						icon
								.removeClass(
										'filter-colapse-open filter-colapse-close filter-colapse-inactive')
								.addClass('filter-colapse-inactive');
					}
				}

				function setActive() {
					var header = $('#' + self.headerID);
					if (!header.hasClass('filter-active')) {

						header.removeClass('filter-inactive').addClass(
								'filter-active');
						addHeaderClickEvent();

                        var link = $('#' + self.linkID);
                        link.attr("aria-disabled", "false");

						var icon = $('#' + self.headerID + " .icon");
						if (self.expanded) {
							$('#' + self.contentID).show();
							icon
									.removeClass(
											'filter-colapse-open filter-colapse-close filter-colapse-inactive')
									.addClass('filter-colapse-open');

                            link.attr("aria-expanded", "true");
						} else {
							$('#' + self.contentID).hide();
							icon
									.removeClass(
											'filter-colapse-open filter-colapse-close filter-colapse-inactive')
									.addClass('filter-colapse-close');

                            link.attr("aria-expanded", "false");
						}
					}
				}

				function setCollapsed() {
					var icon = $('#' + self.headerID + " .icon");
					$('#' + self.contentID)
							.slideToggle(
									500,
									function() {
										icon
												.removeClass(
														'filter-colapse-open filter-colapse-close filter-colapse-inactive')
												.addClass(
														'filter-colapse-close');
										$('#' + self.linkID).attr(
												"aria-expanded", "false");
									});
					self.expanded = false;
				}

				function setExpanded() {
					var icon = $('#' + self.headerID + " .icon");
					$('#' + self.contentID)
							.slideToggle(
									500,
									function() {
										icon
												.removeClass(
														'filter-colapse-open filter-colapse-close filter-colapse-inactive')
												.addClass('filter-colapse-open');
										$('#' + self.linkID).attr(
												"aria-expanded", "true");
									});
					self.expanded = true;
				}

				function addHeaderClickEvent() {
					$('#' + self.headerID).click(
							function() {
								if ($('#' + self.headerID + " .icon").hasClass(
										'filter-colapse-close')) {
									setExpanded();
								} else {
									setCollapsed();
								}

							});
				}

				function removeHeaderClickEvent() {
					$('#' + self.headerID).off('click');
				}

				function renderContentContainer(container) {
					var content = document.createElement("div");

					content.id = self.contentID;
					content.className = "filter-group-content";
					if (!self.expanded) {
						content.style.display = 'none';
					}

					container.append(content);
				}
			}
			// end-of-class-definition

			return DefaultFilterRenderer;

		});