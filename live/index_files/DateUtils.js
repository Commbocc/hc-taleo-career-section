define(function(){

	function DateUtils(){
	
		this.getTimeZone = function () {
			var timeZoneOffset = new Date().getTimezoneOffset(),
				timeZoneGMTString = "GMT" + (timeZoneOffset <= 0 ? "+" : "-"),
				absOffset = Math.abs(timeZoneOffset),
				minutes = absOffset % 60,
				hours = (absOffset - minutes) / 60;
	
			if (hours < 10) {
				hours = "0" + hours;
			}
			if (minutes < 10) {
				minutes = "0" + minutes;
			}
	
			return timeZoneGMTString + hours + ":" + minutes;
		};

		this.getTimeZoneName = function() {
            try {
                var timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
            } catch(err) {
                console.log("ECMAScript Internationalization API is not supported in this browser");
                return "";
            }
            return timeZoneName ? timeZoneName : "";
		};
	
	}
	
	return DateUtils;
});
