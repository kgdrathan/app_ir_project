from django.shortcuts import render
from django.http import HttpResponse

import json

def home(request):
    return render(request, 'home.html', {})

def get_result(request):
	start_year = request.POST['start_year']
	end_year = request.POST['end_year']
	# you can treat this as file object
	u_file = request.FILES['file']
        print u_file

	# do whatever you want :)

	res = {'title': ['Machine Translation of Very Close Languages',
					  'Cross-Language Multimedia Information Retrieval',
					  'A Dialogue-Based System for Identifying Parts for Medical Systems',
					  'BusTUC - A Natural Language Bus Route Oracle'],
		   'file': ['A00-1002.txt', 'A00-1003.txt', 'A00-1005.txt', 'A00-1001.txt'],
		   'year': [1995, 2015, 2000, 2000]}
	return HttpResponse(json.dumps(res), content_type = "application/json")
