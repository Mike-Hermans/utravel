(function() {

    var suggestions = {
        show: function(e) {
            var $parent = $(this).parent(),
                $detail = $parent.find('.detail'),
                $likeDislike = $parent.find('.like, .dislike');

				console.log('dsafdd');

            $detail.slideToggle(300);

            $likeDislike.fadeToggle(200);
        },
        like: function() {

        },
        dislike: function() {

        },
        moreReviews: function() {

        }
    };

    $(document).on('click', '.suggestion .background', suggestions.show);
    $(document).on('click', '.more-reviews', suggestions.moreReviews)

})();
