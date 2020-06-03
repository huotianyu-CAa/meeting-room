(function() {
	$.fn.template = function(template, json) {
		var temp = template.replace(/\{\{(.*?)\}\}/gm, function($0, $1) {
			with(json) {
				return eval($1);
			}
		});
		return temp;
	}

	$.fn.triggerRefresh = function() {
		var $this = $(this);
		var target = $this.attr("data-trigger-refresh-target");
		$(target).trigger("refresh");
	}
	
	$.fn.getBindData = function() {
		var $bind = this.closest("[data-close]");
		var attr = $bind.attr("data-close");
		if (attr == "") {
			return $bind.data("raw");
		}
		return eval("(" + attr + ")");
	}
})();
