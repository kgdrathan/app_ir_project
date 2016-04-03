$(document).ready(function() {
// everything starts

// set year-range
    var slider = document.getElementById('year_range');
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

    $('#start_year').on('change', function() {
    	slider.noUiSlider.set([$(this).val(), slider.noUiSlider.get()[1]]);
    })
    $('#end_year').on('change', function() {
    	slider.noUiSlider.set([slider.noUiSlider.get()[0], $(this).val()]);
    })

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
        return "<ul class='collection with-header'><li style='cursor:pointer' class='collection-header modal-trigger' data-file='"+file+"'><h5>"+title+"</h5></li>";
    }

    $('#b_search').on('click', function() {
    	$('#result').empty();
    	$('#start_year_second').val($('#start_year').val());
    	$('#end_year_second').val($('#end_year').val());
        console.log($('#type_second').val())
    	// $('#type_second').val($('#type_first').val());
    	// $('#algo_second').val($('#algo_first').val());
     //    $('#sort_second').val($('#sort_first').val());

    	$('#first').hide();
    	$('#second').show();
        $('#query').show();
        $('#progress_bar').show();

    	var formdata = new FormData();
    	formdata.append('file', document.getElementById('f_upload').files[0]);
    	formdata.append('start_year', slider.noUiSlider.get()[0]);
    	formdata.append('end_year', slider.noUiSlider.get()[1]);
        var opt1 = $('#type_first :selected').val();
        var opt3 = $('#sort_first :selected').val();
        if(opt1=="basic" && opt3=="year"){
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
                	var startt = $('#start_year_second').val();
                	var endd = $('#end_year_second').val();
                	for (var i = 2001; i < 2015; i++)
                		year_dict[i] = [];
                	for(var i = 0; i < len; i++) {
                		if (res['year'][i] <= endd && res['year'][i] >= startt)
                			year_dict[res['year'][i]].push([res['title'][i], res['file'][i]]);
                	}
                	console.log(year_dict);
                	for (i in year_dict) {
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
        else if(opt1=="basic" && opt3=="rank"){
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
                    var startt = $('#start_year_second').val();
                    var endd = $('#end_year_second').val();
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
            $.ajax({
                url: 'get_cluster',
                type: 'POST',
                data: formdata,
                contentType: false,
                processData: false,
                success: function(res) {
                 // console.log(res);
                    $('#progress_bar').hide()
                    show_cluster()
                    var title_arr = res['title']
                    var file_arr = res['file']
                    var cluster_dict = res['clusters'] 
                    for (i in cluster_dict) {

                        var temp = insert_div2(file_arr[i],title_arr[i]);
                        for(j in cluster_dict[i]){
                            temp += insert_card( title_arr[cluster_dict[i][j]],file_arr[cluster_dict[i][j]]);
                        }
                        temp += "</ul>";
                        $('#result2').append(temp);
                        
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
    $('#b_search_second').on('click', function() {
        $('#result').empty();
        $('#result2').empty();
        $('#progress_bar').show();
        var formdata = new FormData();
        formdata.append('file', document.getElementById('f_upload').files[0]);
        formdata.append('start_year', $('#start_year_second').val());
        formdata.append('end_year', $('#end_year_second').val());

        var opt1 = $('#type_second :selected').val();
        var opt3 = $('#sort_second :selected').val();
        console.log(opt3)
        if(opt1=="basic" && opt3=="year"){
            
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
                    var startt = $('#start_year_second').val();
                    var endd = $('#end_year_second').val();
                    for (var i = 2001; i < 2015; i++)
                        year_dict[i] = [];
                    for(var i = 0; i < len; i++) {
                        if (res['year'][i] <= endd && res['year'][i] >= startt)
                            year_dict[res['year'][i]].push([res['title'][i], res['file'][i]]);
                    }
                    console.log(year_dict);
                    for (i in year_dict) {
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
        else if(opt1=="basic" && opt3=="rank"){
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
                    var startt = $('#start_year_second').val();
                    var endd = $('#end_year_second').val();
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

            $.ajax({
                url: 'get_cluster',
                type: 'POST',
                data: formdata,
                contentType: false,
                processData: false,
                success: function(res) {
                 // console.log(res);
                    $('#progress_bar').hide()
                    show_cluster()
                    var title_arr = res['title']
                    var file_arr = res['file']
                    var cluster_dict = res['clusters'] 

                    for (i in cluster_dict) {

                        var temp = insert_div2(file_arr[i],title_arr[i]);
                        for(j in cluster_dict[i]){
                            temp += insert_card( title_arr[cluster_dict[i][j]],file_arr[cluster_dict[i][j]]);
                        }
                        temp += "</ul>";
                        $('#result2').append(temp);
                        
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

    $('.modal-footer a').on('click', function() {
    	$('#modal').closeModal();
    	$('.lean-overlay').remove();
    });

    $('#back').on('click', function(){
        $('#result').empty();
        $('#first').show();
        $('#second').hide();
    })
    $('#f_upload').on('change', function() {
        var u_file = document.getElementById('f_upload').files[0];
        $('#f_upload_second').val(u_file.name);
        // var filereader = new FileReader();
        // filereader.readAsText(u_file);
        // var filetext = filereader.result.toString();
        // $('#result').html(filetext);
        var file_name = u_file.name;
        console.log(file_name)
        $.ajax({
        	url: 'get_title',
        	type: 'GET',
        	data: {"file_name": file_name},
        	success: function(res) {
                console.log(res)
        		$('#query').text(res);
        	}
        })
    });

    $('#second').hide();
    $('#query').hide();
    $('#progress_bar').hide();
    // everything ends
});
