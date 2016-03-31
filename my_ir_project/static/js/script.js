$(document).ready(function() {
// everything starts

var years = new Array(25)
			    .join().split(',')
			    .map(function(item, index){ return ++index + 1990;});
var count = new Array(25);

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
	slider.noUiSlider.get()[0];
})
$('#end_year').on('change', function() {
	slider.noUiSlider.get()[0];
})

$('select').material_select();

// function - insert cards
function insert_card(title, file) {
    var data = "<div class='col s12 m6'>\
                    <div class='card grey darken-1'>\
                        <div class='card-content white-text'>\
                            <span>"+title+"</span>\
                        </div>\
                        <div class='card-action'>\
                            <a class='modal-trigger' href='#modal' data-file='"+file+"'>Open</a>\
                        </div>\
                    </div>\
                </div>";
    $('#result').append(data);
    $('.modal-trigger').on('click', function() {
		var file_url = '/static/data/' + $(this).data('file');
		$('.modal-content p').load(file_url);
		$('#modal').openModal();
	});
}

function create_graph(){
    var chart = new Highcharts.Chart({
    	chart: {
            renderTo: 'graph-content'
        },
        title: {
            text: 'Papers in a Year'
        },
        xAxis: {
            categories: years
        },
        yAxis: {
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        series: [{
            name: 'documents',
            data: count
        }]
    });
}

$('#b_search').on('click', function() {
	$('#result').empty();

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
        	for(var i = 0; i < len; i++)
        		insert_card(res['title'][i], res['file'][i]);
        	count = new Array(25);
        	for(var i = 0; i < len; i++)
        		count[res['year'][i]-1991]++;
        }
    });
});

$('#b_graph').on('click', function() {
	console.log(years);
	console.log(count);
	create_graph();
	count = new Array(25);
    $('#graph_modal').openModal();
});

$('.modal-footer a').on('click', function() {
	$('#modal').closeModal();
	$('.lean-overlay').hide();
});

$('#f_upload').on('change', function() {
    var u_file = document.getElementById('f_upload').files[0];
    var filereader = new FileReader();
    filereader.readAsText(u_file);
    var filetext = filereader.result.toString();
    console.log(filetext);
    $('#result').html(filetext);
});

$('#b_graph').hide();

// everything ends
});
