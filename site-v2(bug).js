function disableOther(e){"showTop"!==e&&classie.toggle(showTop,"disabled")}head.js("//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js","//google-analytics.com/ga.js","http://cdn.mckaywei.com/js/classie.js","http://cdn.mckaywei.com/js/disqus.min.js"),userAgent=window.navigator.userAgent,/iP(hone|od|ad)/.test(userAgent)&&(head.js("http://cdn.mckaywei.com/js/ios-orientationchange-fix.js","http://cdn.mckaywei.com/js/fastclick.js"),window.addEventListener("load",function(){FastClick.attach(document.body)},!1));var menuTop=document.getElementById("top-menu"),showTop=document.getElementById("showTop"),body=document.body;showTop.onclick=function(){classie.toggle(this,"active"),classie.toggle(menuTop,"push-menu-open"),disableOther("showTop")};$(function(){
	$('table').each(function() {
		if($(this).find('thead').length > 0 && $(this).find('th').length > 0) {
			var $w	   = $(window),
				$t	   = $(this),
				$thead = $t.find('thead').clone(),
				$col   = $t.find('thead, tbody').clone();
			$t
			.addClass('sticky-enabled')
			.css({
				margin: 0,
				width: '100%'
			}).wrap('<div class="sticky-wrap" />');

			if($t.hasClass('overflow-y')) $t.removeClass('overflow-y').parent().addClass('overflow-y');
			$t.after('<table class="sticky-thead" />');
			if($t.find('tbody th').length > 0) {
				$t.after('<table class="sticky-col" /><table class="sticky-intersect" />');
			}
			var $stickyHead  = $(this).siblings('.sticky-thead'),
				$stickyCol   = $(this).siblings('.sticky-col'),
				$stickyInsct = $(this).siblings('.sticky-intersect'),
				$stickyWrap  = $(this).parent('.sticky-wrap');

			$stickyHead.append($thead);

			$stickyCol
			.append($col)
				.find('thead th:gt(0)').remove()
				.end()
				.find('tbody td').remove();

			$stickyInsct.html('<thead><tr><th>'+$t.find('thead th:first-child').html()+'</th></tr></thead>');
			var setWidths = function () {
					$t
					.find('thead th').each(function (i) {
						$stickyHead.find('th').eq(i).width($(this).width());
					})
					.end()
					.find('tr').each(function (i) {
						$stickyCol.find('tr').eq(i).height($(this).height());
					});
					$stickyHead.width($t.width());
					$stickyCol.find('th').add($stickyInsct.find('th')).width($t.find('thead th').width())
				},
				repositionStickyHead = function () {
					var allowance = calcAllowance();
					if($t.height() > $stickyWrap.height()) {
						if($stickyWrap.scrollTop() > 0) {
							$stickyHead.add($stickyInsct).css({
								opacity: 1,
								top: $stickyWrap.scrollTop()
							});
						} else {
							$stickyHead.add($stickyInsct).css({
								opacity: 0,
								top: 0
							});
						}
					} else {
						if($w.scrollTop() > $t.offset().top && $w.scrollTop() < $t.offset().top + $t.outerHeight() - allowance) {
							$stickyHead.add($stickyInsct).css({
								opacity: 1,
								top: $w.scrollTop() - $t.offset().top
							});
						} else {
							$stickyHead.add($stickyInsct).css({
								opacity: 0,
								top: 0
							});
						}
					}
				},
				repositionStickyCol = function () {
					if($stickyWrap.scrollLeft() > 0) {
						$stickyCol.add($stickyInsct).css({
							opacity: 1,
							left: $stickyWrap.scrollLeft()
						});
					} else {
						$stickyCol
						.css({ opacity: 0 })
						.add($stickyInsct).css({ left: 0 });
					}
				},
				calcAllowance = function () {
					var a = 0;
					$t.find('tbody tr:lt(3)').each(function () {
						a += $(this).height();
					});
					if(a > $w.height()*0.25) {
						a = $w.height()*0.25;
					}
					a += $stickyHead.height();
					return a;
				};

			setWidths();

			$t.parent('.sticky-wrap').scroll($.throttle(250, function() {
				repositionStickyHead();
				repositionStickyCol();
			}));

			$w
			.load(setWidths)
			.resize($.debounce(250, function () {
				setWidths();
				repositionStickyHead();
				repositionStickyCol();
			}))
			.scroll($.throttle(250, repositionStickyHead));
		}
	});
});