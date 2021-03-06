if(typeof JSON === 'object' && typeof window.postMessage === 'function') {
    var EventHelper = {
        addListener: function(event, obj, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(event, fn, false);   // modern browsers
            } else {
                obj.attachEvent("on"+event, fn);          // older versions of IE
            }
        }
    };

    var IFrameSizeHandler = (function () {

        var bodySize = 0;

        function postWindowSizeMessage() {
            newBodySize = document.body.clientHeight;
            if (bodySize != newBodySize) {
                var message = { type: 'resize', data: {height: newBodySize}};
                parent.postMessage(JSON.stringify(message), "*");
                bodySize = newBodySize;
            }
        }

        function initialize(){
            EventHelper.addListener('load', window, function(){
                if (!document.addEventListener) {
                    postWindowSizeMessage();
                } else {
                    document.addEventListener("DOMSubtreeModified", postWindowSizeMessage);
                }
            })
        }

        initialize();

        return {
            handleResponse: function (data) {}
        }
    })();

    var IFramesIntegration = (function () {

        var handlers = {};

        function receiveMessage(event) {
            try {
                var data = JSON.parse(event.data);
                if (!data.taleo) {
                    return false;
                }
                var handler = handlers[data.type];
                handler.handleResponse(data.data);
            }
            catch(err){
            }
        }

        function initialize() {
            EventHelper.addListener('message', window, receiveMessage)
        }

        return {
            registerHandler: function (messageType, handler) {
                handlers[messageType] = handler;
            },
            init: function () {
                initialize();
            }
        }

    })();

    IFramesIntegration.init();
    IFramesIntegration.registerHandler('iframeSize', IFrameSizeHandler);
}