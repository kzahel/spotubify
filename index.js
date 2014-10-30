var doing_oauth_flow = false

function do_oauth_flow(callback) {
    if (doing_oauth_flow) { return }
    doing_oauth_flow = true
    document.getElementById('spinner').style.display = 'block'

    var baseurl = "https://accounts.spotify.com/authorize?"
    var stateparam = Math.floor( Math.random() * Math.pow(2,30) ).toString()
    var redirecturl = chrome.identity.getRedirectURL()

    function decodeauthurl(data) {
        document.getElementById('spinner').style.display = 'none'
        var iserr = false
        var params = {}
        if (data.slice(0,redirecturl.length) == redirecturl) {
            // check redirect url matches
            var str = data.slice(redirecturl.length + 1, data.length)
            if (str[0] == '#') {
                // success, decode params
            } else {
                iserr = true
            }

            var paramsarr = str.split('&')
            var parts
            for (var i=0; i<paramsarr.length; i++) {
                parts = paramsarr[i].split('=')
                params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1])
            }

        } else {
            iserr = true
        }
        console.log('oauth params result',iserr,params)
        return params
    }
    function onauth(data) {
        doing_oauth_flow = false
        console.log('identity webflow authorize result',data)
        // read data from url
        if (data) {
            var params = decodeauthurl(data)
            if (params.state == stateparam) {
                storespotifytoken(params)
                if (callback) { callback(params) }
            } else {
                callback({error:'state mismatch'})
            }
        } else {
            if (callback) { callback(null) }
        }
    }
    var params = {
        client_id: 'c64f3e47bf2840ee91a8d77512a30fad',
        response_type: 'token',
        //            redirect_uri: 'http://play.spotubify.com:8543/oauthcallback',
        redirect_uri: redirecturl,
        state: stateparam,
        scope: 'playlist-read-private user-library-read user-read-email',
        show_dialog: true
    }
    var aparams = []
    for (var key in params) {
        aparams.push( key + '=' + encodeURIComponent(params[key]) )
    }
    var url = baseurl + aparams.join('&')
    var details = {
        url: url,
        interactive: true
    }
    console.log('launch oauth flow',details)
    chrome.identity.launchWebAuthFlow(details, onauth)
}

function storespotifytoken(data) {
    // stores spotify access token
    var curtime = new Date().getTime() / 1000
    chrome.storage.local.set( { spotifytoken: { access_token: data.access_token,
                                                token_type: data.token_type,
                                                expires: Math.floor(curtime) + parseInt(data.expires_in)
                                              } } )
}

function getspotifytoken(callback) {

    chrome.storage.local.get(['spotifytoken'], function(result) {
        if (result.spotifytoken) {
            //console.log('retreived token. check expiration...',result.spotifytoken)
            var curtime = Math.floor(new Date().getTime() / 1000)
            if (result.spotifytoken.access_token && result.spotifytoken.expires - 10 > curtime) {
                callback(result.spotifytoken)
            } else {
                console.log('token no good')
                chrome.storage.local.remove(['spotifytoken'])
            }
        }
    })
    
}


function onload() {
    getspotifytoken( function(auth) {
        //console.log('got spotify token onload',auth)
        window.spapi = new SpotifyAPI(auth)
        spapi.me(function(){
            spapi.playlists(function(){})
        })
    })
    function oauth_flow_done(data) {
        console.log('just did oauth flow',data)

    }
    var login = document.getElementById('login')
    if (login) {
        login.addEventListener('click',do_oauth_flow.bind(this,oauth_flow_done))
    }
}

function SpotifyAPI(auth) {
    this.auth = auth
    this.base = "https://api.spotify.com/v1/"
    this.responses = {}
}

SpotifyAPI.prototype = {
    playlists: function(callback) {
        function collectone(url) {
            var xhr = new XMLHttpRequest(); 
            xhr.open("GET",url)
            xhr.setRequestHeader('Authorization','Bearer ' + this.auth.access_token)
            xhr.onload = function(evt) {
                var response = evt.target.response
                var data = JSON.parse(response)
                if (! this.responses.playlists) {
                    this.responses.playlists = []
                }
                this.responses.playlists.push(data)
                console.log('got some spotify playlists')
                if (data.next) {
                    console.log('getting more playlists')
                    collectone.call(this,data.next)
                } else {
                    console.log('all done!')
                    callback(this.responses.playlists)
                }
            }.bind(this)
            xhr.onerror = function(evt) {
                console.error('spotify api error',evt)
                callback({error:true,evt:evt})
            }.bind(this)
            xhr.send()
        }

        var uri = "users/"+this.responses.me.id+"/playlists?limit=50"
        collectone.call(this,this.base+uri)
    },
    me: function(callback) {
        var xhr = new XMLHttpRequest(); 
        xhr.open("GET",this.base + 'me')
        xhr.setRequestHeader('Authorization','Bearer ' + this.auth.access_token)
        xhr.onload = function(evt) {
            var response = evt.target.response
            var data = JSON.parse(response)
            this.responses.me = data
            console.log('got spotify user id',this.responses.me.id)
            callback(data)
        }.bind(this)
        xhr.onerror = function(evt) {
            console.error('spotify api error',evt)
            callback({error:true,evt:evt})
        }.bind(this)
        xhr.send()
    }
}


document.addEventListener("DOMContentLoaded",onload)

function reload() { chrome.runtime.reload() }