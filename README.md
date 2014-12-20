Ampersand.Sync Single Requests
=============================================

Backbone Single Requests adapted for Ampersand.

## Credits

Original code by @homeslicesolutions 

https://github.com/homeslicesolutions/backbone-single-requests

## Description

This module adds an option for AJAX requests to only fetch, save, destroy, etc. one at a time aborting the previously pending requests

I ran into this issue a few times after flipping between pages in my application and I just wanted a more elegant solution to abort the last pending requests and let the app focus on the current request.  Single thread = one request per context.

This works with both Models and Collections.

### How to use

```
model.singleRequests = true;
```

OR

```
model.fetch({ abortRequests: true });
```

That's it. From there, everytime you call any "sync" call (fetch, save, destroy, etc.), the pending requests will abort.  

NOTE: With this flag set to "true", a AJAX abort will not fire "error" event as it usually does. There is a new event to listen to which is "abort" to deal with aborted calls.

Example:

```
var Beer = Model.extend({
  url: '/api/beer',
  singleRequests: true
});

var beer = new Beer();

beer.on('abort', function(){ console.log('call aborted') });
beer.on('sync',  function(){ console.log('call completed') });

for (var i = 0; i < 99; i++) {
  beer.fetch();
}
```

// Will result: Console will log 98 'call aborted', then 1 'call completed', assuming '/api/beer' takes some time and truly async.

#### singleRequests
##### model.singleRequests = true;
Just set your model or collection with this setting and all the "sync" calls will run one at a time.  Note that this includes fetching and saving.  If you save while the system is still fetching, the fetch will cancel.

#### abortRequests
##### model.fetch({ abortRequests: true }) or model.save('', { abortRequests: true });
Instead of setting it globally in the model, you can add it as a fetch, save, destroy, etc. option.  Again, by setting this all the previous request will cancel.  So if you're fetching, and you execute `model.save('', { abortRequests: true });`, then the fetch will abort.

#### abort
##### model.on('abort')
With the singleRequests on, the model will fire "abort" instead of "error" since it's intended.  The signature of "abort" trigger is identical to the "error" trigger.
