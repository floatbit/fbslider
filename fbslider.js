(function($) {

    var methods = {
    
      init : function() {
      
   	   $.each($(this), function(i, item) {
   	   		
        	var $main = $(item);
        	
        	if ($main.data('init') != true) {	
        	
	        	var $controls = $main.find('.control');
		      	var $handle = $main.find('.handle');
		      	var $sets = $main.find('.sets');
		      	var $ul = $main.find('ul');
		      	
						var setWidth = parseFloat($main.css('width'));
		      	var totalSets = $sets.find('.set').length;
		      	var down = false;
		      	var startX = 0;
		      	var direction = 0;
		      	var delta;
		      	var liWidth = parseFloat($ul.find('li.dot:first').css('width'));
		      	var capStartWidth = parseFloat($ul.find('li.cap-start:first').css('width'));
		      	var handleStartX = capStartWidth;
						
						// $sets
						$sets.css('width', totalSets * setWidth);
						
		      	// default data
		      	$main.data('index', 0);
		      	$controls.data('minX', capStartWidth);
		      	$controls.data('maxX', ($ul.find('li').length - 3) * liWidth + capStartWidth);
		      	$controls.css('width', ($ul.find('li').length - 2) * liWidth + capStartWidth * 2);
		      	
		      	// sets swipe left and right
		      	$sets.bind('swipeleft', function(e) {
		      		var nextIndex = $main.data('index') + 1;
		      		if (nextIndex < totalSets) {
		      			$main.data('index', nextIndex);
		      			$main.fbslider('update');
		      		}
		      		e.preventDefault();
		      	});
		      	
		      	$sets.bind('swiperight', function(e) {
		      		var nextIndex = $main.data('index') - 1;
		      		if (nextIndex >= 0) {
		      			$main.data('index', nextIndex);
		      			$main.fbslider('update');
		      		}
		      	});
		      	
		      	// ul li click
		      	$ul.find('li').live('vclick', function(e) {
		      		var index = $(this).index() - 1;
		      		if (index >= 0 && index <= $ul.find('li').length - 3) {
			      		$main.data('index', index);
			      		$main.fbslider('update');
			      	}
			      	
		      		e.preventDefault();
		      	})
		      	
		      	// save info for mouse down
		      	$controls.bind('vmousedown', function(e) {
		      		down = true;
		      		startX = e.pageX;
		      		handleStartX = parseFloat($handle.css('left'));
			      	e.preventDefault();
		      	})
		      	
		      	// cursor is moving so move handle
		      	$controls.bind('vmousemove', function(e) {
		      		if (down == true) {
		      			delta = e.pageX - startX;
		      			var nextX = (handleStartX + delta) < $controls.data('minX') ? $controls.data('minX') : handleStartX + delta;
		      			nextX = nextX > $controls.data('maxX') ? $controls.data('maxX') : nextX;
		      			$handle.css('left', nextX);
		      			var percent = (nextX - capStartWidth) / ($controls.data('maxX') - $controls.data('minX'));
		      			var moveAmount = (totalSets - 1) * setWidth;
		      			$sets.css('left', 0 - percent * moveAmount);
			      	}
			      	e.preventDefault();
		      	})
		      	
		      	// stop movement
		      	$controls.bind('vmouseup', function(e) {
		      		if (down == true) {
			      		var index = (parseFloat($handle.css('left')) - capStartWidth) / liWidth;
			      		index = (delta > 0) ? Math.ceil(index) : Math.floor(index);
			      		$main.data('index', index);
			      		$main.fbslider('update');
			      		down = false;
			      	}
		      	})
		      	
		      	// trigger vmouse up
		      	$controls.bind('vmouseout', function(e) {
		      		$main.trigger('vmouseup');
		      	})
		      	
		      	// don't init again
		      	$main.data('init', true);
		      }
	      	
      	})
      	
      	return $(this);        
      },
      
      // position the sets to the right left value according to index
      update: function() {
				$.each($(this), function(i, item) {
					var $main = $(item);
					var $sets = $main.find('.sets');
					var $handle = $main.find('.handle');
	      	var $sets = $main.find('.sets');
	      	var $ul = $main.find('ul');
					var setWidth = parseFloat($main.css('width'));
					var index = $main.data('index');
	      	var liWidth = parseFloat($ul.find('li.dot:first').css('width'));
	      	var capStartWidth = parseFloat($ul.find('li.cap-start:first').css('width'));
					var snapX = liWidth * index + capStartWidth;
					$sets.animate({left: 0 - setWidth * index}, {duration: 250});
					$handle.animate({left: snapX}, {duration: 50});
				});
			}    
		}
		
    $.fn.fbslider = function(method) {
      
      // method calling logic
      if (methods[method]) {
        return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || ! method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error('Method ' +  method + ' does not exist');
      }    
    
    };
    
})(jQuery);
