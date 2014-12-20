var _ = require('underscore');
var AmpSync =  require('ampersand-sync');

module.exports = function (method, model, options) {
    // Set Defaults ( if "singleRequests" is set, then follow that, other wise default to "false" )
    _.defaults(options || (options = {}), {
        abortRequests: this.singleRequests !== void 0 ? this.singleRequests : false
    });

    // Register requests to cache
    this._requests = this._requests || [];

    // Cancel previous requests
    if (options.abortRequests) {
        // Abort them all
        _.each(this._requests, function (request) {
            request.abort();
        });

        // Reset Array
        this._requests = [];

        // Abort is not error, so try to catch that
        var error = options.error;
        options.error = function (resp) {
            if (resp.statusText === 'abort') return model.trigger('abort', model, resp, options);
            if (error) error(model, resp, options);
        };
    }

    // Execute
    this._requests.push(AmpSync.apply(this, arguments));

    // Return last XHR
    return this._requests[this._requests.length - 1];
};

