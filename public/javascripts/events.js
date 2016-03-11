var socket = io();

function mouseover(data) {
	if(data.className == 'li_action' ){
		return;
	}
	data.getElementsByClassName('glyphicon')[0].style.visibility = "visible";
}

function mouseout(data) {
	if(data.className == 'li_action' ){
		return;
	}
	data.getElementsByClassName('glyphicon')[0].style.visibility = "hidden";
}

function mouseclick(data){
	$('#m').val('@' + data.innerHTML + ' ');
	$('#m').text(data.id);
	$('#m').focus();
}

function recallmsg(data){
	var msgid = data.parentElement.id;
	var info = {
		msgid: msgid
	}
	socket.emit('recall message', info);
}

$('button').click(function(){
	var m = $('#m').val();
	if($(this)[0].id == 'send' && m){		//发送消息
		var time = new Date().getTime();
		var info = {
			time: time
		};
		if($('#m').text()){	//私信消息
			var msg = m.substring(m.indexOf(' ')+1)
			var elem = '@<span class="'+$('#m').text()+'">'+m.substring(1, m.indexOf(' '))+'</span> '+msg;
			info.type = '@';
			info.msg = '@' + $('#m').text() + ' ' + msg;
			socket.emit('chat message', info);
			$('#messages').append($('<li class="li_at" id="'+time+'" onmouseover="mouseover(this)" onmouseout="mouseout(this)"><span>我</span> ：<span class="usermsg">'+elem+'</span>	<span onclick="recallmsg(this)" class="glyphicon glyphicon-minus" style="visibility: hidden"></span></li>'));
			$('html, body').animate({scrollTop: $(document).height()}, 50);
		}else{			//非私信消息
			info.msg = m;
			socket.emit('chat message', info);
		}
		$('#m').val('');
		$('#m').text('');
	}else if($(this)[0].id == 'alter' && m){		//修改昵称
		socket.emit('change name', m);
		$('#m').val('');
	}
	return false;
});

socket.on('chat message', function(msg){	//接收聊天消息
	if(msg.recvid){				//判断是不是私信消息
		if(socket.id == msg.recvid){	//判断自己是不是被@的用户
			$('#messages').append($('<li class="li_private" id="'+msg.time+'"><span  onclick="mouseclick(this)" class="username '+msg.sender+'"  id="'+msg.sendid+'">'+msg.sender+'</span> （私信）：<span class="usermsg">'+msg.msg+'</span></li>'));
		}
	}else if(msg.sendid == socket.id){
		$('#messages').append($('<li id="'+msg.time+'" onmouseover="mouseover(this)" onmouseout="mouseout(this)"><span>我</span> ：<span class="usermsg">'+msg.msg+'</span>	<span onclick="recallmsg(this)" class="glyphicon glyphicon-minus" style="visibility: hidden"></span></li>'));
	}else{
		$('#messages').append('<li id="'+msg.time+'"><span onclick="mouseclick(this)" class="username '+msg.sendid+'" id="'+msg.sendid+'">'+msg.sender+'</span> ：<span class="usermsg">'+msg.msg+'</span></li>');
	}
	$('html, body').animate({scrollTop: $(document).height()}, 50);
});

socket.on('recall message', function(msg){
	var m ;
	if(socket.id == msg.sendid){
		m = '你撤回了一条消息！';
		$('#'+msg.msgid).text(m);
	}else{
		m = '<span class="'+msg.sendid+'">' + msg.sender + '</span> 撤回了一条消息！';
		$('#'+msg.msgid).html(m);
	}
	$('#'+msg.msgid).removeClass();
	$('#'+msg.msgid).addClass('li_action');
});

socket.on('action message', function(info){	//接收行为消息
	if(!socket.id){
		socket.id = info.userid;
		$('#m').attr('placeholder', '你的昵称：' + info.userid);
	}
	if(info.type == 'CN'){
		if(info.userid != socket.id){
			$('.'+info.userid).text(info.newname);
			$('#messages').append('<li class="li_action">'+info.oldname+' 将昵称修改为 ： '+info.newname+'</li>');
		}else{
			$('#messages').append('<li class="li_action">你将昵称修改为 ： '+info.newname+'</li>');
			$('#m').attr('placeholder', '你的昵称：' + info.newname);
		}
	}else if(info.type == 'ONL'){
		$('#messages').append('<li class="li_action">'+info.userid+' 已经上线～当前共有 '+info.olnum+' 人在线～');
	}else if(info.type == 'OUTL'){
		$('#messages').append('<li class="li_action">'+info.user+' 已经下线～当前共有 '+info.olnum+' 人在线～');
	}
	$('html, body').animate({scrollTop: $(document).height()}, 50);
});