(function () {

    S = {}; //Super object

    S.ajax = {
        //class used to make simple web service posts to the server
        queue: [],

        post: function (url, data, callback, error, json, opts) {
            var options = {
                method: "POST",
                data: JSON.stringify(data),
                url: '/api/' + url,
                contentType: "text/plain; charset=utf-8",
                dataType: 'html',
                success: function (d) {
                    var txt = '';
                    if (typeof d.responseText != 'undefined') { txt = d.responseText; } else { txt = d; }
                    S.ajax.runQueue();
                    if (typeof callback == 'function') { callback(txt); }
                },
                error: function (xhr, status, err) {
                    if (typeof error == 'function') { error(xhr, status, err); }
                    S.ajax.runQueue();
                }
            }
            if (opts) {
                //user-specified options
                if (opts.contentType) { options.contentType = opts.contentType; }
                if (opts.method) { options.method = opts.method; }
                if (opts.url) { options.url = opts.url; }
            }
            if (json == true) { options.dataType = 'json'; }
            S.ajax.queue.push(options);
            if (S.ajax.queue.length == 1) {
                $.ajax(options);
            }
        },
        runQueue: function () {
            S.ajax.queue.shift();
            if (S.ajax.queue.length > 0) {
                $.ajax(S.ajax.queue[0]);
            }
        }
    };
})();

//declare global variables
var doc = document;
var query = doc.querySelectorAll;
var storage = window.localStorage;

//set up array of URLs
var lists = localStorage.getItem("Lists");
if(!lists){
    lists = [
        {title:'Github',        image:'', url:'http://www.github.com/markentingh'},
        {title:'Saber',         image:'', url:'http://www.github.com/datasilk/saber'},
        {title:'Kandu',         image:'', url:'http://www.github.com/datasilk/kandu'},
        {title:'Legendary',     image:'', url:'http://www.github.com/datasilk/legendary'},
        {title:'Core Template', image:'', url:'http://www.github.com/datasilk/coretemplate'},
        {title:'Core',          image:'', url:'http://www.github.com/datasilk/core'},
        {title:'Core Js',       image:'', url:'http://www.github.com/datasilk/corejs'},
        {title:'Tapestry',      image:'', url:'http://www.github.com/websilk/tapestry'},
        {title:'Selector',      image:'', url:'http://www.github.com/websilk/selector'}
    ];

    lists = [];

    //set up frames
    var html = '';

    for(var x = 0; x < lists.length; x++){
        html += create(lists[x]);
    }

    doc.body.innerHTML = html;

    function create(list){
        return '<div class="frame"><iframe src="' + list.url + '" width="100%" height="100%" frameBorder="0"></iframe></div>\n';
    }
}