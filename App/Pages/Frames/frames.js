S.lists = {
    create: {
        show: function () {

        },

        hide: function () {

        },

        submit: function () {

        }
    }
};

S.frames = {
    lists: {
        'daily': { id: 'daily', title: 'Daily Newsfeed', frames: {} }
    },

    listId: 'daily',

    init: function () {
        var storage = window.localStorage;

        //set up array of URLs
        var lists = storage.getItem("lists");
        if (lists != null && typeof lists != 'undefined') {
            if (lists.length > 0) {
                //load lists from local storage
                lists = JSON.parse(lists);
            }
        } else { lists = [];}
        
        var html = '';
        if (!lists || typeof lists == 'undefined' || lists == null) {
            //new array of lists
            lists = [];
        } else if (lists.length > 0){
            //figure out which list to load
            var list = null;

            for (var a in lists) {
                if (list == null) { list = lists[a]; } else { break;}
            }
            if (window.location.hash.length > 0) {
                var hash = window.location.hash.split('/');
                if (hash.length > 0) {
                    //hash must be in specific format:
                    //e.g. "list-name/frame-id/option/option/option/..."
                    //list-name = URL encoded list name
                    //frame-id  = short-name of frame, e.g. wwwgooglecom (optional)
                    //options are, of course...optional (and unused so far).
                    list = lists[hash[0].toLowerCase()];
                    if (list == null || typeof list == 'undefined') {
                        list = list[0];
                    }
                }
            }
            S.frames.lists = lists;
            S.frames.load(list);
        }

        S.framelist = $('.frame');
        

        //set up button events
        $('.btn-add-frame').on('click', S.frames.create.show);
        $('#btnnewpage').on('click', S.frames.create.submit);

        //set up window resize to fix flex bug
        $(window).on('resize', S.frames.resizeWindow)
        S.frames.resizeWindow();
    },

    render: function (item, selected) {
        return '<div class="frame id-' + item.id + (selected === true ? ' selected' : '') + '">' +
                    '<a href="' + item.url + '" target="_blank"><img src="/content/screenshots/' + item.image + '" alt="' + item.title + '" data-id="' + item.id + '"/></a>' +
                '</div>\n';
    },

    load: function (list, selected) {
        //set up frames using selected list
        var html = '';
        for (var frame in list.frames) {
            html += S.frames.render(list.frames[frame], list.frames[frame].id == selected);
        }
        $('.frames').html(html);
    },

    error: function () {
        S.message.show('.frames .message', 'error', S.message.error.generic);
    },

    wipe: function () {
        //warning: all lists will be deleted
        if (confirm('Do you really want to wipe your local storage? This will permanently delete all list and frames you have created.')) {
            window.localStorage.setItem('lists', '');
        }
    },

    resizeWindow: function () {
        S.framelist.css({ 'width': '0px' });
        setTimeout(function () { S.framelist.css({ 'width': 'unset' }); }, 0);
    },

    create: {
        show: function () {
            $('.form-add-page').removeClass('hide');
        },

        hide: function () {
            $('.form-add-page').addClass('hide');
        },

        submit: function (e) {
            var item = {
                url: $('#newurl').val()
            };
            var protocol = item.url.split('://', 2);
            if (protocol.length > 1) {
                protocol = protocol[0] + '://';
            } else { protocol = 'http://';}
            item.url = item.url.replace('http://', '').replace('https://', '');
            var urlparts = item.url.split('/');
            var id = urlparts.join('_').replace(/\./g, '').replace(/__/g, '_');
            console.log(id);

            item.url = protocol + urlparts.join('/');
            console.log(item.url);

            var list = S.frames.lists[S.frames.listId];
            for (var frame in list.frames) {
                //check to see if frame name already exists
                
                if (frame.id == id) {
                    //found existing frame
                    S.ajax.post('Screenshot/FullPage', { url: item.url }, function (d) {
                        var info = d.split('|');
                        $('.frame.id-' + id + ' img').attr('src', '/content/screenshots/' + frame.image + '?r=' + (Math.floor(Math.random() * 9999)));
                        console.log('updated image to ' + frame.image);
                    });
                    if (e.stopPropagation) e.stopPropagation();
                    if (e.preventDefault) e.preventDefault();
                    e.cancelBubble = true;
                    e.returnValue = false;
                    return false;
                }
            }

            //get screenshot from server
            S.ajax.post('Screenshot/FullPage', item,
                function (d) {
                    var info = d.split('|');
                    var file = info[0].split('.');

                    //setup new frame object
                    item.id = info[1];
                    item.image = file[0] + '-lg.' + file[1];
                    item.title = $('#newtitle').val();

                    if (!S.frames.lists[S.frames.listId].frames){
                        S.frames.lists[S.frames.listId].frames = new Object();
                    }
                    S.frames.lists[S.frames.listId].frames[item.id] = item;
                    if (S.frames.lists.length == null) {
                        S.frames.lists.length = 1;
                    } else { S.frames.lists.length++; }

                    //save lists to local storage
                    window.localStorage.setItem('lists', JSON.stringify(S.frames.lists));

                    //render new frame on page
                    $('.frames').append(S.frames.render(item));
                    S.framelist = $('.frame');
                },

                function () {
                    S.frames.error();
                }
            );

            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();
            e.cancelBubble = true;
            e.returnValue = false;
            return false;
        }
    }
};

S.frames.init();