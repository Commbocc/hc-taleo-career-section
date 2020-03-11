define([ 'jquery' ], function($) {
	/*
	 * Renders individual facet as a checkbox
	 */
	function CheckboxItemRenderer() {
		var self = this;

		this.ie7browser = navigator.appVersion.indexOf("MSIE 7.") != -1;

		this.render = function(filter, container, itemId, item) {
			var itemImput = getItemInput(itemId, item, filter);
			var itemView = getItemView(itemId, item);

			container.append(itemImput);
			container.append(itemView);
		}

		function getItemInput(itemId, item, filter) {
			var input = $("<input>").attr("id", itemId);
			input.attr("type", "checkbox");
			input.attr("name", item.id);
			input.attr("title", item.label);
			if (item.selected) {
				input.prop("checked", true);
			}
			input.addClass(self.ie7browser ? "" : "filter-checkbox");

			input.change(function() {
				var itemId = this.name;
				if (this.checked) {
					filter.addSelection(itemId);
				} else {
					filter.removeSelection(itemId);
				}
				filter.callSearch();
			});
			var focusHandler = function() {
				var label = $("label[for=" + itemId + "]");
				label.toggleClass("checkbox-label-focused");
			};
			input.focus(focusHandler);
			input.blur(focusHandler);

			return input;
		}

		function getItemView(itemId, item) {
			var itemView = null;
			if (!self.ie7browser) {
				itemView = getItemViewNotIE7(itemId, item);
			} else {
				itemView = getItemViewIE7(itemId, item);
			}
			return itemView;
		}

		function getItemViewNotIE7(itemId, item) {
			var labelWrapper = document.createElement("div");
			var link = document.createElement("a");

			labelWrapper.className = "label-wrapper";

			var label = document.createElement("label");
			label.setAttribute("for", itemId);
			label.className = "checkbox-label";

			var checkbox = document.createElement("div");
			checkbox.className = "checkboxp checkbox-unchecked";
			checkbox.innerHTML = "&nbsp;";
			if (item.selected) {
				$(checkbox).addClass("checkbox-checked");
			}

			label.appendChild(checkbox);

			var valuesdiv = document.createElement("span");
			valuesdiv.className = "valuesdiv";

			var filterText = document.createElement("span");
			filterText.className = "filter-text";
			filterText.innerHTML = item.label;
			valuesdiv.appendChild(filterText);

			if (item.quantity != null) {
				var filterQuantity = document.createElement("span");
				filterQuantity.className = "filter-quantity";
				filterQuantity.innerHTML = "(" + item.quantity + ")";
				valuesdiv.appendChild(filterQuantity);
			}

			label.appendChild(valuesdiv);
			link.appendChild(label);
			labelWrapper.appendChild(link);
			return labelWrapper;
		}

		function getItemViewIE7(itemId, item) {
			var label = document.createElement("label");
			label.setAttribute("for", itemId);

			var valuesdiv = document.createElement("span");

			var filterText = document.createElement("span");
			filterText.className = "filter-text";
			filterText.innerHTML = item.label;
			valuesdiv.appendChild(filterText);

			if (item.quantity != null) {
				var filterQuantity = document.createElement("span");
				filterQuantity.className = "filter-quantity";
				filterQuantity.innerHTML = "(" + item.quantity + ")";
				valuesdiv.appendChild(filterQuantity);
			}

			label.appendChild(valuesdiv);
			label.appendChild(document.createElement("br"));
			return label;
		}
	}
	// end-of-class-definition

	return CheckboxItemRenderer;

});