$(document).ready(function() {
// everything starts

// set year-range
    var slider = document.getElementById('year_range');
    var FileName="";
    noUiSlider.create(slider, {
        start: [2004, 2010],
        connect: true,
        step: 1,
        range: {'min': 2001, 'max': 2014},
        format: wNumb({
            decimals: 0
        })
    });
    slider.noUiSlider.on('slide', function() {
    	$('#start_year').val(slider.noUiSlider.get()[0]);
    	$('#end_year').val(slider.noUiSlider.get()[1]);
    });
    toastcount = 0;
    $('#start_year').on('change', function() {
    	slider.noUiSlider.set([$(this).val(), slider.noUiSlider.get()[1]]);
    })
    $('#end_year').on('change', function() {
    	slider.noUiSlider.set([slider.noUiSlider.get()[0], $(this).val()]);
    })
    $( "#result_cluster" ).mouseenter(function() {
        if(toastcount==0)
            Materialize.toast('Click on a node to get the cluster information', 8000);
        toastcount++;
    });
    $('select').material_select();

    // function - insert cards
    function insert_card(title, file) {
        return "<a class='modal-trigger collection-item ' style='cursor:pointer' data-file='"+file+"'>"+title+"</a>";
    }
    function insert_card2(title, file,year) {
        var title_year = title + " ("+year+")"
        return "<a class='modal-trigger collection-item ' style='cursor:pointer' data-file='"+file+"'>"+title_year+"</a>";
    }

    function insert_div (year) {
    	return "<ul class='collection with-header'><li class='collection-header'><h5>"+year+"</h5></li>";
    }
    function insert_div2 (file,title) {
        return "<ul class='collection with-header '><li style='cursor:pointer'  id='"+file+"' class='collection-header modal-trigger ' data-file='"+file+"'><h5>"+title+"</h5></li>";
    }
    function ReverseObject(Obj){
        var TempArr = [];
        var NewObj = [];
        for (var Key in Obj){
            TempArr.push(Key);
        }
        for (var i = TempArr.length-1; i >= 0; i--){
            NewObj[TempArr[i]] = [];
        }
        return NewObj;
    }
    
    $('#b_search').on('click', function() {

        if(FileName==""){
            alert("Enter search Query")
            return
        }
        $('#result').empty();
        $('#result_collec').empty();
        $('#result_cluster').empty();

        $('#query').show();
        $('#progress_bar').show();

        var formdata = new FormData();
        // console.log(document.getElementById('f_upload').files[0])
        // formdata.append('file', document.getElementById('f_upload').files[0].name);
    
        
        formdata.append('file', FileName);

        formdata.append('start_year', slider.noUiSlider.get()[0]);
        formdata.append('end_year', slider.noUiSlider.get()[1]);
        var opt1 = $('#search_type :selected').val();
        console.log(opt1)
        if(opt1=="year"){
            $('#desc').hide()
            $.ajax({
                url: 'get_result',
                type: 'POST',
                data: formdata,
                contentType: false,
                processData: false,
                success: function(res) {
                    $('#progress_bar').hide();
                    $('#result').empty();
                    var len = res['title'].length;
                    var year_dict = {};
                    var startt = $('#start_year').val();
                    var endd = $('#end_year').val();
                    for (var i = 2001; i < 2015; i++)
                        year_dict[i] = [];
                    for(var i = 0; i < len; i++) {
                        if (res['year'][i] <= endd && res['year'][i] >= startt)
                            year_dict[res['year'][i]].push([res['title'][i], res['file'][i]]);
                    }
                    
                    // ReverseObject(year_dict)
                    var keys = new Array();

                    for (var k in year_dict) {
                            keys.unshift(k);
                    }
                    // console.log(year_dict);
                    // console.log(keys)
                    for (k in keys) {
                        i = keys[k]
                        if (year_dict[i].length != 0) {
                            var temp = insert_div(i);
                            for(j in year_dict[i]){
                                temp += insert_card(year_dict[i][j][0], year_dict[i][j][1]);
                            }
                            temp += "</ul>";
                            $('#result').append(temp);
                        }
                    }
                    $('.modal-trigger').on('click', function() {
                        $('.lean-overlay').remove();
                        var file_url = '/static/data/ir_term_project/aan/papers_text/' + $(this).data('file');
                        $('.modal-content p').load(file_url);
                        $('#modal').openModal();
                    });
                }
            });
        }
        else if(opt1=="rank" ){
            $('#desc').hide()
            $.ajax({
                url: 'get_result',
                type: 'POST',
                data: formdata,
                contentType: false,
                processData: false,
                success: function(res) {

                    $('#progress_bar').hide();
                    $('#result').empty();
                    console.log("in rank")
                    var len = res['title'].length;
                    var startt = $('#start_year').val();
                    var endd = $('#end_year').val();
                    var temp = "<div class='collection'>";
                    for(var i = 0; i < len; i++) {
                        if (res['year'][i] <= endd && res['year'][i] >= startt)
                            temp += insert_card2(res['title'][i],res['file'][i],res['year'][i]);
                    }
                    temp += "</div>";
                    $('#result').append(temp);
                    
                    $('.modal-trigger').on('click', function() {
                        $('.lean-overlay').remove();
                        var file_url = '/static/data/ir_term_project/aan/papers_text/' + $(this).data('file');
                        $('.modal-content p').load(file_url);
                        $('#modal').openModal();
                    });
                }
            });   
        }
        else if(opt1=="cluster"){
            $('#desc').show()
            $.ajax({
                url: 'get_cluster',
                type: 'POST',
                data: formdata,
                contentType: false,
                processData: false,
                success: function(res) {
                 // console.log(res);
                    $('#progress_bar').hide()
                    show_cluster(res,"cluster_random")
                    var title_arr = res['title']
                    var file_arr = res['file']
                    var cluster_dict = res['clusters'] 
                    for (i in cluster_dict) {

                        var temp = insert_div2(file_arr[i],title_arr[i]);
                        for(j in cluster_dict[i]){
                            temp += insert_card( title_arr[cluster_dict[i][j]],file_arr[cluster_dict[i][j]]);
                        }
                        temp += "</ul>";
                        $('#result_collec').append(temp);
                        
                    }
                    $('.modal-trigger').on('click', function() {
                        $('.lean-overlay').remove();
                        var file_url = '/static/data/ir_term_project/aan/papers_text/' + $(this).data('file');
                        $('.modal-content p').load(file_url);
                        $('#modal').openModal();
                    });
                }
            });
        }
        else if(opt1=="divrank"){
            $('#desc').show()
            $.ajax({
                url: 'get_cluster_div',
                type: 'POST',
                data: formdata,
                contentType: false,
                processData: false,
                success: function(res) {
                 // console.log(res);
                    $('#progress_bar').hide()
                    console.log(res)
                    show_cluster(res,"cluster_div")
                    
                    var title_arr = res['title']
                    var file_arr = res['file']
                    var cluster_dict = res['clusters']
                    for (i in cluster_dict) {

                        var temp = insert_div2(file_arr[i],title_arr[i]);
                        for(j in cluster_dict[i]){
                            temp += insert_card( title_arr[cluster_dict[i][j]],file_arr[cluster_dict[i][j]]);
                        }
                        temp += "</ul>";
                        $('#result_collec').append(temp);
                        
                    }
                    $('.modal-trigger').on('click', function() {
                        $('.lean-overlay').remove();
                        var file_url = '/static/data/ir_term_project/aan/papers_text/' + $(this).data('file');
                        $('.modal-content p').load(file_url);
                        $('#modal').openModal();
                    });
                }
            });

        }
        

    });


    $('#close_bar').on('click',function() {
        $('#txtSearch').val("")
        // body...
    });
    $('.modal-footer a').on('click', function() {
    	$('#modal').closeModal();
    	$('.lean-overlay').remove();
    });

    
    window.searchOpen = $(function() {
        $("#txtSearch").autocomplete({
            source: "get_search",
            minLength: 2,
            select: function(event, ui) {
                event.preventDefault();
                $("#txtSearch").val(ui.item.label);
                FileName = ui.item.value
                console.log(ui.item.label+" ("+FileName+")")
                $('#query').text(ui.item.label+" ("+FileName+")");
                
                $("#query").attr("style",'cursor:pointer');
                $("#query").attr("data-file",FileName);
                $( '#query' ).addClass( 'modal-trigger' );
            },
            focus: function(event, ui) {
                event.preventDefault();
                $("#txtSearch").val(ui.item.label);
            }
        })});

    $('#query').hide();
    $('#desc').hide();
    $('#progress_bar').hide();
    // everything ends
});
