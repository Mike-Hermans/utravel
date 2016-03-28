(function() {

    var suggestions = {
        html: null,
        init: function(url, success) {
            $.ajax({
                contentType: "text/html",
                url: url,
                success: function(html) {
                    suggestions.html = html;
                    success();
                }
            });
        },
        get: function(url, success) {
            $.ajax({
                dataType: "json",
                contentType: "application/json",
                url: url,
                success: success
            });
        },
        add: function(index) {
            var $suggestions = $('#suggestions'),
                item = suggestions.data[0],
                html = suggestions.parse(index, item);
                $item = $(html);

            if(index == 0) {
                $suggestions.prepend($item);
            } else {
                index--;
                $item.insertAfter('.suggestion[data-index='+ index +']');
            }

            $item.animate({
                'top': '0',
                'opacity': '1'
            }, 600);

            suggestions.removeById(item.id);
        },
        parse: function(index, item) {
            var html = suggestions.html;
            html = html.replace('{index}', index);
            html = html.replace('{index}', index);
            html = html.replace('{index}', index);
            html = html.replace('{id}', item.id);
            html = html.replace('{id}', item.id);
            html = html.replace('{title}', item.title);
            html = html.replace('{description}', item.description);
            html = html.replace('{price}', item.price);
            html = html.replace('{image}', item.image);

            return html;
        },
        show: function(e) {
            var $parent = $(this).parent(),
                $detail = $parent.find('.detail'),
                $likeDislike = $parent.find('.like, .dislike');

            $detail.slideToggle(300);

            $likeDislike.fadeToggle(200);
        },
        like: function() {
            // Get suggestion ID
            // Get active group ID
            // Add suggestion to group/user
            // Remove suggestion

            var $parent = $(this).parent(),
                index = $parent.data('index'),
                id = $parent.data('id'),
                $suggestions = $('#suggestions');

            $parent.animate({
                'left': '-=100px',
                'opacity': 0
            }, 300, function() {
                $parent.remove();
                // suggestions.removeById(id);
                suggestions.add(index);
            });
        },
        dislike: function() {
            var $parent = $(this).parent(),
                index = $parent.data('index'),
                id = $parent.data('id'),
                $suggestions = $('#suggestions');

            $parent.animate({
                'left': '100px',
                'opacity': 0
            }, 300, function() {
                $parent.remove();
                suggestions.add(index);
            });
        },
        removeByIndex: function(index) {
            console.log('index '+ index);

            suggestions.data.splice(index, 1);
        },
        removeById: function(id) {
            console.log('id '+ id);
            for(var i=0; i<suggestions.data.length; i++) {
                if(suggestions.data[i].id == id) {
                    suggestions.removeByIndex(i);
                }
            }
        },
        moreReviews: function() {
			var $this = $(this),
				id = $this.data('index'),
				$review = $('#reviews[data-index='+id+'] .review:first-child'),
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
    $(document).on('click', '.like', suggestions.like);
    $(document).on('click', '.dislike', suggestions.dislike);

    suggestions.init('../../partials/suggestion.html', function(data) {
        suggestions.get('../../data/data.json', function(data) {
            console.log(data);

            // Shuffle results
            data.sort(function() { return 0.5 - Math.random() });

            suggestions.data = data;

            for(var i=0; i<=3; i++) {
                var html = suggestions.parse(i, data[i]);
                var item = $(html);
                $('#suggestions').append(item);

                item.animate({
                    'top': '0',
                    'opacity': '1'
                }, 400);

                suggestions.removeByIndex(i);
            }
        });
    });

})();
