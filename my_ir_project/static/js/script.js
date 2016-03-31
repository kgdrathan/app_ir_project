$(document).ready(function() {
// everything starts

// set year-range
var slider = document.getElementById('year_range');
noUiSlider.create(slider, {
    start: [1998, 2010],
    connect: true,
    step: 1,
    range: {'min': 1990, 'max': 2016},
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
    return "<a class='modal-trigger collection-item' style='cursor:pointer' data-file='"+file+"'>"+title+"</a>";
}

function insert_div (year) {
	return "<ul class='collection with-header'><li class='collection-header'><h5>"+year+"</h5></li>";
}

$('#b_search').on('click', function() {
	$('#result').empty();
	$('#start_year_second').val($('#start_year').val());
	$('#end_year_second').val($('#end_year').val());
	$('#type_second').val($('#type').val());
	$('#algo_second').val($('#algo').val());
	$('#first').hide();
	$('#second').show();

	var formdata = new FormData();
	formdata.append('file', document.getElementById('f_upload').files[0]);
	formdata.append('start_year', slider.noUiSlider.get()[0]);
	formdata.append('end_year', slider.noUiSlider.get()[1]);

	$.ajax({
		url: 'get_result',
        type: 'POST',
        data: formdata,
        contentType: false,
        processData: false,
        success: function(res) {
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
});

$('.modal-footer a').on('click', function() {
	$('#modal').closeModal();
	$('.lean-overlay').remove();
});

$('#f_upload').on('change', function() {
    var u_file = document.getElementById('f_upload').files[0];
    // var filereader = new FileReader();
    // filereader.readAsText(u_file);
    // var filetext = filereader.result.toString();
    // $('#result').html(filetext);
    $.ajax({
    	url: '/get_title',
    	type: 'POST',
    	data: {'file_name': u_file.name},
    	success: function(res) {
    		$('#f_upload_second').val(res);
    	}
    })
});

$('#second').hide();

// everything ends
});
