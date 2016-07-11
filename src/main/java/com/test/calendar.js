//For Open pop up 
var Standalone = Standalone || {};
Standalone.Brand = Standalone.Brand || {}; 
Standalone.Brand.Calender = Standalone.Brand.Calender || {};

function openGal(dvID, rates, chkInDate, propState, propCity, propName, propUniqueUrl, address1, address2, stateCode, zip, counteryCode, currencyCode) {
	for (var i = 0; i < rates.length; i++) {
		var rate = new Array();
		if (rates[i] != null) {
			var rateAsStr = rates[i].toString();
			rate = rateAsStr.split(".");
			if (rate[1] != undefined) {
				if (rate[1].length < 2) {
					rate[1] = rate[1] + "0";
				}
				rates[i] = rate[0] + "." + rate[1];
			} else {
				rates[i] = rate[0] + ".00";
			}
		}
	}
	loadCalendar();
	var overlay = $(".overlay"), modBox = $(".mainBlkHld"), modCont = $(".calHolder");
	overlay.fadeTo('fast', 0.3, function() {
		modBox.customFadeIn(0);
	});
	$("#currencyCode").html(currencyCode);
	$("#displayName").html(propName);
	if(address2!=""){
		$("#displayCity").html(address1+", "+address2+", "+propCity+", ");
	} else {
		$("#displayCity").html(address1+", "+propCity+", ");
	}
	$("#displayState").html(stateCode +" " + zip + " " + counteryCode);

	propState = propState.replace(/\s/g, "-").replace(/&/g, "").replace(/'/g, "").replace(/\//g, "");
	propCity = propCity.replace(/\s/g, "-").replace(/&/g, "").replace(/'/g, "").replace(/\//g, "");
	propUniqueUrl = propUniqueUrl.replace(/\s/g, "-").replace(/&/g, "").replace(/'/g, "").replace(/\//g, "");

	$('#calState').val(propState);
	$('#calCity').val(propCity);
	$('#calPropertyName').val(propUniqueUrl);

	Standalone.Brand.Calender.setVal(rates, chkInDate, $(".dp-calendar"));
	Standalone.Brand.Calender.setCheckInOut();
	Standalone.Brand.Calender.select();
};

function closeGal(dvID) {
	var $defaultDateFormat = $('#defaultDateFormat');
	if($defaultDateFormat.val()=='dd/mm/yy'){
		$("#checkIn3").val("dd/mm/yy");
		$("#checkOut3").val("dd/mm/yy");
	} else {
		$("#checkIn3").val("mm/dd/yy");
		$("#checkOut3").val("mm/dd/yy");
	}
	$("#noOfAdults").val("1");
	$("#noOfChildren").val("0");
	$("#noOfChildren1").val("0");
	$("#calNoOfRooms").val("1");
	$("#checkIn3").css("color","#AAA");
	$("#checkOut3").css("color","#AAA");
	$(".jCalendar").find("td").removeClass("selected");
	$(".jCalendar tbody tr td").each(function(){
			$(this).find("span").remove();
	});
	
	$(dvID).fadeOut("slow"); 
	var overlay = $(".overlay");
	overlay.fadeOut('fast');

}

//For calendar section
function loadCalendar() {
 
				// create the left hand datePicker and add the relevant event listeners to sync it to the right hand one...
				$date1 = $('<div />')
					.datePicker({inline:true})
					.bind(
						'dpMonthChanged',
						function(event, displayedMonth, displayedYear)
						{
							$date2.dpSetDisplayedMonth(displayedMonth+1, displayedYear);
						}
					)
					.bind(
						'dateSelected',
						function(event, date, $td, status)
						{
							$date2.dpSetSelected(date.asString(), status, false);
						}
					);
				// remove the "forward" navigation from the first date picker
				$('.dp-nav-next', $date1).html('');
				// create the right hand datePicker and add the relevant event listeners to sync it to the left hand one...
				$date2 = $('<div />')
					.datePicker({inline:true})
					.bind(
						'dpMonthChanged',
						function(event, displayedMonth, displayedYear)
						{
							$date1.dpSetDisplayedMonth(displayedMonth-1, displayedYear);
						}
					)
					.bind(
						'dateSelected',
						function(event, date, $td, status)
						{
							$date1.dpSetSelected(date.asString(), status, false);
						}
					);
				// remove the "backward" navigation from the first date picker
				$('.dp-nav-prev', $date2).html('');
				// initialise the date pickers to consecutive months ($date1 defaults to this month so set $date2 to next month)
				var now = new Date();
				$date2.dpSetDisplayedMonth(now.getMonth()+1, now.getFullYear());
				// add the generated combined plugin to the document
				$('#multimonth').html('').append($date1, $date2);
				
				Standalone.Brand.Calender.calanderPicker();
           
			}
			
 Standalone.Brand.Calender = {
	
		 flag:true,
		 presentMonthFlag:true,
		 
setVal : function(rates,chkInDate,component) {
	
	var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
	var offset=["0","0","0","0","0","0","0","0","0","0","0","0"];
	var $i=0;
	var fullmonth = component.parent("div").children().html();
	var month = fullmonth.substring(0,fullmonth.indexOf(" "));
	var chkInDate=new Date(chkInDate);
	var chkInDay=chkInDate.getDate();
	var chkInMnth=chkInDate.getMonth()+1;
	var $isToday=false;
	Standalone.Brand.Calender.flag=true;
	
		$(".jCalendar tbody tr td").each(function(){
			var className = $(this).attr("class");
				if(className.indexOf("other-month")==-1){
					if($(this).html()==chkInDay && month==months[chkInMnth-1]) {
						$isToday=true;
					}
					if(className.indexOf("disabled")!=-1 && $isToday){
						$i++;
					}
					if(Standalone.Brand.Calender.flag) {
						
					if($isToday && $i<rates.length && className.indexOf("disabled")==-1){
						if(!$(this).find("span").hasClass("currency")){
							if($(this).html()==1){
								$j=rates.length-$i;
								var mnthYr=$(this).parent("tr").parent("tbody").parent("table").parent("div").parent("div").children().html();
								var mth = mnthYr.substring(0,mnthYr.indexOf(" "));
								for(var k=0;k<months.length;k++){
									if(mth==months[k]) {
										offset[k]=$j;
										
									}
								}
								
							}
							if(rates[$i]== null || rates[$i] == ""){
								
								if(!$(this).find("span").hasClass("noRoom")){
									$(this).html($(this).html()+"<span class='noRoom'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp</span>");
									$(this).addClass("noRoomBg");
								}
							} else {
								$(this).html($(this).html()+"<span class='currency'>"+rates[$i]+"</span>");
							}
						}
						$i++;
					} else {
					
						if($(this).html().indexOf("check")==-1 && className.indexOf("disabled")==-1 && !$(this).find("span").hasClass("currency") && className.indexOf("noRoomBg")==-1){
							$(this).html($(this).html()+"<span>check<br>&nbsp;&nbsp;&nbsp;&nbsp; rates</span>");
							$(this).addClass("checkRates");
						
						}
					}
					}
					
				}
				
		});
		Standalone.Brand.Calender.flag=false;
		$(".dp-nav-prev-month").click(function() {
			var fullmonth = component.parent("div").children().html();
			var month = fullmonth.substring(0,fullmonth.indexOf(" "));
			if(months[chkInMnth-1]==month) {
				Standalone.Brand.Calender.setVal(rates,chkInDate,$(".dp-calendar"));
			}
			for(var j=0;j<months.length;j++){
				if(offset[j]!=0) {
					if(month==months[j]){
						var offst=offset[j];
						var $i=offst;
						
						$(".jCalendar tbody tr td").each(function(){
							var className = $(this).attr("class");
							if(offst!=0 && className.indexOf("other-month")==-1){
							
								if(rates[30-offst]== null || rates[30-offst] == ""){
									if(!$(this).find("span").hasClass("noRoom")){
										$(this).html($(this).html()+"<span class='noRoom'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp</span>");
										$(this).addClass("noRoomBg");
									}	
								}else if(!$(this).find("span").hasClass("currency")){
								$(this).html($(this).html()+"<span class='currency'>"+rates[30-offst]+"</span>");
								}
								offst--;
								$i--;
							} else if(className.indexOf("other-month")==-1 && !$(this).find("span").hasClass("currency") && className.indexOf("checkRates")==-1 && className.indexOf("noRoomBg")==-1) {
								$(this).html($(this).html()+"<span>check<br>&nbsp;&nbsp;&nbsp;&nbsp; rates</span>")
								$(this).addClass("checkRates");
								
							}
						});
					} else {
						$(".jCalendar tbody tr td").each(function(){
							var className = $(this).attr("class");
							 if(className.indexOf("other-month")==-1 && className.indexOf("disabled")==-1 && className.indexOf("checkRates")==-1 && !$(this).find("span").hasClass("currency") && className.indexOf("noRoomBg")==-1)  {
								$(this).html($(this).html()+"<span>check<br>&nbsp;&nbsp;&nbsp;&nbsp; rates</span>")
								$(this).addClass("checkRates");
								
							}
						});
					}
				}
			}
			
			Standalone.Brand.Calender.select();
		});
		$(".dp-nav-next-month").click(function() {
			var fullmonth = component.parent("div").children().html();
			var month = fullmonth.substring(0,fullmonth.indexOf(" "));
			for(var j=0;j<months.length;j++){
				if(offset[j]!=0) {
					if(month==months[j]){
						var offst=offset[j];
						var $i=offst;
						$(".jCalendar tbody tr td").each(function(){
							var className = $(this).attr("class");
							if(offst!=0 && className.indexOf("other-month")==-1){
								if(rates[30-offst]== null || rates[30-offst] == ""){
									if(!$(this).find("span").hasClass("noRoom")){
										$(this).html($(this).html()+"<span class='noRoom'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp</span>");
										$(this).addClass("noRoomBg");
									}
								}else if(!$(this).find("span").hasClass("currency")){
								$(this).html($(this).html()+"<span class='currency'>"+rates[30-offst]+"</span>");
								}
								offst--;
								$i--;
							} else if(className.indexOf("other-month")==-1 && className.indexOf("checkRates")==-1 && className.indexOf("currency")==-1) {
								$(this).html($(this).html()+"<span>check<br>&nbsp;&nbsp;&nbsp;&nbsp; rates</span>")
								$(this).addClass("checkRates");
								
							}
						});
					} else {
						$(".jCalendar tbody tr td").each(function(){
							var className = $(this).attr("class");
							 if(className.indexOf("other-month")==-1 && className.indexOf("disabled")==-1 && className.indexOf("checkRates")==-1) {
								$(this).html($(this).html()+"<span>check<br>&nbsp;&nbsp;&nbsp;&nbsp; rates</span>")
								$(this).addClass("checkRates");
								
							}
						});
					}
				}
			}
			Standalone.Brand.Calender.select();
		});
		
		
},

setCheckInOut : function() {
	$("#clearselection").click(function() {
		var $defaultDateFormat = $('#defaultDateFormat');
		if($defaultDateFormat.val()=='dd/mm/yy'){
			$("#checkIn3").val("dd/mm/yy");
			$("#checkOut3").val("dd/mm/yy");
		} else {
			$("#checkIn3").val("mm/dd/yy");
			$("#checkOut3").val("mm/dd/yy");
		}
		$("#noOfAdults").val("1");
		$("#noOfChildren").val("0");
		$("#noOfChildren1").val("0");
		$("#calNoOfRooms").val("1");
		$("#checkIn3").css("color","#AAA");
		$("#checkOut3").css("color","#AAA");
		$(".jCalendar").find("td").removeClass("selected");
	});
},

select : function() {
	var $defaultDateFormat = $('#defaultDateFormat');
	var checkInDate=null;
	$(".jCalendar tbody tr td").each(function(){
	var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
		$(this).click(function(){
		if($(this).attr("class").indexOf("disabled") == -1 && $(this).attr("class").indexOf("other-month") == -1 && $(this).attr("class").indexOf("noRoomBg") == -1) {
		
					var k=0;
					var mnthYr=$(this).parent("tr").parent("tbody").parent("table").parent("div").parent("div").children().html();
					var mth = mnthYr.substring(0,mnthYr.indexOf(" "));
					var yrs = mnthYr.substring(mnthYr.indexOf(" ")+1,mnthYr.length);
					var chOutMth=0;
					var chInDate=0;
					var chOutDate=0;
					for(k=0;k<months.length;k++){
						if(months[k]==mth){
							k++;
							break;
						}
					}
					if(!((k/10)>=1)){
						k="0"+k;
					}
					chInDate=$(this).html().substring(0,$(this).html().indexOf("<"));
					if(($(this).html().substring(0,$(this).html().indexOf("<")))<10){
						chInDate="0"+($(this).html().substring(0,$(this).html().indexOf("<")));
					}
					if($defaultDateFormat.val()=='dd/mm/yy'){
						checkInDate=chInDate+"/"+k+"/"+yrs;
					}else {
						checkInDate=k+"/"+chInDate+"/"+yrs;
					}
					$("#checkIn3").val(checkInDate);
					$("#checkIn3").css('color','#000');
					var checkOutDate=new Date(k+"/"+chInDate+"/"+yrs);
					checkOutDate.setDate(checkOutDate.getDate()+1);
					if((checkOutDate.getMonth()+1)<10) {
						chOutMth="0"+(checkOutDate.getMonth()+1);
					} else {
						chOutMth=(checkOutDate.getMonth()+1);
					}
					chOutDate=checkOutDate.getDate();
					if(checkOutDate.getDate()<10){
						chOutDate="0"+(checkOutDate.getDate());
					}
					if($defaultDateFormat.val()=='dd/mm/yy'){
						$("#checkOut3").val(chOutDate+"/"+chOutMth+"/"+checkOutDate.getFullYear());
					}else {
						$("#checkOut3").val(chOutMth+"/"+chOutDate+"/"+checkOutDate.getFullYear());
					}
					$("#checkOut3").css('color','#000');
					}
				});
			
	});
},

calanderPicker : function() {

	var $checkIn = $('#checkIn3'),
	$checkOut = $('#checkOut3'),
	$dayIn = $('.day_In'),
	$dayOut = $('.day_Out'),
	$specificDate = $('.spec_dates'),
	$error_p = $('#err_msg_modify_checkIn_checkOut'),
	oneDay = 1000 * 60 * 60 * 24,
	$serverTime = $('#serverTime'),
	dateObj = null,
	hour = null,
	tommDate = null,
	chkInMin = null,
	chkInMax = null,
	chkOutMin = null,
	chkOutMax = null,
	$minLenStay = $('#minLenStay'),
	$advPrchaseDays = $('#advPrchaseDays'),
	minLenStayValue = null,
	contextPath = null,
	$regularExpYrSlash = $('#regularExpYrSlash'),
	$regularExpNoYrSlash = $('#regularExpNoYrSlash'),
	$regularExpYrHyphen = $('#regularExpYrHyphen'),
	$regularExpNoYrHyphen = $('#regularExpNoYrHyphen'),
	regexWithYrCheckSlash = null,
	regexWithoutYrCheckSlash = null,
	regexWithYrCheckHyphen = null,
	regexWithoutYrCheckHyphen = null,
	$defaultDateFormatVal = null,
	$defaultDateFormatShortVal = null,
	$defaultDateFormatHyphenVal = null,
	$defaultDateFormatShortHyphenVal = null,
	$defaultDateFormat = $('#defaultDateFormat'),
	$defaultDateFormatShort = $('#defaultDateFormatShort'),
	$defaultDateFormatHyphen = $('#defaultDateFormatHyphen'),
	$defaultDateFormatShortHyphen = $('#defaultDateFormatShortHyphen'),
	$checkInOutErrorFieldDiv = $('#err_msg_modify_checkIn_checkOut'),
	$checkInOutErrorField = $('#err_span_modify_checkIn_checkOut');
	// Default Date format
	if ($defaultDateFormat.length && $.trim($defaultDateFormat.val()) != '') {
		$defaultDateFormatVal = $defaultDateFormat.val();
	} else {
		$defaultDateFormatVal = 'mm/dd/yy';
	}

	if ($defaultDateFormatShort.length
			&& $.trim($defaultDateFormatShort.val()) != '') {
		$defaultDateFormatShortVal = $defaultDateFormatShort.val();
	} else {
		$defaultDateFormatShortVal = 'mm/dd';
	}

	if ($defaultDateFormatHyphen.length
			&& $.trim($defaultDateFormatHyphen.val()) != '') {
		$defaultDateFormatHyphenVal = $defaultDateFormatHyphen.val();
	} else {
		$defaultDateFormatHyphenVal = 'mm-dd-yy';
	}

	if ($defaultDateFormatShortHyphen.length
			&& $.trim($defaultDateFormatShortHyphen.val()) != '') {
		$defaultDateFormatShortHyphenVal = $defaultDateFormatShortHyphen
				.val();
	} else {
		$defaultDateFormatShortHyphenVal = 'mm-dd';
	}

	// Forming the Regular Expressions
	if ($regularExpYrSlash.length) {
		regexWithYrCheckSlash = new RegExp($regularExpYrSlash.val());
	} else {
		regexWithYrCheckSlash = new RegExp(
				'^([1-9]|(0[1-9]|1[012]))([/])(([1-9])|(0[1-9]|[12][0-9]|3[01]))([/])((20[0-9][0-9]))$');
	}

	if ($regularExpNoYrSlash.length) {
		regexWithoutYrCheckSlash = new RegExp($regularExpNoYrSlash.val());
	} else {
		regexWithoutYrCheckSlash = new RegExp(
				'^([1-9]|(0[1-9]|1[012]))([/])(([1-9])|(0[1-9]|[12][0-9]|3[01]))$');
	}

	if ($regularExpYrHyphen.length) {
		regexWithYrCheckHyphen = new RegExp($regularExpYrHyphen.val());
	} else {
		regexWithYrCheckHyphen = new RegExp(
				'^([1-9]|(0[1-9]|1[012]))([-])(([1-9])|(0[1-9]|[12][0-9]|3[01]))([-])((20[0-9][0-9]))$');
	}

	if ($regularExpNoYrHyphen.length) {
		regexWithoutYrCheckHyphen = new RegExp($regularExpNoYrHyphen.val());
	} else {
		regexWithoutYrCheckHyphen = new RegExp(
				'^([1-9]|(0[1-9]|1[012]))([-])(([1-9])|(0[1-9]|[12][0-9]|3[01]))$');
	}

	// Setting the default value
	if ($checkIn.length && $.trim($checkIn.val()) == '') {
		$checkIn.val($defaultDateFormatVal);
	}

	if ($checkOut.length && $.trim($checkOut.val()) == '') {
		$checkOut.val($defaultDateFormatVal);
	}

	// Setting the Date Object value and Hour value
	if ($serverTime != null) {
		dateObj = new Date(parseInt($serverTime.val()));
		hour = dateObj.getHours();
		tommDate = new Date(parseInt($serverTime.val()));
		tommDate.setDate(tommDate.getDate() + 1);
		tommDate.setHours(00);
		tommDate.setMinutes(00);
		tommDate.setSeconds(00);
		tommDate.setMilliseconds(00);

		if (hour != null && hour < 6) {
			// If before 6AM, then the Check In date will show yesterday's
			// date and Check Out Date will be today's date
			chkInMin = new Date(parseInt($serverTime.val()));
			chkInMin.setDate(chkInMin.getDate() - 1);
			chkOutMin = new Date(parseInt($serverTime.val()));

			chkInMax = new Date(parseInt($serverTime.val()));
			chkInMax.setDate(chkInMax.getDate() - 1 + 360);// Change in
															// FSD(13th
															// April 2011)
															// for Max date
															// 360 days
															// instead of 10
															// years.
			// chkInMax.setFullYear(chkInMax.getFullYear() + 10);
			chkOutMax = new Date(parseInt($serverTime.val()));
			chkOutMax.setDate(chkOutMax.getDate() + 360);// Change in
															// FSD(13th
															// April 2011)
															// for Max date
															// 360 days
															// instead of 10
															// years.
			// chkOutMax.setFullYear(chkOutMax.getFullYear() + 10);
		} else {
			// If after 6AM, then the Check In date will show today's date
			// and Check Out Date will be tommrow's date
			chkInMin = new Date(parseInt($serverTime.val()));
			chkOutMin = new Date(parseInt($serverTime.val()));
			chkOutMin.setDate(chkOutMin.getDate() + 1);

			chkInMax = new Date(parseInt($serverTime.val()));
			chkInMax.setDate(chkInMax.getDate() + 360); // Change in
														// FSD(13th April
														// 2011) for Max
														// date 360 days
														// instead of 10
														// years.
			// chkInMax.setFullYear(chkInMax.getFullYear() + 10);
			chkOutMax = new Date(parseInt($serverTime.val()));
			chkOutMax.setDate(chkOutMax.getDate() + 1 + 360);// Change in
																// FSD(13th
																// April
																// 2011) for
																// Max date
																// 360 days
																// instead
																// of 10
																// years.
			// chkOutMax.setFullYear(chkOutMax.getFullYear() + 10);
		}

		chkInMin.setHours(00);
		chkInMin.setMinutes(00);
		chkInMin.setSeconds(00);
		chkInMin.setMilliseconds(00);
		chkOutMin.setHours(00);
		chkOutMin.setMinutes(00);
		chkOutMin.setSeconds(00);
		chkOutMin.setMilliseconds(00);
		chkInMax.setHours(00);
		chkInMax.setMinutes(00);
		chkInMax.setSeconds(00);
		chkInMax.setMilliseconds(00);
		chkOutMax.setHours(00);
		chkOutMax.setMinutes(00);
		chkOutMax.setSeconds(00);
		chkOutMax.setMilliseconds(00);
	}

	// Setting the Minimum Length of Stay
	if ($minLenStay.length == 0 || $minLenStay.val() == '') {
		minLenStayValue = parseInt(1);
	} else {
		minLenStayValue = parseInt($minLenStay.val());
	}

	// Setting the Advance Purchase of Days
	if ($advPrchaseDays.length != 0 && $.trim($advPrchaseDays.val()) != '') {
		chkInMax.setFullYear(chkInMax.getFullYear() - 10);
		chkInMax.setDate(chkInMax.getDate()
				+ parseInt($advPrchaseDays.val()));
	}

	// setting the css, if date is present
	if ($checkIn.val() != $defaultDateFormatVal) {
		$checkIn.css('color', '#000');
	} else {
		$checkIn.css('color', '#999');
	}

	if ($checkOut.val() != $defaultDateFormatVal) {
		$checkOut.css('color', '#000');
	} else {
		$checkOut.css('color', '#999');
	}

	// fetching the context path
	if ($('#contextPath').length) {
		contextPath = $('#contextPath').val();
	}

	$checkIn
			.datepicker({
				showOn : 'button',
				buttonImage : contextPath
						+ '/common/images/global/datepicker/calendarIcon.jpg',
				buttonImageOnly : false,
				buttonText : 'Check In',
				showAnim : 'fadeIn',
				minDate : chkInMin,
				maxDate : chkInMax,
				dateFormat : $defaultDateFormatVal,
				constrainInput : false,
				beforeShow : function(input) {
					$checkIn.unbind('blur', checkInBlur);

					// If any javascript validation message is displayed
					// then clearing the message.
					// $($error_p).html('');
				},
				onSelect : function(dateStr) {
					$checkOut.css('color', '#000');

					// Variables
					var min = $(this).datepicker('getDate'), // Get
																// selected
																// date
					outDate = null, // Get date in string
					exceptionFlag = false;

					// Forming the Date object
					outDate = $.datepicker.parseDate($defaultDateFormatVal,
							dateStr);

					// Setting the date value to the object array.
					$checkIn.each(function() {
						$(this).val(dateStr);
					});

					// default assign the Check Out Date to (Check In Date +
					// minLenStayValue)
					outDate.setDate(outDate.getDate() + minLenStayValue); // Add
																			// minimum
																			// stay
					$checkOut.datepicker('option', 'minDate', outDate); // set
																		// the
																		// minimum
																		// Check
																		// Out
					$checkOut.datepicker('setDate', outDate);// add new
																// date to
																// the input
					chkOutMin = outDate;

					// Calling the method to check the Date Range.
					var checkOutValue = $checkOut.datepicker('getDate'), difference = Math
							.floor((checkOutValue.getTime() - min.getTime())
									/ oneDay);
					if (difference > 120) {
						exceptionFlag = true;
						Wyndham.Brand.Booking.dateExcpFlag = true;
						Wyndham.Brand.Booking.errorDisplay(
								$checkInOutErrorFieldDiv,
								$checkInOutErrorField,
								$('#invalidDateRange'));
						$checkIn.addClass('error');
						// $($error_p).html($('#searchSubView\\:invalidDateRange').val());
					}

					if (!exceptionFlag) {
						Wyndham.Brand.Booking.dateExcpFlag = false;
						// Unchecking the 'I dont have specific date'
						// checkbox
						if ($specificDate != null && $specificDate.length) {
							$specificDate.each(function() {
								if ($specificDate.is(':checked')) {
									$specificDate.attr('checked', false);
								}
							});
						}
						Wyndham.Brand.Booking
								.searchNightModifier(difference);
						$checkIn.removeClass('error');
						$checkOut.removeClass('error');
						$checkInOutErrorFieldDiv.hide();
					}
				},
				onClose : function(dateText, inst) {
					$checkIn.bind('blur', checkInBlur);
				}
			});

	$checkOut.datepicker({
		showOn : 'button',
		buttonImage : contextPath
				+ '/common/images/global/datepicker/calendarIcon.jpg',
		buttonImageOnly : false,
		buttonText : 'Check Out',
		showAnim : 'fadeIn',
		minDate : chkOutMin,
		maxDate : chkOutMax,
		dateFormat : $defaultDateFormatVal,
		constrainInput : false,
		beforeShow : function(input) {
			$checkOut.unbind('blur');

			// If any javascript validation message is displayed then
			// clearing the message.
			// $($error_p).html('');
		},
		onSelect : function(dateStr) {
			$checkIn.css('color', '#000');

			// Variables
			var max = $(this).datepicker('getDate'), // Get selected date
			outDate = null, // Get date in string
			checkInValue = null, exceptionFlag = false;

			if ($checkIn.val() == $defaultDateFormatVal) {
				checkInValue = $defaultDateFormatVal;
			} else {
				checkInValue = $checkIn.datepicker('getDate');
			}

			// Forming the Date object
			outDate = $.datepicker
					.parseDate($defaultDateFormatVal, dateStr);

			// Setting the date value to the object array.
			$checkOut.each(function() {
				$(this).val(dateStr);
			});

			// default assign the Check In Date to (Check In Date - 1)
			outDate.setDate(outDate.getDate() - 1); // Subtract one day

			if (checkInValue == null
					|| checkInValue == $defaultDateFormatVal) {
				// Only set the value when Check Out field is null(i.e. the
				// first time);
				$checkIn.datepicker('setDate', outDate);// add new date to
														// the 'Check In'
														// field field.
			} else {
				// Check Out date has to be greater than Check In Date.
				var checkInOutDiff = Math
						.floor((max.getTime() - checkInValue.getTime())
								/ oneDay);
				if (checkInOutDiff < 0) {
					Wyndham.Brand.Booking.errorDisplay(
							$checkInOutErrorFieldDiv,
							$checkInOutErrorField,
							$('#prevOutCheckInFormatErr'));
					$checkOut.addClass('error');
					// $($error_p).html($('#searchSubView\\:prevOutCheckInFormatErr').val());
					$checkOut.datepicker('setDate', null);
					exceptionFlag = true;
					Wyndham.Brand.Booking.dateExcpFlag = true;
				}
			}

			if (!exceptionFlag) {
				// Calling the method to check the Date Range.
				checkInValue = $checkIn.datepicker('getDate');
				var difference = Math.floor((max.getTime() - checkInValue
						.getTime())
						/ oneDay);
				if (difference > 120) {
					Wyndham.Brand.Booking.errorDisplay(
							$checkInOutErrorFieldDiv,
							$checkInOutErrorField, $('#invalidDateRange'));
					$checkOut.addClass('error');
					// $($error_p).html($('#searchSubView\\:invalidDateRange').val());
					$checkOut.datepicker('setDate', null);
					exceptionFlag = true;
					Wyndham.Brand.Booking.dateExcpFlag = true;
				}
				if (!exceptionFlag) {
					Wyndham.Brand.Booking.dateExcpFlag = false;
					// Unchecking the 'I dont have specific date' checkbox
					if ($specificDate != null && $specificDate.length) {
						$specificDate.each(function() {
							if ($specificDate.is(':checked')) {
								$specificDate.attr('checked', false);
							}
						});
					}
					Wyndham.Brand.Booking.searchNightModifier(difference);
					$checkIn.removeClass('error');
					$checkOut.removeClass('error');
					$checkInOutErrorFieldDiv.hide();
				}
			}
		},
		onClose : function(dateText, inst) {
			$checkOut.bind('blur', checkOutBlur);
		}
	});

	// Validation to perform on blur
	var checkInBlur = function() {
		if ($.trim($(this).val()).length > 0) {

			// Decelaring the variables.
			var $input = $(this), manualCheckInDt = null, excpFlg = false, inputLength = $input
					.val().length, $checkOutValue = null, regExFlag = false, dateFormatType = null, tempVal = $
					.trim($input.val());

			// Comparing the input against the regular expression's
			if (regexWithoutYrCheckSlash.test(tempVal)) {
				dateFormatType = $defaultDateFormatShortVal;
				regExFlag = true;
			} else if (regexWithYrCheckSlash.test(tempVal)) {
				dateFormatType = $defaultDateFormatVal;
				regExFlag = true;
			} else if (regexWithoutYrCheckHyphen.test(tempVal)) {
				dateFormatType = $defaultDateFormatShortHyphenVal;
				regExFlag = true;
			} else if (regexWithYrCheckHyphen.test(tempVal)) {
				dateFormatType = $defaultDateFormatHyphenVal;
				regExFlag = true;
			}

			// If the input matches against any regular expressions, then
			// proceed for further operations.
			if (regExFlag) {
				try {
					// Checking whether the date format is 'mm/dd' or
					// 'mm/dd/yy'
					if (inputLength == 5) {
						manualCheckInDt = $.datepicker.parseDate(
								dateFormatType, tempVal);

						// if date entered in 'mm/dd' is less than server
						// date then year gets incremented by 1.
						if (manualCheckInDt.getTime() < dateObj.getTime()) {
							manualCheckInDt.setFullYear(manualCheckInDt
									.getFullYear() + 1);
						}
					} else {
						manualCheckInDt = $.datepicker.parseDate(
								dateFormatType, tempVal);
					}

					// Setting the Date Object
					$checkIn.datepicker('setDate', manualCheckInDt);

					// if entered date is less than the minimum check in
					// date then exception message will be shown.
					if (manualCheckInDt.getTime() < chkInMin.getTime()) {
						Wyndham.Brand.Booking.errorDisplay(
								$checkInOutErrorFieldDiv,
								$checkInOutErrorField,
								$('#checkInEarlierThenServerDate'));
						$input.addClass('error');

						// $($error_p).html($('#searchSubView\\:checkInEarlierThenServerDate').val());
						excpFlg = true;
						Wyndham.Brand.Booking.dateExcpFlag = true;
						$checkIn.datepicker('setDate', null);
					}

					// if entered date is greater than the maximum check in
					// date then exception message will be shown.
					if (!excpFlg
							&& manualCheckInDt.getTime() > chkInMax
									.getTime()) {
						Wyndham.Brand.Booking.errorDisplay(
								$checkInOutErrorFieldDiv,
								$checkInOutErrorField,
								$('#checkInMaxFormatErr'));
						$input.addClass('error');

						// $($error_p).html($('#searchSubView\\:checkInMaxFormatErr').val());
						excpFlg = true;
						Wyndham.Brand.Booking.dateExcpFlag = true;
						$checkIn.datepicker('setDate', null);
					}

					if (!excpFlg) {
						// setting the out date when Check-out date is
						// empty.
						var outDate = new Date(manualCheckInDt.getTime());
						outDate
								.setDate(outDate.getDate()
										+ minLenStayValue);

						$checkOut.datepicker('option', 'minDate', outDate);
						$checkOut.datepicker('setDate', outDate);
						$checkOut.css('color', '#000');

						chkOutMin = outDate;

						$checkOutValue = $checkOut.datepicker('getDate');
						if ($checkOutValue != null) {

							var difference = Math.floor(($checkOutValue
									.getTime() - manualCheckInDt.getTime())
									/ oneDay);
							if (difference > 120) {
								Wyndham.Brand.Booking.errorDisplay(
										$checkInOutErrorFieldDiv,
										$checkInOutErrorField,
										$('#invalidDateRange'));
								$input.addClass('error');

								excpFlg = true;
								// $($error_p).html($('#searchSubView\\:invalidDateRange').val());
								Wyndham.Brand.Booking.dateExcpFlag = true;
								$checkIn.datepicker('setDate', null);
							}

							if (!excpFlg) {
								// Unchecking the 'I dont have specific
								// date' checkbox
								if ($specificDate != null
										&& $specificDate.length) {
									$specificDate.each(function() {
										if ($specificDate.is(':checked')) {
											$specificDate.attr('checked',
													false);
										}
									});
								}
								Wyndham.Brand.Booking
										.searchNightModifier(difference);
								Wyndham.Brand.Booking.dateExcpFlag = false;
								$input.removeClass('error');
								$checkOut.removeClass('error');
								$checkInOutErrorFieldDiv.hide();
							}
						}
					}
				} catch (e) {
					Wyndham.Brand.Booking.dateExcpFlag = true;
					Wyndham.Brand.Booking.errorDisplay(
							$checkInOutErrorFieldDiv,
							$checkInOutErrorField, $('#checkInFormatErr'));
					$input.addClass('error');

					// $($error_p).html($('#searchSubView\\:checkInFormatErr').val());
					$checkIn.datepicker('setDate', null);
				}
			} else {
				Wyndham.Brand.Booking.dateExcpFlag = true;
				Wyndham.Brand.Booking.errorDisplay(
						$checkInOutErrorFieldDiv, $checkInOutErrorField,
						$('#checkInFormatErr'));
				$input.addClass('error');

				// $($error_p).html($('#searchSubView\\:checkInFormatErr').val());
				$checkIn.datepicker('setDate', null);
			}
		} else {
			checkInFieldBlank(this);
		}
	};

	// Validation to perform on blur
	var checkOutBlur = function() {

		if ($.trim($(this).val()).length > 0) {

			// Decelaring the variables.
			var $input = $(this), manualCheckInDt = null, excpFlg = false, regExFlag = false, inputLength = $input
					.val().length, $checkInValue = null, tempVal = $
					.trim($input.val());

			// Comparing the input against the regular expression's
			if (regexWithoutYrCheckSlash.test(tempVal)) {
				dateFormatType = $defaultDateFormatShortVal;
				regExFlag = true;
			} else if (regexWithYrCheckSlash.test(tempVal)) {
				dateFormatType = $defaultDateFormatVal;
				regExFlag = true;
			} else if (regexWithoutYrCheckHyphen.test(tempVal)) {
				dateFormatType = $defaultDateFormatShortHyphenVal;
				regExFlag = true;
			} else if (regexWithYrCheckHyphen.test(tempVal)) {
				dateFormatType = $defaultDateFormatHyphenVal;
				regExFlag = true;
			}

			// If the input matches against any regular expressions, then
			// proceed for further operations.
			if (regExFlag) {
				try {
					if ($checkIn.val() == $defaultDateFormatVal) {
						$checkInValue = $defaultDateFormatVal;
					} else {
						$checkInValue = $checkIn.datepicker('getDate');
					}

					// Checking whether the date format is 'mm/dd' or
					// 'mm/dd/yy'
					if (inputLength == 5) {
						manualCheckInDt = $.datepicker.parseDate(
								dateFormatType, tempVal);

						// if date entered in 'mm/dd' is less than server
						// date then year gets incremented by 1.
						if (manualCheckInDt.getTime() < dateObj.getTime()) {
							manualCheckInDt.setFullYear(manualCheckInDt
									.getFullYear() + 1);
						}
					} else {
						manualCheckInDt = $.datepicker.parseDate(
								dateFormatType, tempVal);
					}

					// Setting the Date Object
					$checkOut.datepicker('setDate', manualCheckInDt);

					// if entered date is less than the (current server date
					// + 1day) then exception message will be shown.
					if (manualCheckInDt.getTime() < tommDate.getTime()) {
						Wyndham.Brand.Booking.errorDisplay(
								$checkInOutErrorFieldDiv,
								$checkInOutErrorField,
								$('#checkOutEarlierThenServerDate'));
						$input.addClass('error');

						// $($error_p).html($('#searchSubView\\:checkOutEarlierThenServerDate').val());
						excpFlg = true;
						Wyndham.Brand.Booking.dateExcpFlag = true;
						$checkOut.datepicker('setDate', null);
					}

					// if entered date is greater than the maximum check in
					// date then exception message will be shown.
					if (!excpFlg
							&& manualCheckInDt.getTime() > chkOutMax
									.getTime()) {
						Wyndham.Brand.Booking.errorDisplay(
								$checkInOutErrorFieldDiv,
								$checkInOutErrorField,
								$('#checkOutMaxFormatErr'));
						$input.addClass('error');

						// $($error_p).html($('#searchSubView\\:checkOutMaxFormatErr').val());
						excpFlg = true;
						Wyndham.Brand.Booking.dateExcpFlag = true;
						$checkOut.datepicker('setDate', null);
					}

					if (!excpFlg) {
						// If the Check In value is null, then assign the
						// Check In Date as (Check Out date -1).
						if ($checkInValue == null
								|| $checkInValue == $defaultDateFormatVal) {

							var outDate = new Date(manualCheckInDt
									.getTime());
							chkOutMin = new Date(manualCheckInDt.getTime());

							outDate.setDate(outDate.getDate()
									- minLenStayValue);
							$checkOut.datepicker('option', 'minDate',
									chkOutMin);
							$checkIn.datepicker('setDate', outDate);

							$checkIn.css('color', '#000');
						}

						// fetching the Check In Date value.
						$checkInValue = $checkIn.datepicker('getDate');

						// Check Out date has to be greater than Check In
						// Date.
						var difference = Math.floor((manualCheckInDt
								.getTime() - $checkInValue.getTime())
								/ oneDay);
						if (difference < 0) {
							Wyndham.Brand.Booking.errorDisplay(
									$checkInOutErrorFieldDiv,
									$checkInOutErrorField,
									$('#prevOutCheckInFormatErr'));
							$input.addClass('error');

							// $($error_p).html($('#searchSubView\\:prevOutCheckInFormatErr').val());
							$checkOut.datepicker('setDate', null);
							excpFlg = true;
							Wyndham.Brand.Booking.dateExcpFlag = true;
							$checkOut.datepicker('setDate', null);
						}

						// Calling the method to check the Date Range.
						if (difference > 120) {
							Wyndham.Brand.Booking.errorDisplay(
									$checkInOutErrorFieldDiv,
									$checkInOutErrorField,
									$('#invalidDateRange'));
							$input.addClass('error');

							// $($error_p).html($('#searchSubView\\:invalidDateRange').val());
							$checkOut.datepicker('setDate', null);
							excpFlg = true;
							Wyndham.Brand.Booking.dateExcpFlag = true;
							$checkOut.datepicker('setDate', null);
						}

						if (!excpFlg) {
							// Unchecking the 'I dont have specific date'
							// checkbox
							if ($specificDate != null
									&& $specificDate.length) {
								$specificDate.each(function() {
									if ($specificDate.is(':checked')) {
										$specificDate
												.attr('checked', false);
									}
								});
							}
							Wyndham.Brand.Booking
									.searchNightModifier(difference);
							Wyndham.Brand.Booking.dateExcpFlag = false;
							$checkIn.removeClass('error');
							$input.removeClass('error');
							$checkInOutErrorFieldDiv.hide();
						}
					}
				} catch (e) {
					Wyndham.Brand.Booking.errorDisplay(
							$checkInOutErrorFieldDiv,
							$checkInOutErrorField, $('#checkOutFormatErr'));
					$input.addClass('error');

					Wyndham.Brand.Booking.dateExcpFlag = true;
					// $($error_p).html($('#searchSubView\\:checkOutFormatErr').val());
					$checkOut.datepicker('setDate', null);
				}
			} else {
				Wyndham.Brand.Booking.errorDisplay(
						$checkInOutErrorFieldDiv, $checkInOutErrorField,
						$('#checkOutFormatErr'));
				$input.addClass('error');

				Wyndham.Brand.Booking.dateExcpFlag = true;
				// $($error_p).html($('#searchSubView\\:checkOutFormatErr').val());
				$checkOut.datepicker('setDate', null);
			}
		} else {
			checkOutFieldBlank(this);
		}
	};

	$checkIn.focus(function() {
		$(this).select();
		if ($(this).val() == $defaultDateFormatVal) {
			$(this).val('');

			// Setting the text color for Check-in and Check-out text's.
			$checkIn.css('color', '#000');
		}
	});

	$checkOut.focus(function() {
		$(this).select();
		if ($(this).val() == $defaultDateFormatVal) {
			$(this).val('');

			// Setting the text color for Check-in and Check-out text's.
			$checkOut.css('color', '#000');
		}
	});

	$checkIn.bind('blur', checkInBlur);
	$checkOut.bind('blur', checkOutBlur);

	// function to check if the date field is blank
	var checkInFieldBlank = function($this) {
		if ($($this).val() == '') {
			$($this).val($defaultDateFormatVal);

			// Setting the text color for Check-in and Check-out text's.
			$checkIn.css('color', '#999');
			$checkIn.removeClass('error');
			hideErrorDiv();
		}

	};
	// function to check if the date field is blank
	var checkOutFieldBlank = function($this) {
		if ($($this).val() == '') {
			$($this).val($defaultDateFormatVal);

			// Setting the text color for Check-in and Check-out text's.
			$checkOut.css('color', '#999');
			$checkOut.removeClass('error');
			hideErrorDiv();
		}

	};
	var hideErrorDiv = function($this) {
		if ($checkIn.val() == $defaultDateFormatVal
				&& $checkOut.val() == $defaultDateFormatVal) {
			Wyndham.Brand.Booking.dateExcpFlag = false;
			$checkInOutErrorFieldDiv.hide();
		}

	};
}
};