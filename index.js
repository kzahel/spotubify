

function onload() {

    document.getElementById('login').addEventListener('click',function() {
        function onauth(data) {
            console.log('identity webflow authorize result',data)
        }
        var baseurl = "https://accounts.spotify.com/authorize?"
        var stateparam = Math.floor( Math.random() * Math.pow(2,30) )
        var params = {
            client_id: 'c64f3e47bf2840ee91a8d77512a30fad',
            response_type: 'token',
//            redirect_uri: 'http://play.spotubify.com:8543/oauthcallback',
            redirect_uri: chrome.identity.getRedirectURL(),
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
    })
}


document.addEventListener("DOMContentLoaded",onload)