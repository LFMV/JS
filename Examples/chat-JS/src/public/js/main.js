//Logical of the interface of frond-end

$(function() {
    //conexion client socket
    const socket = io();

    //obtaining DOM elements from the interface
    const $messageForm = $('#message-form')
    const $messageBox = $('#message')
    const $chat = $('#chat')

    //obtaining DOM elements from the nickname Form
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    const $users = $('#usernames');

    //nickName entry
    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html(`<div class="alert alert-danger">
                    That username already exist.
                </div>`)
            }
            $nickname.val('');
        });
    });

    //when form event 'send message to server
    $messageForm.submit(e => {
        e.preventDefault();
        //socket event called 'send message' 
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`)
        });
        $messageBox.val('');
    });

    socket.on('new message', (data) => {
        //$chat.append(data + '<br/>');
        console.log(data);
        $chat.append('<b>' + data.nick + '</b>: ' +
            data.msg + '<br/>');
    });

    // Show Users in card
    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            //ALT + 96 ``
            html += `<p> <i class = "fas fa-user"></i>${data[i]}</p > `
        }
        $users.html(html);
    });

    socket.on('whisper', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`)
    })

    socket.on('load old msgs', data => {
        for(let i = 0; i < data.length; i++)
        displayMsg(data[i]);
    });

    function displayMsg(data){
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`)
    }
});