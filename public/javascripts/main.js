

var myLayout;

$(document).ready(function () {

    // this layout could be created with NO OPTIONS - but showing some here just as a sample...
    // myLayout = $('body').layout(); -- syntax with No Options

    myLayout = $('body').layout({

        //	reference only - these options are NOT required because 'true' is the default
        closable: true	// pane can open & close
        , resizable: true	// when open, pane can be resized
        , slidable: true	// when closed, pane can 'slide' open over other panes - closes on mouse-out
        , livePaneResizing: true

        //	some resizing/toggling settings
        , north__slidable: false	// OVERRIDE the pane-default of 'slidable=true'
        , north__togglerLength_closed: '100%'	// toggle-button is full-width of resizer-bar
        , north__spacing_closed: 20		// big resizer-bar when open (zero height)
        , south__resizable: true	// OVERRIDE the pane-default of 'resizable=true'
        , south__spacing_open: 0		// no resizer-bar when open (zero height)
        , south__spacing_closed: 20		// big resizer-bar when open (zero height)

        //	some pane-size settings
        // , west__minSize: 100
        // , east__size: 350
        // , east__minSize: 200
        , east__maxSize: .5 // 50% of layout width
        // , center__minWidth: 100


        , center__minHeight:				200





        //	enable showOverflow on west-pane so CSS popups will overlap north pane
        , west__showOverflowOnHover: true

        //	enable state management
        , stateManagement__enabled: true // automatic cookie load & save enabled by default

        , showDebugMessages: true // log and/or display messages from debugging & testing code


        /////ADDED THIS TO HOLD INITIAL SIZE....THIS WILL MESS UP THE DISPLAY IF WINDOW IS RESIZED
        // , west__size: 350


    });


    $('.ui-layout-east').layout({


        /////ADDED THIS TO HOLD INITIAL SIZE....
        south__size: 250



    });




    $(".url1").click(function (e) {

      //PREVENT URL FROM LOADING
    e.preventDefault();

        ///LOAD PAGE IN CENTER PANE
    var value = $(this).attr("href");
    $("#level_0_center").html('<object width="100%"  height="100%" data="https://en.wikipedia.org/wiki/India"/ >');




    // ALSO SHOW THE WEBPAGE IN LEVEL1_CENTER FOR TESTING

        $.get('/testing',function (data) {

            $("#level_1_center").html(data);
        })


});





});






// $(".url1").click(function (e) {
//
//     e.preventDefault();
//
//     var value = $(this).attr("href");
//     //alert(value);
//
//     $("#level_0_center").html('<object width="100%"  height="100%" data="https://en.wikipedia.org/wiki/India"/ >')
//
//
//
// });

