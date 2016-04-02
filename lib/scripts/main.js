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

            suggestions.show($item);

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
        show: function(elem) {
            var $detail = elem.find('.detail');

            $detail.slideToggle(300);
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
            suggestions.data.splice(index, 1);
        },
        removeById: function(id) {
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

    var view = {
        loadGroupSelectionPage: function() {
            view.next();
        },
        loadSettingsPage: function() {
            view.next();
        },
        loadLoginPage: function() {
            var $slider = $('#page-slider');
            $slider.css({
                'margin-left': '0%'
            }, 300);
        },
        loadSuggestionsPage: function(animation) {
            var $slider = $('#page-slider');
            if(animation) {
                $slider.animate({
                    'margin-left': '-300%'
                }, 300, function() {
                    $('header').slideDown(300);
                });
            } else {
                $slider.css({
                    'margin-left': '-300%'
                });
            }
        },
        next: function() {
            var $slider = $('#page-slider');
            $slider.animate({
                'margin-left': '-=100%'
            }, 300);
        }
    };

    var user = {
        login: function(e) {
            var username = $('#username').val(),
                password = $('#password').val();

            if(username == '' || password == '') {
                $('.login-error').show();
            } else {
                $('.login-error').hide();
            }

            if(!localStorage.has('auth')) {
                localStorage.set('username', username);
                $('.username').html(username);

                view.loadGroupSelectionPage();

                localStorage.set('auth', true);

                $('#logout-btn').show();    // replace with header bar
            }
        },
        logout: function() {
            view.loadLoginPage();

            localStorage.remove('username');
            localStorage.remove('auth');

            $('header').hide();

            $('#logout-btn').hide();
        },
        checkAuth: function() {
            $('.username').html(localStorage.get('username'));

            view.loadSuggestionsPage(false);
        },
        skipSettings: function() {
            view.next();
        },
        createSettings: function() {
            var budget = $('#budget').val(),
                location = $('#location').val(),
                startDate = $('#dt1').val(),
                endDate = $('#dt2').val();

            localStorage.set('budget', budget);
            localStorage.set('location', location);
            localStorage.set('startDate', startDate);
            localStorage.set('endDate', endDate);

            view.loadSuggestionsPage(true);
        }
    };

    var localStorage = {
        has: function(key) {
            var item = window.localStorage.getItem(key);
            if(item !== null && item !== undefined) {
                return true;
            }
            return false;
        },
        set: function(key, value) {
            window.localStorage[key] = value;
        },
        get: function(key) {
            return window.localStorage[key];
        },
        save: function(key, value) {
            this.set(key, value);
            return this.get(key);
        },
        remove: function(k) {
            window.localStorage.removeItem(k);
        },
        clear: function() {
            window.localStorage.clear();
        }
    }

    $(document).on('click', '#login-btn', user.login);
    $(document).on('click', '#logout-btn', user.logout);

    $(document).on('click', '#settings-skip-btn', user.skipSettings);
    $(document).on('click', '#settings-create-btn', user.createSettings);

    // Remove
    $('#username').val('robert');
    $('#password').val('password');
    $('#login-btn').removeClass('login-btn-disabled').removeAttr('disabled');
    $(document).on('click', '#group-selection-page .group', view.loadSettingsPage);


    $(document).on('keyup', '#username, #password', function() {
        var username = $('#username').val(),
            password = $('#password').val();

        if(username != '' && password != '') {
            $('#login-btn').removeClass('login-btn-disabled').removeAttr('disabled');
        } else {
            $('#login-btn').addClass('login-btn-disabled').attr('disabled', 'disabled');
        }
    });

    // ---------------------------------------------------------------------------------------------------------------------------------------

    $(document).on('click', '.more-reviews', suggestions.moreReviews);
    $(document).on('click', '.like', suggestions.like);
    $(document).on('click', '.dislike', suggestions.dislike);

    $(document).on('mouseenter', '.suggestion', function(e) {
        var $likeDislike = $(this).find('.like, .dislike');
        $likeDislike.show();
    });

    $(document).on('mouseleave', '.suggestion', function(e) {
        var $likeDislike = $(this).find('.like, .dislike');
        $likeDislike.hide();
    });

    $(document).on('ready', function(e) {
        // $("#location").autocomplete({
        //   source: availableTags
        // });
        //
        // $(document).on('click', '.ui-menu-item', function(e) {
        //     console.log('dsadsd');
        //     console.log($(this).html());
        // });

        $("#dt1").datepicker({
            dateFormat: "dd MM yy",
            minDate: 0,
            onSelect: function () {
                var dt2 = $('#dt2');
                var startDate = $(this).datepicker('getDate');
                startDate.setDate(startDate.getDate() + 30);
                var minDate = $(this).datepicker('getDate');
                dt2.datepicker('setDate', minDate);
                dt2.datepicker('option', 'minDate', minDate);
                $(this).datepicker('option', 'minDate', minDate);
            }
        });
        $('#dt2').datepicker({
            dateFormat: "dd MM yy"
        });
    });

    // ---------------------------------------------------------------------------------------------------------------------------------------

    // Check if the user is logged in
    // user.checkAuth();

    user.logout();
    user.login();

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

                $detail = item.find('.detail'),
                $likeDislike = item.find('.like, .dislike');
                $detail.slideToggle(300);

                suggestions.removeByIndex(i);
            }
        });
    });

})();
