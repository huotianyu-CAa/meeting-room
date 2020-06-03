$(document).on("click", "[data-delete]", function(e) {
	e.stopPropagation();
	e.preventDefault();
	var $this = $(this);
	var data = $this.getBindData();
	var url = $this.attr("data-delete");
	$.confirm({
		title: '提示！',
		content: '请确认是否取消该条记录',
		buttons: {
			ok: {
				text: "确认",
				btnClass: "btn-primary",
				keys: ['enter'],
				action: function() {
					$.ajax({
							url: url,
							type: "get",
							async: true,
							contentType: "application/json",
						})
						.done(function(data) {
							$this.triggerRefresh();
						})
						.fail(function(jqXHR, textStatus, errorThrown) {
							console.log(jqXHR.status);
						});
				}
			},
			cancel: {
				text: "取消",
				btnClass: "btn-default",
				keys: ['esc'],
			}
		}
	});
});
