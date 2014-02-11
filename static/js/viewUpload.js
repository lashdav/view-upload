/* global $, console, analytics */

/* Button Click Event */

$('#choose-desktop-upload').click(function() {
    $('#session-link').hide();
    $('#desktop-upload-form').show();
    $('#url-upload-form').hide();
});

$('#choose-url-upload').click(function() {
    $('#session-link').hide();
    $('#url-upload-form').show();
    $('#desktop-upload-form').hide();
});

/* Form Submit Events */

function fetchSession(documentID, expire) {
    var data = new FormData();
    data.append('document_id', documentID);
    data.append('expire', expire);

    $.ajax({
        type: 'POST',
        contentType: false,
        processData: false,
        data: data,
        dataType: 'json',
        url: 'sessions',
        error: function (data) {
            console.log(data);
            $('#session-link').text('Something went wrong while converting...').show();
        },
        statusCode: {
            200: function(data) {
                $('button, #progress').toggle();
                $('#session-link').text(data.session_url).attr('href', data.session_url).show();
            },
            202: function() {
                fetchSession(documentID, expire);
            }
        }
    });
}

$('#desktop-upload-form').submit(function () {
    $('button').blur();

    var data = new FormData();
    data.append('file', $('#file_to_convert')[0].files[0]);
    var shouldExpire = $('#desktop-expiration').is(':checked') ? 'no_expire' : 'expire';

    $('button, #progress').toggle('fast');
    $.ajax({
        type: 'POST',
        contentType: false,
        processData: false,
        data: data,
        dataType: 'json',
        url: 'desktop-upload',
        error: function (data) {
            console.log(data);
            $('#session-link').text('Something went wrong while converting...').show();
            analytics.track('Desktop Conversion', {
                success: 'false'
            });
        }
    }).done(function (data) {
        fetchSession(data.id, shouldExpire);
        analytics.track('Desktop Conversion', {
            success: 'true'
        });
    });

    return false;
});

$('#url-upload-form').submit(function () {
    $('button').blur();

    var data = new FormData();
    data.append('document-url', $('#file-url').val());
    var shouldExpire = $('#url-expiration').is(':checked') ? 'no_expire' : 'expire';

    $('button, #progress').toggle('fast');
    $.ajax({
        type: 'POST',
        contentType: false,
        processData: false,
        data: data,
        dataType: 'json',
        url: 'url-upload',
        error: function (data) {
            console.log(data);
            $('#session-link').text('Something went wrong while converting...').show();
            analytics.track('URL Conversion', {
                success: 'false'
            });
        }
    }).done(function (data) {
        fetchSession(data.id, shouldExpire);
        analytics.track('URL Conversion', {
            success: 'true'
        });
    });

    return false;
});