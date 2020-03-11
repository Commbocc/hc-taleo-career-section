define(
    [ 'jquery' ],
    function($) {

        function DropdownContentRenderer() {
            var self = this;

            this.filter = null;
            this.containerId = null;
            this.dropdownId = null;

            this.init = function(filter, containerId) {
                this.filter = filter;
                this.containerId = containerId;
                this.dropdownId = this.filter.id + '-select';
            }

            this.render = function() {
                var content = $("#" + this.containerId);
                var header = $("#" + this.filter.id + "-header");

                var select = $('<select>').attr("id", this.dropdownId);
                select
                    .change(function() {
                        self
                            .filterSelectChangeEvent(this.options[this.options.selectedIndex].id);
                    });

                this.fillOptions(select);

                var label = $('<label>');
                label.addClass("hidden-audible");
                label.attr("for", this.dropdownId);
                label.wrapInner(this.filter.name);

                var selectWithLabel = $(select).insertAfter(label);

                content.append($('<div>').addClass("input-wrapper").append(
                    selectWithLabel));

                if (this.filter.expanded === 'false') {
                    content.css("display", "none");
                }
            }

            this.fillOptions = function(select) {
                var emptyOption = $('<option>').attr("id", "");
                select.append(emptyOption);

                for ( var i = 0; i < this.filter.values.length; i++) {
                    var option = $('<option>').attr({
                        title : this.filter.values[i].text,
                        id : this.filter.values[i].id
                    });
                    option.html(this.filter.values[i].text);
                    if (this.filter
                        .isSelectedValue(this.filter.values[i].id)) {
                        option.prop("selected", true);
                    }
                    select.append(option);
                }
            }

            this.filterSelectChangeEvent = function(optionId) {
                if (optionId != "") {
                    this.filter.select.length = 0;
                    this.filter.select.push(optionId);
                } else {
                    this.filter.select.length = 0;
                }

                this.filter.callSearch();
            }

            this.clear = function() {
                $('#' + this.containerId).children().remove();
            }
        }
        // end-of-class-definition

        return DropdownContentRenderer;

    });