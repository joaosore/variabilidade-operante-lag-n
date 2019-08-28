$.fn.extend({
    clickOrTouch: function(handler) {
        return this.each(function() {
            var event = document.ontouchstart !== null ? 'click':'touchstart';
            $(this).on(event, handler);
        });
    }
});

export function getParameterByName(name) {
	var query = window.location.search.toString();
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(query);
	if (results == null) return "";
	else return decodeURIComponent(results[1].replace(/\+/g, " "));
}