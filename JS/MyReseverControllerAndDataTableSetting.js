app.controller('MyReseverController', ['$scope', "$rootScope", "$translate", "$compile", "$http", "$timeout", "$state",
	"$interval", "$filter", "ControllerConfig", "datecalculation", "jq.datables",
	function($scope, $rootScope, $translate, $compile, $http, $timeout, $state, $interval, $filter, ControllerConfig,
		datecalculation, jqdatables) {
		var PortalRoot = window.localStorage.getItem("H3.PortalRoot");

		$scope.goBack = function() {
			$state.go("app.MettingRoomResever");
		}

		$.extend(true, $.fn.dataTable.defaults, {
			bAutoWidth: false,
			pageLength: 10,
			searchDelay: 800,
			language: {
				"sProcessing": "处理中...",
				"sLengthMenu": "显示 _MENU_ 项结果",
				"sZeroRecords": "没有匹配结果",
				"sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
				"sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
				"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
				"sInfoPostFix": "",
				"sSearch": "搜索:",
				"sUrl": "",
				"sEmptyTable": "表中数据为空",
				"sLoadingRecords": "载入中...",
				"sInfoThousands": ",",
				"oPaginate": {
					"sFirst": "首页",
					"sPrevious": "上页",
					"sNext": "下页",
					"sLast": "末页"
				},
				"oAria": {
					"sSortAscending": ": 以升序排列此列",
					"sSortDescending": ": 以降序排列此列"
				},
			},
		});

		$.fn.dataTableExt.oSort['chinese-sort-desc'] = function(s1, s2) {
			return s2.localeCompare(s1);
		};

		$.fn.dataTableExt.oSort['chinese-sort-asc'] = function(s1, s2) {
			return s1.localeCompare(s2);
		};

		$(function() {
			$("[data-plugin='table']").each(function() {
				var $this = $(this);
				var columns = [];
				$this.find("th").each(function() {
					var $th = $(this);
					var unsortable = !$th.is("[data-unsortable]");
					var name = $th.attr("data-name");
					var chinsesSort = $th.attr("data-chinese");
					var colWidth = $th.attr("data-width");
					var col = {
						"data": name,
						"bSortable": unsortable,
						"sType": chinsesSort,
						"width": colWidth
					};
					var template = $th.find("[data-template]").html();
					if (template) {
						col.render = (function(template) {
							return function(data, type, row, meta) {
								return $(this).template(template, row);
							}
						})(template)
					}
					columns.push(col)
				});

				$this.DataTable({
					"ajax": {
						"url": $this.attr("data-href"),
						"dataSrc": "Data"
					},
					"order": [],
					"columns": columns,
					"fnDrawCallback": function() {
						let api = this.api();
						api.column(0).nodes().each(function(cell, i) {
							cell.innerHTML = i + 1;
						});
					}
				});
			});
		})

		$(document).on("refresh.table", "[data-plugin='table']", function() {
			var $table = $(this);
			var table = $table.DataTable();
			table.ajax.reload(null, false);
		});
	}
]);
