(function() {

    var suggestions = {
        show: function(e) {
            var $parent = $(this).parent(),
                $detail = $parent.find('.detail'),
                $likeDislike = $parent.find('.like, .dislike');

            $detail.slideToggle(300);

            $likeDislike.fadeToggle(200);
        },
        like: function() {

        },
        dislike: function() {

        },
        moreReviews: function() {
			var $this = $(this),
				id = $this.data('id'),
				$review = $('#reviews[data-id='+id+'] .review:first-child'),
				reviewCount = $this.data('reviewCount'),
				top = parseInt($review.css('margin-top'));

				if(reviewCount == 2) {
					top = 0;
					reviewCount = 0;
				} else {
					top = top - 143;
					reviewCount++;
				}

				$review.animate({'margin-top': top+'px'}, 300);

				$this.data('review-count', reviewCount);
        }
    };

    $(document).on('click', '.suggestion .background', suggestions.show);
    $(document).on('click', '.more-reviews', suggestions.moreReviews);

})();
