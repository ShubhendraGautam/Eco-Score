(function($) {
    $(function() {
      $(".sidenav").sidenav();
      // Inti slider
  
      $(".slider").slider({
        fullWidth: true,
        indicators: false,
        height: 500
      });
  
      $(".scrollspy").scrollSpy();
    }); // end of document ready
  })(jQuery); // end of jQuery name space
  