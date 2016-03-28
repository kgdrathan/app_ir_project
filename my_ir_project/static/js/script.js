$(document).ready(function() {
// everything starts

// set year-range
var slider = document.getElementById('year-range');
noUiSlider.create(slider, {
    start: [1998, 2010],
    connect: true,
    step: 1,
    range: {'min': 1990, 'max': 2016},
    format: wNumb({
        decimals: 0
    })
});

// function - insert cards
function insert_card(title, file) {
    var data = "<div class='col s12 m6'>\
                    <div class='card blue-grey darken-1'>\
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
        	var len = res['title'].length;
        	for(var i = 0; i < len; i++)
        		insert_card(res['title'][i], res['file'][i]);
        }
    });
});

$('.modal-footer a').on('click', function() {
	$('#modal').closeModal();
	$('.lean-overlay').hide();
});

// everything ends
});
