
var player;
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
function onYouTubeIframeAPIReady() {
    player = new YT.Player('main-product-video', {
        width: '100%'
    });
}

(function($){
    youtubeUrlToId = function (url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match&&match[7].length==11){
            return match[7];
        } else {
            return false;
        }
    }

    $("[data-video-src]").each(function() {
        var id;
        var url = $(this).attr("data-video-src");
        if(id = youtubeUrlToId(url)) {
            var el = $(this);
            var title = 'Video Title';
            var thumbnail = '';
            el.find('img').first().attr('src', 'http://img.youtube.com/vi/'+id+'/default.jpg');
            el.click(function() {
                    $("#main-product-video").show();
                    $("#main-product-image").hide();
                    player.loadVideoById(id);
                    $("[data-image-swap]").click(function() {
                        alert('start video');
                        $("#main-product-video").hide();
                        $("#main-product-image").show();
                        player.stopVideo();

                    });
            });
        }
    });
     

}( window.jQuery ));