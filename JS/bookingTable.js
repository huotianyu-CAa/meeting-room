$(function() {
	var box_id;
	var StartTD = null;
	var StartIndex = null;
	var EndTD = null;
	var EndIndex = null;
	var Selected = 'Selected';
	var Start_x = null;
	var Start_y = null;
	//点击中表格的小时值
	var hour;
	//点击选中的星期值
	var week;
	//1为这个格子在此次鼠标拖拽过程中被选中（不执行选中方法），0为没选中过
	var td_state = 0;

	var currentTime = new Date();

	var submitJson = {
		Data: []
	};

	var submitJsonObj = {};

	var submitArr = [];

	var meetingRoomList = [];

	var recordList = [];

	//生成时间值数组
	var arr_hour = get_hour_arr();

	function formatDate(date, flag) {
		if (!date) {
			//不传 默认为当前日期
			date = new Date();
		}
		let year = date.getFullYear();
		let mouth = date.getMonth() + 1;
		let day = date.getDate();
		if (flag) {
			mouth = mouth > 9 ? mouth : '0' + mouth;
			day = day > 9 ? day : '0' + day;
			return year + '' + mouth + '' + day;

		} else {
			return year + '-' + mouth + '-' + day;
		}

	}

	console.log(currentTime);
	$('#Date').html(formatDate());

	//按下鼠标左键拖动选中单元格
	function SelectTD(StartIndex, EndIndex, Selected) {
		var MinX = null;
		var MaxX = null;
		var MinY = null;
		var MaxY = null;
		var coordinate = get_coordinate(StartIndex, EndIndex);
		MinX = coordinate[0];
		MaxX = coordinate[1];
		MinY = coordinate[2];
		MaxY = coordinate[3];

		for (var i = MinY; i <= MaxY; i++) {
			for (var j = MinX; j <= MaxX; j++) {
				var SelectTR = $('#' + box_id + ' table tbody tr ').eq(i);
				var td_class = $("td", SelectTR).eq(j).attr('class');
				td_state = $("td", SelectTR).eq(j).attr("td_state");

				//在同一次鼠标按下的过程中，选中过的表格不进行选中或取消操作
				if (!td_state) {
					if (td_class == Selected) {
						if ($("td", SelectTR).eq(j).attr("data-judge") == "noclick") {
							$("td", SelectTR).eq(j).attr("disabled", "disabled");
						} else {
							$("td", SelectTR).eq(j).removeClass(Selected);
						}
					} else {
						//筛选掉标明为星期的表格
						$("td", SelectTR).eq(j).attr("class", Selected);
					}
					$("td", SelectTR).eq(j).attr("td_state", '1');
				}
			}
		}
		//改变二进制值
		get_time_val();
	}


	//获取选中范围的开始与结束的坐标
	function get_coordinate(StartIndex, EndIndex) {
		var MinX = null;
		var MaxX = null;
		var MinY = null;
		var MaxY = null;

		if (StartIndex.x < EndIndex.x) {
			MinX = StartIndex.x;
			MaxX = EndIndex.x;
		} else {
			MinX = EndIndex.x;
			MaxX = StartIndex.x;
		}
		if (StartIndex.y < EndIndex.y) {
			MinY = StartIndex.y;
			MaxY = EndIndex.y;
		} else {
			MinY = EndIndex.y;
			MaxY = StartIndex.y;
		}
		return [MinX, MaxX, MinY, MaxY];
	}

	//改变二进制值
	function get_time_val() {
		var time_type = '';
		$('#' + box_id + ' table tbody').find('td').each(function(k) {
			var Selected_type = $(this).attr('class');
			var week = $(this).attr('week');

			if (Selected_type == Selected && !week) {
				time_type += "1";
			} else if (!week) {
				time_type += "0";
			}
		});
		$('#' + box_id + '_time_num').val(time_type);
	}


	//生成时间值数组
	function get_hour_arr() {
		var arr_hour = [];
		var oDate = new Date("2016/07/01 08:00:00"); //实例一个时间对象；
		var oDate_hour = oDate.getHours();
		var oDate_minute = oDate.getMinutes();
		for (i = 0; i < 22; i++) {
			if (oDate_minute < 10) {
				var oDate_minute = "0" + oDate_minute;
			}
			if (i >= 1) {
				oDate.setMinutes(oDate.getMinutes() + 30);
				oDate_hour = oDate.getHours();
				oDate_minute = oDate.getMinutes();
				if (oDate_minute < 10) {
					var oDate_minute = "0" + oDate_minute;
				}
			}
			arr_hour[i] = oDate_hour + ':' + oDate_minute;
			// alert(oDate_hour + ':' + oDate.getMinutes());
		}
		return arr_hour;
	}

	//更新操作
	function renewal(id) {
		if (id) {
			box_id = id;
		}
		//解绑鼠标移动监听事件
		$('#' + box_id + ' table tbody tr td').unbind("mouseover");
		//初始化表格的在此次选中状态
		$('#' + box_id + ' table tbody tr td').attr("td_state", '');
		//改变二进制值
		get_time_val();
	}

	//二进制数赋值选中表格
	function binary_selected() {
		var default_time_val = $('#' + box_id + ' .default_time_val').val();
		if (default_time_val) {
			for (i = 0; i < 336; i++) {
				var td_selected = default_time_val.charAt(i);
				if (td_selected != 0) {
					$('#' + box_id + ' table tbody tr td').eq(i).attr('class', 'Selected');
					//更新操作，显示文字形日期
					renewal();
				}
			}
		}
	}

	//日期拼接
	function linkDate(srcDate, srcTime) {
		if (srcTime == undefined || srcTime == "") {
			return "";
		}
		var desDateAndTime = srcDate + " " + srcTime;
		return desDateAndTime;
	}


	//格式化日期和时间
	function dateFormat(srcDateAndTime) {
		var arr = srcDateAndTime.split(/-|:|[ ]|[/]/);
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].length == 1) {
				arr[i] = "0" + arr[i];
			}
		}
		var des = "";
		if (arr.length == 6) {
			for (var j = 0; j < arr.length - 1; j++) {
				des += arr[j];
			}
		} else {
			for (var j = 0; j < arr.length; j++) {
				des += arr[j];
			}
		}
		return des;
	}

	//data-bind属性数据拆分
	function splitData(databindString) {
		var arr = [];
		if (!!databindString) {
			arr = databindString.split("_");
		}

		var desData = [];
		desData.push(arr[0]);
		desData.push(arr[1]);
		if (!!arr[1]) {
			var databindDate = arr[1].substring(0, 8);
			var endTime = arr[1].substring(8, 12);
			var endTimeHour = endTime.substring(0, 2);
			var startTimeMin = endTime.substring(2, 4);
		}
		var endTimeMin = parseInt(startTimeMin) + 30;
		if (endTimeMin == 60) {
			endTimeHour = parseInt(endTimeHour) + 1;
			if (endTimeHour < 10) {
				endTimeHour = "0" + endTimeHour;
			}
			endTimeMin = "00";
		}
		var endDate = databindDate + endTimeHour + endTimeMin;
		desData.push(endDate);
		return desData;
	}

	//数据绑定
	function dataLocation(souJObjList) {
		var JObjList = [];
		for (var m = 0; m < souJObjList.length; m++) {
			// var isNewRecord = true;
			// for (var r = 0; r < JObjList.length; r++) {
			// 	if ( souJObjList[m].Short == JObjList[r].Short && souJObjList[m].Reserve_StartTime == JObjList[r].Reserve_EndTime) {
			// 		JObjList[r].Reserve_EndTime = souJObjList[m].Reserve_EndTime;
			// 		isNewRecord = false;
			// 	}
			// 	
			// 	// if (souJObjList[m].Short == souJObjList[r].Short && souJObjList[m].Reserve_EndTime == JObjList[r].Reserve_StartTime) {
			// 	// 	JObjList[r].Reserve_StartTime = souJObjList[m].Reserve_StartTime;
			// 	// 	isNewRecord = false;
			// 	// }
			// }
			// if (isNewRecord) {
			// 	var obj = cloneTry(souJObjList[m]);
			// 	JObjList.push(obj);
			// }
			let len = JObjList.length - 1;

			if (m > 0 && souJObjList[m].Short == JObjList[len].Short && souJObjList[m].Reserve_StartTime == JObjList[len].Reserve_EndTime) {
				JObjList[len].Reserve_EndTime = souJObjList[m].Reserve_EndTime;

			} else {
				var obj = deepClone(souJObjList[m]);
				JObjList.push(obj);
			}
		}
		console.log(JObjList);

		for (var i = 0; i < JObjList.length; i++) {
			startTime = JObjList[i].Reserve_StartTime;
			endTime = JObjList[i].Reserve_EndTime;
			formatStart = dateFormat(startTime);
			formatEnd = dateFormat(endTime);
			jsonDataStart = JObjList[i].Short + "_" + formatStart;
			jsonDataEnd = JObjList[i].Short + "_" + formatEnd;
			let num = $("td").length;
			let isLight = false;
			for (var j = 11; j < num; j++) {
				var JArr = [];

				//判断字符是否为空，并分割
				if (!!$("td").eq(j).attr("data-bind")) {
					var tdShort = $("td").eq(j).attr("data-bind").split("_");
				}
				if (!!jsonDataStart.split("_")) {
					var jsonStartShort = jsonDataStart.split("_");
				}
				if (!!jsonDataEnd.split("_")) {
					var jsonEndShort = jsonDataEnd.split("_");
				}
				if (!!$("td").eq(j + 1).attr("data-bind")) {
					var tdNextShort = $("td").eq(j + 1).attr("data-bind").split("_");
				}

				//根据日期和会议室循环点亮单元格
				if ($("td").eq(j).attr("data-bind") == jsonDataStart && tdShort[0] == jsonStartShort[0]) {
					isLight = true;
				}
				if (isLight) {
					$("td").eq(j).addClass("Selected");
					$("td").eq(j).attr("data-judge", "noclick");
					$("td").eq(j).attr("data-user", JObjList[i].UserName);

				}
				if ($("td").eq(j + 1).attr("data-bind") == jsonDataEnd && tdNextShort[0] == jsonEndShort[0]) {
					isLight = false;
				}
				if (tdNextShort[0] != jsonEndShort[0]) {
					isLight = false;
				}
			}
			var arr = new Array();
			for (var k = 11; k < num; k++) {
				if ($("td").eq(k).attr("data-user") == JObjList[i].UserName) {
					arr.push($("td").eq(k));
				}
			}
			for (var n = 0; n < arr.length; n++) {
				if (n == arr.length - 1) {
					arr[n].after('<td class="Selected " style="width:' + arr.length * 2 + '%;" data-judge="noclick" colspan="' + arr
						.length + '">' + JObjList[i].UserName +
						'</td>');
				}
				arr[n].remove();
			}
		}
	}

	//深度复制
	function deepClone(obj) {
		let _obj = JSON.stringify(obj),
			objClone = JSON.parse(_obj);
		return objClone
	}

	//实例化程序
	function load_time_table(id) {
		//包住table的元素id
		box_id = id;
		var html;
		html =
			'<table cellspacing="0" cellpadding="0" border="0" id="table1" class="plug-timer-grid"  onselectstart="return false" onselect="document.selection.empty()">';
		html += '<thead >';
		html += '<tr>';
		html += '</tr>';
		html += '<tr class="hour">';
		html += '</tr>';
		html += '</thead>';
		html += '<tbody></tbody>';
		html += '</table>';
		html += '<input class="focus" style="opacity: 0;">';
		html += '<div id="' + box_id + '_time_seled"></div>';
		html += '<input type="hidden" id="' + box_id +
			'_time_num" name="time" caption="每日投放时段" switchname="selectTime"  value="">';
		$('#' + box_id).html(html);

		var html_tbody_td = '';
		var html_thead_td = '<th  colspan="3"></th>';
		var date = $("#Date").text();
		//创建表格
		for (var i = 0; i < meetingRoomList.length; i++) {
			var week = i + 1;
			html_tbody_td += '<tr>';
			for (var j = 0; j < 22; j++) {
				var newJ = "";
				if (j == 0) {
					html_tbody_td += '<th colspan="3" week="' + week + '">' + meetingRoomList[i].MettingRoomName + '</th>';
				}
				if (j < 10) {
					newJ = "0" + j;
				} else {
					newJ = j;
				}
				html_tbody_td += '<td colspan="1" data-cell="' + (i + 1) + newJ + '" data-bind="' + meetingRoomList[i].Short +
					"_" +
					dateFormat(linkDate(date, arr_hour[j])) +
					'">' +
					'</td>';
			}
			html_tbody_td += '</tr>';
		}

		//创建表格小时栏目
		for (var i = 8; i <= 18; i++) {
			html_thead_td += '<td colSpan="2" hour="' + i + '">' + i + '</td>';
		}
		$('#' + box_id + ' table thead .hour').html(html_thead_td);
		$('#' + box_id + ' table tbody').html(html_tbody_td);

		//检查是否有赋有二进制值，如有，将选中相应的表格
		binary_selected();
		//数据绑定
		dataLocation(recordList);


		//控制器，控制当前在哪个表格进行操作
		$('.plug-timer-grid').hover(function(e) {
			if (1 != e.which) { //判断是否为左击
				var id = $(this).parent().attr('id');
				box_id = id;
			}
		});

		//监听鼠标按下事件(鼠标按下左键拖动选中处理块)
		$('#' + box_id + ' table tbody tr td').unbind("mousedown").bind("mousedown", function() {
			//记录刚开始点击的元素位置
			Start_x = $(this).index() - 1;
			Start_y = $(this).parent().index();
			StartIndex = {
				x: Start_x,
				y: Start_y
			};

			EndTD = $(this);
			var x = $(this).index() - 1;
			var y = $(this).parent().index();
			EndIndex = {
				x: x,
				y: y
			};
			//改变第一次按下鼠标时候的改变选中状态
			SelectTD(StartIndex, EndIndex, Selected);

			StartTD = $(this);

			StartIndex = {
				x: Start_x,
				y: Start_y
			};

			//监听鼠标移动事件，实现改变后续鼠标拖拽时候的表格选中状态
			$('#' + box_id + ' table tbody tr td').mouseover(function(e) {
				EndTD = $(this);
				var x = $(this).index() - 1;
				var y = $(this).parent().index();
				EndIndex = {
					x: x,
					y: y
				};
				if (1 != e.which) { //判断是否为左击
					$('#' + box_id + ' table tbody tr td').unbind("mouseover");
				}
				//去除停留在td上的光标
				$('#' + box_id + ' .focus').focus();

				SelectTD(StartIndex, EndIndex, Selected);
			});

			//放开鼠标左键时，初始化相关参数和解绑相关监听
			$('html').unbind("mouseup").bind("mouseup", function(obj) {
				renewal();
				//	putObjToArr(obj);
			});

		});
	}

	//将选中的元素放入数组
	function putObjToArr(obj) {
		var submitJsonObj = {};
		var localString = obj.attr("data-bind");
		if (obj.attr("data-judge") == null) {

			submitJsonObj.UserObjectId = "1607a5a9-4cc9-45a6-b32e-c81867cc1a62";
			submitJsonObj.UserName = "曹礼增";
			var arr = splitData(localString);
			submitJsonObj.Reserve_StartTime = arr[1];
			submitJsonObj.Reserve_EndTime = arr[2];
			for (var i = 0; i < meetingRoomList.length; i++) {
				if (meetingRoomList[i].Short == arr[0]) {
					submitJsonObj.Short = meetingRoomList[i].Short;
					submitJsonObj.I_MettingRoom_Objectid = meetingRoomList[i].ObjectId;
				}
			}
			submitJson.Data.push(submitJsonObj);

		} else {
			return;
		}

		for (var i = 0; i < submitJson.Data.length; i++) {
			if (submitJson.Data.length == 0) {
				return;
			} else {
				if (submitJsonObj.Reserve_StartTime == submitJson.Data[i].Reserve_EndTime && submitJsonObj.Short == submitJson.Data[
						i].Short) {
					submitJson.Data[i].Reserve_EndTime = submitJsonObj.Reserve_EndTime;
					submitJson.Data.splice($.inArray(submitJsonObj, submitJson.Data), 1);
				} else if (submitJsonObj.Reserve_EndTime == submitJson.Data[i].Reserve_StartTime && submitJsonObj.Short ==
					submitJson.Data[i].Short) {
					submitJson.Data[i].Reserve_StartTime = submitJsonObj.Reserve_StartTime;
					submitJson.Data.splice($.inArray(submitJsonObj, submitJson.Data), 1);
				}
			}
		}
		console.log(submitJson.Data);
	}
	/*外部调用接口*/

	//解绑鼠标松开监听事件
	function unbundle_mouseover() {
		$('html').unbind("mouseup");
	}

	function initData() {
		//预定记录查询
		$.ajax({
				url: "/MettingRoom/GetAllMettingRoom_reserve" + "?currentTime=" + formatDate(currentTime, '/'),
				type: "post",
				async: false,
				contentType: "application/json"
			})
			.done(function(datas) {
				recordList = datas.Data;
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				$.handleMessage(jqXHR.status)
			})

		//会议室查询
		$.ajax({
				url: "/MettingRoom/GetAllMettingRoom",
				type: "post",
				async: true,
				contentType: "application/josn"
			})
			.done(function(datass) {
				meetingRoomList = datass.Data;
				load_time_table('table_time_selected1');
			})
	}
	$(function() {
		initData();

		//提交事件监听
		$(".submitBtn").click(function() {
			var $this = $(this);

			submitJson = {
				Data: []
			};
			$(".Selected").each(function() {
				if ($(this).attr("data-judge") != "noclick") {
					putObjToArr($(this));
				}
			});
			console.log(submitJson);

			$.ajax({
					url: "/MettingRoom/InsertMettingRoom_reserve",
					type: "post",
					async: false,
					contentType: "application/json",
					data: JSON.stringify(submitJson)
				})
				.done(function(data) {
					window.location.reload();
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR.status);
				});
		});


	});

	//前一天事件监听
	$('#preBtn').on('click', function() {
		let preDate = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
		currentTime = preDate;
		// formatDate(preDate)
		$('#Date').html(formatDate(currentTime));
		initData();
	});

	//后一天事件监听
	$('#nextBtn').on('click', function() {
		let nextDate = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);;
		currentTime = nextDate;
		// formatDate(preDate)
		$('#Date').html(formatDate(currentTime));
		initData();
	});
})
