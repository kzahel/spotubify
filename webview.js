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
    console.log('youtube iframe api ready')
    var player;
    player = new YT.Player('player', {
        width: 300,
        height: 300,
        videoId: 'M7lc1UVf-VE',
//        videoId: "OOgpT5rEKIU", // alanis "thank you"
//        playerVars: {'autoplay':false},
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