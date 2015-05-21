$(document).ready(function(){
		
	// jQuery countdown function
	$('#countdown .count-down').countdown({until: date, 
    	layout: $('#countdown .count-down').html()
	});
	
	// jQuery slider function 
	$('#slider .flexslider').flexslider({
	  animation: "fade",
	  directionNav: false,
	  controlNav: false,
	  animationSpeed: 1200, 
      start: function(slider){
       $('#slider .flexslider').removeClass('loader');
      }
    });
	
	// Twitter bootstrap tooltips
	$('#follow ul.social li a').tooltip();
	$('#top .social ul li a').tooltip();
	
	/* Twitter integration */
	$.getJSON('includes/get-tweets.php',
        function(feeds) {
            // alert(feeds);
			var displaylimit		= 2;
			var showdirecttweets	= false;
			var showretweets		= true;
            var feedHTML			= '';
            var displayCounter		= 1;
			
			if(feeds !== null) {
				$(".tweets").hide();
				
				for (var i=0; i<feeds.length; i++) {
					var tweetscreenname	= feeds[i].user.name;
					var tweetusername	= feeds[i].user.screen_name;
					var profileimage	= feeds[i].user.profile_image_url_https;
					var status			= feeds[i].text;
					var isaretweet		= false;
					var isdirect		= false;
					var tweetid			= feeds[i].id_str;
	 
					// If the tweet has been retweeted, get the profile pic of the tweeter
					if (typeof feeds[i].retweeted_status !== 'undefined') {
						profileimage	= feeds[i].retweeted_status.user.profile_image_url_https;
						tweetscreenname	= feeds[i].retweeted_status.user.name;
						tweetusername	= feeds[i].retweeted_status.user.screen_name;
						tweetid			= feeds[i].retweeted_status.id_str;
						isaretweet		= true;
					}
					
					// Check to see if the tweet is a direct message
					if (feeds[i].text.substr(0,1) === '@') {
						isdirect = true;
					}
					
					// console.log(feeds[i]);
					
					if (((showretweets === true) || ((isaretweet === false) && (showretweets === false))) && ((showdirecttweets === true) || ((showdirecttweets === false) && (isdirect === false)))) {
						if ((feeds[i].text.length > 1) && (displayCounter <= displaylimit)) {
	 
							if (displayCounter === 1) {
								feedHTML = '';
							}
							
							feedHTML	+= '<li>';
							feedHTML	+= '<span class="tweet_pict"><!-- --></span>';
							feedHTML	+= '<span class="tweet_text">' + JQTWEET.ify.clean(status) + '</span>';
							feedHTML	+= '<span class="date">- ' +  JQTWEET.timeAgo(feeds[i].created_at) + '</span>';
							feedHTML	+= '</li>';
							
							displayCounter++;
						}
					}
				}
	 
				$('.tweets').html(feedHTML);
				$('.tweets').hide().fadeIn(1000);
			}
		}
	);
	
	var JQTWEET = { // Twitter data format function
		timeAgo: function(dateString) { // twitter date string format function
			var rightNow = new Date();
			var then = new Date(dateString);
			
			if ($.browser.msie) {
				// IE can't parse these crazy Ruby dates
				then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
			}
			
			var diff = rightNow - then;
			var second = 1000,
			minute = second * 60,
			hour = minute * 60,
			day = hour * 24;
	 
			if (isNaN(diff) || diff < 0) { return ""; }
			if (diff < second * 2) { return "right now"; }
			if (diff < minute) { return Math.floor(diff / second) + " seconds ago"; }
			if (diff < minute * 2) { return "1 minute ago"; }
			if (diff < hour) { return Math.floor(diff / minute) + " minutes ago"; }
			if (diff < hour * 2) { return "1 hour ago"; }
			if (diff < day) { return  Math.floor(diff / hour) + " hours ago"; }
			if (diff > day && diff < day * 2) { return "1 day ago"; }
			if (diff < day * 365) { return Math.floor(diff / day) + " days ago"; }
			else { return "over a year ago"; }
		}, // timeAgo()
		 
		ify: {
			link: function(tweet) { // twitter link string replace function
				return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
					var http = m2.match(/w/) ? 'http://' : '';
					return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
				});
			},
			
			at: function(tweet) { // twitter at (@) character format function
				return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
					return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
				});
			},
			
			list: function(tweet) { // twitter list string format function
				return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
					return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
				});
			},
			
			hash: function(tweet) { // twitter hash (#) string format function
				return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
					return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
				});
			},
			
			clean: function(tweet) { // twitter clean all string format function
				return this.hash(this.at(this.list(this.link(tweet))));
			}
		} // ify
	};
	/* End twitter integration */
	
	// Email subcribe process function
	$("#email_address").live('focus keypress',function(){ // Checking subcribe form when focus event
		var email = $(this).val();
		(email == "Please enter your email address...." || email == "Please enter a valid email address...." || email == "Subscribe process completed...." || email == "Email is already registered....") ? $(this).val('').css({'backgroundColor':'#FFF'}) : '';
	});
	
	$("#form-subscribe").submit(function(){ // Checking subcribe form when submit to database
		var email = $("#email_address").val();
		
		var email_pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
		if(email_pattern.test(email)==false) {
			$("#email_address").val('Please enter a valid email address....').css({'backgroundColor':'#ffb2b2'});
		} else {
			var submitData = $('#form-subscribe').serialize();
			$("#email_address").attr('disabled','disabled');
			$("#subcribe_submit").attr('disabled','disabled');
			$.ajax({ // Subcribe process with AJAX
				type: "POST",
				url: "subcribe.php",
				data: submitData + "&action=add",
				dataType: "html",
				success: function(msg){
					if(parseInt(msg)!=0)
						{
						var msg	= msg.split("|");
						
						if(msg[0]=='success') {
							$("#subcribe_submit").removeAttr('disabled');
							$("#email_address").removeAttr('disabled').val(msg[1]).css({'backgroundColor':'#a5ffa5'}); 
							} else {
							$("#subcribe_submit").removeAttr('disabled');
							$("#email_address").removeAttr('disabled').val(msg[1]).css({'backgroundColor':'#ffb2b2'});
							}
						}
					}
				});
			}
		return false;
	});
	
	// Process bar function
	$('#countdown .process-bar').each(function(){
		var element		= $(this),
			current 	= 0,
			rate 		= 1,
			processVal 	= element.attr('data-perc'),
			barVal		= Math.round(processVal);
		
		element.find('.bar').animate({width:barVal+'%'}, processVal * 60, 'easeOutBounce');

		var counter = setInterval(function(){
			if(current >= processVal) clearInterval(counter);

			element.find('.text').text(current+'%');

			current = parseInt(current) + parseInt(rate);

		}, processVal * 25 / (processVal / rate));
		
		function precentProcess() {
			var length   	= element.find('.bar').css('width'),
			    textlength	= (parseInt(length));
			element.find('.text').css('left', textlength);
		}
		
		precentProcess();
		setInterval(precentProcess, 0);
	});
	
	// jQuery placeholder for IE
	$("input, textarea").placeholder();

});