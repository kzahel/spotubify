//blah
function getapp() {
    return window.app
}

chrome.runtime.getBackgroundPage( function(bg) {
    window.bg = bg
})

chrome.runtime.onMessage.addListener( function(sender, message, sendResponse) {
    console.log('got message',sender,message)
})

chrome.app.window.onClosed.addListener(function(evt) {
    console.log('window closed',evt)
})

chrome.app.runtime.onLaunched.addListener(function(launchData) {
    var iurl = 'index.html'
    var opts = {
        id:'index'
//        alwaysOnTop: true
    }
    chrome.app.window.create(iurl,
                             opts,
                             function(){})

    if (! window.app) {
        loadWebServer()
    }
});

chrome.runtime.onSuspend.addListener( function(evt) {
    var a = getapp()
    window.app_ = window.app
    delete window.app
    if (a) {
        a.runtimeMessage('onSuspend')
    }
    console.log('onSuspend',evt)
})
chrome.runtime.onSuspendCanceled.addListener( function(evt) {
    var a = getapp()
    window.app = window.app_
    delete window.app_
    if (a) {
        a.runtimeMessage('onSuspendCanceled')
    }
    console.log('onSuspendCanceled',evt)
})
chrome.app.runtime.onRestarted.addListener( function(evt) {
    console.log('app onRestarted',evt)
})



function loadWebServer() {

    function FileEntryHandler(request) {
        DirectoryEntryHandler.prototype.constructor.call(this, request)
    }
    _.extend(FileEntryHandler.prototype, 
             DirectoryEntryHandler.prototype, 
             BaseHandler.prototype, {
        get: function() {
            this.setHeader('accept-ranges','bytes')
            this.setHeader('connection','keep-alive')
            this.onEntry(window.bg.launchEntry)
            // handle get request
            // this.write('OK!, ' + this.request.uri)
        }
    })

    chrome.runtime.getPackageDirectoryEntry( function(entry) {
        window.fs = new FileSystem(entry)
    })


    function OAuthCallbackHandler() {
    }
    _.extend(OAuthCallbackHandler.prototype,
             BaseHandler.prototype,
             {
                 get: function() {
                     console.log('oauth callback result',this,this.request)
                     window.last_spotify_oauth_result = this.request
                     this.write('thanks.')
                     // need to get this information back...
                 }
             })


    var handlers = [
//        ['.*', MainHandler]
//        ['.*', FileEntryHandler]
        ['/LAUNCHENTRY.flv', FileEntryHandler],
        ['/oauthcallback', OAuthCallbackHandler],
        ['.*', DirectoryEntryHandler]
    ]

    var app = new chrome.WebApplication({handlers:handlers, host:'127.0.0.1', port:8543})
    app.start()
    window.app = app
}





function reload() { chrome.runtime.reload() }