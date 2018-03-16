

// var myLayout;

$(document).ready(function () {

    // this layout could be created with NO OPTIONS - but showing some here just as a sample...
    // myLayout = $('body').layout(); -- syntax with No Options

    $('body').layout({



        closable: true	// pane can open & close

        // , resizable: true	// when open, pane can be resized
        // , slidable: true	// when closed, pane can 'slide' open over other panes - closes on mouse-out
        // , livePaneResizing: true

        //	some resizing/toggling settings
        // , north__slidable: false	// OVERRIDE the pane-default of 'slidable=true'
        //
        // , north__togglerLength_closed: '100%'	// toggle-button is full-width of resizer-bar
        // , north__spacing_closed: 20		// big resizer-bar when open (zero height)
        // , south__resizable: true	// OVERRIDE the pane-default of 'resizable=true'
        // , south__spacing_open: 0		// no resizer-bar when open (zero height)
        // , south__spacing_closed: 20		// big resizer-bar when open (zero height)

        //	some pane-size settings
        // , west__minSize: 100
        // , east__size: 350
        // , east__minSize: 200
        // , center__minWidth: 100



        , east__maxSize: .5 // 50% of layout width
        // , center__minHeight:				200









        //	enable showOverflow on west-pane so CSS popups will overlap north pane
        // , west__showOverflowOnHover: true

        //	enable state management
        , stateManagement__enabled: true // automatic cookie load & save enabled by default

        , showDebugMessages: true // log and/or display messages from debugging & testing code




    });




    $('.ui-layout-east').layout({


        /////ADDED THIS TO HOLD INITIAL SIZE....
        // south__size: 250
        // center__minHeight:				500



    });








    //OPERATION ON SEARCH BAR...ENTER WILL SEARCH WIKIPEDIA
    // capturing the search results after the end user presses (and releases) the ENTER button (keycode 13),
    $('#search_input').on('keyup', function(e){


        if(e.keyCode === 13) {

            //simulate search_button press
            search_wiki();

        };
    });









});










function search_wiki() {

    //obtain search string
    var search_string = $('#search_input').val();

    //reset search field
    $('#search_input').val('');




    var url =   "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
                search_string +
                "&formal=json&callback=?" ;


console.log(url);

    //clearout previous search result
    $('#search_result').html('');


    $.ajax({

        type:"GET",
        url:url,
        // async:true,
        dataType:"json",
        success: function(data){



            //if no search result is returned
            if(data[1].length == 0){

                $("#search_result").html("no data found");
            }

            for(var i=0;i<data[1].length;i++){

                var result_url = data[3][i];

                $("#search_result").append(
                  "<li><a class = 'url1' href= " + data[3][i] + ">" +
                  data[1][i] +
                    "</a>"

                    // +"<p></p>"
                    // +"</li>"

                  + "</a><p>"+
                  data[2][i]+
                  "</p></li>"

                );

            }


            //if url is clicked on west pane
            $(".url1").click(function (e) {

                //PREVENT URL FROM LOADING
                e.preventDefault();

                ///LOAD PAGE IN CENTER PANE
                var value = $(this).attr("href");


                $("#level_0_center").html('<object width="100%"  height="100%" data=' +value+ '>');




                // ALSO SHOW THE WEBPAGE IN LEVEL1_CENTER FOR TESTING

                var parameter = { url: value };
                $.get('/get_toc_data',parameter,function (data) {


                    //// a static html page will be loaded. that static page will use the dynamic json data created by get_toc_data.js
                    // $("#level_1_center").html('<object width="100%"  height="100%" data=\"/D3/d3.html\">');

                    // console.log(data);

                    // $("#level_1_center").html('<object width="100%"  height="100%" data=\"/D3/d3.html\">');
                    $("#level_1_center").html(data);

                    //have control over the east center pane
                    // $("#level_1_center").click(function () {
                    //
                    //     alert('help');
                    //
                    // });

                })



                //also show in url pane
                $('#level_1_south').html(value);


            });



        },
        error: function(error) {

            alert(error);
        }
    });



}



