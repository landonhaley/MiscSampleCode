<script>

// script that works with the Isotope js lib and controls bootstrap


var $containers = [];
jQuery(document).ready(function($) {
	
    var i = 1;
	var $tabs = $('.nav-tabs a');    
    var $container = $('.links-container');
    
    
	$container.each(function() {
		var outerContainerClass = "#"+i+"links-container";

		var $grid = $(outerContainerClass).isotope({
		  // options
		  itemSelector: '.individual-tile-link-container',
		  layoutMode: 'masonry',
		  getSortData: {
			link: '[data-category]', // value of attribute
			deslink: '[data-category]' // value of attribute
		  }
		});
		


		// sort items on button click
		var sortSelectClass = "."+i+"select-sort-by-group";
		
		$(sortSelectClass).on( 'change', function() {
		  var sortByValue = $(sortSelectClass+" option:selected").attr('data-sort-by');
		  
		  $grid.isotope({ 
			  transitionDuration: '0.4s',
			  sortBy: sortByValue,
			  sortAscending: {
				link: true,
				deslink: false
			  }
			}); 
		});
		
		
		var arr = jQuery.makeArray( $tabs );
		
		
		$( '.nav-tabs a' ).on('shown.bs.tab', function(event){
	
			var sortSelectClass = "."+i+"select-sort-by-group";
			$('.select-sort-by-group').val('option_1');
			var sortByValue = $(sortSelectClass+" option:selected").attr('data-sort-by');
			
			$grid.isotope({ 
				transitionDuration: 0,
				sortBy: sortByValue,
				sortAscending: {
					link: true,
					deslink: false
				}
			});
		});
		
		i++;
		
  }); //each

}); //dom ready




</script>
