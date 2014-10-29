function onPlayerReady() {
    console.log('player ready',arguments)
}

function onPlayerError() {
    console.log('player error',arguments)
}

function onPlayerPlaybackQualityChange() {
    console.log('quality change',arguments)
}
function onPlayerStateChange() {
    console.log('state change',arguments)
}

function onYouTubeIframeAPIReady() {
    var player;
    player = new YT.Player('player', {
        width: 300,
        height: 300,
        videoId: 'M7lc1UVf-VE',
        playerVars: {'autoplay':1},
        events: {
            'onReady': onPlayerReady,
            'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    event.target.setVolume(100);
    event.target.playVideo();
}