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
				top = top - 145;
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
        loadSettingsPage: function(e) {
            var groupIndex = $(this).data('group');

            localStorage.set('activeGroup', groupIndex);

            // localStorage.setObject('groupUsers', {
            //     "0": [],
            //     "1": [],
            //     "2": []
            // });

            view.next();
        },
        loadLoginPage: function() {
            var $slider = $('#page-slider');
            $slider.css({
                'margin-left': '0%'
            }, 300);
        },
        loadSuggestionsPage: function(animation) {

            var activeGroup = localStorage.get('activeGroup');
            groups.set(activeGroup);

            var $slider = $('#page-slider');
            if(animation) {
                $slider.animate({
                    'margin-left': '-400%'
                }, 300, function() {
                    $('header').slideDown(300);
                });
            } else {
                $slider.css({
                    'margin-left': '-400%'
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

            view.next(true);
        }
    };

    var groups = {
        toggle: function(e) {
            $('#group-page').slideToggle(300);
        },
        addUser: function(e) {
            var user = $('#add-user-text').val().trim();

            if(user == '') {
                return;
            }

            var tag = '<span class="user-tag">' + user + '</span>';
            $('.user-tags').append(tag);
            $('#add-user-text').val('');

            // Add the new user to the array for the active group
            var activeGroup = localStorage.get('activeGroup');
            var allUsers = localStorage.getObject('groupUsers');
            allUsers[activeGroup].push(user);
            localStorage.setObject('groupUsers', allUsers);
        },
        fillUsers: function(users) {
            $('.user-tags').html('');
            for(var i=0; i<users.length; i++) {
                var tag = '<span class="user-tag">' + users[i] + '</span>';
                $('.user-tags').append(tag);
                $('#add-user-text').val('');
            }
        },
        removeUser: function(e) {
            var user = $(this).html();
            $(this).remove();

            var activeGroup = [localStorage.get('activeGroup')];
            var users = localStorage.getObject('groupUsers');
            var index = users[activeGroup].indexOf(user);
            users[activeGroup].splice(index, 1);
            localStorage.setObject('groupUsers', users);
        },
        set: function(index) {
            $('#selected-group').addClass(groupsOptions[index]);

            var users = localStorage.getObject('groupUsers')[index];
            groups.fillUsers(users);
        },
        select: function(e) {
            var groupIndex = $(this).data('group'),
                active = localStorage.get('activeGroup');

            $('#selected-group').removeClass(groupsOptions[active]).addClass(groupsOptions[groupIndex]);

            localStorage.set('activeGroup', groupIndex);

            groups.dropdown();

            var users = localStorage.getObject('groupUsers')[groupIndex];
            console.log(users);
            groups.fillUsers(users);

            // Reset suggestions
            suggestions.get('../../data/data.json', function(data) {
                // Shuffle results
                data.sort(function() { return 0.5 - Math.random() });

                suggestions.data = data;

                $('#suggestions .suggestion').remove();

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
        },
        dropdown: function() {
            $('.groups').slideToggle(100);
        },
        autocomplete: function(e) {

        }
    };

    var groupsOptions = [
        'solo',
        'friend',
        'friends'
    ];

    var choices = {
        toggle: function(e) {
            $(this).toggleClass('selected');
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
        setObject: function(key, object) {
            // console.log('---------------');
            // console.log(JSON.stringify(object));
            // console.log(JSON.parse(JSON.stringify(object)));
            // console.log('---------------');
            window.localStorage[key] = JSON.stringify(object);
        },
        getObject: function(key) {
            var test = JSON.parse(window.localStorage[key]);
            // console.log('- ----');
            // console.log(test);
            return test;
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

    $(document).on('click', '.back', groups.toggle);

    $(document).on('click', '#choices-btn', view.loadSuggestionsPage);

    $(document).on('click', '#group-page .group-dropdown', groups.dropdown);
    $(document).on('click', '#group-page .groups .group', groups.select);
    $(document).on('keyup', '#add-user-text', groups.autocomplete);
    $(document).on('click', '#add-user-btn', groups.addUser);
    $(document).on('click', '.user-tag', groups.removeUser);

    $(document).on('click', '.choice', choices.toggle);

    // Remove
    $('#username').val('robert');
    $('#password').val('password');
    $('#login-btn').removeClass('login-btn-disabled').removeAttr('disabled');
    $(document).on('click', '#group-selection-page .group-selection', view.loadSettingsPage);


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
