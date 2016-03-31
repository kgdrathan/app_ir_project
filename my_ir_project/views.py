from django.shortcuts import render
from django.http import HttpResponse
import backend

import json

def home(request):
    return render(request, 'home.html', {})

def get_result(request):
    print "start"
    start_year = request.POST['start_year']
    end_year = request.POST['end_year']
    # you can treat this as file object
    u_file = request.FILES['file']
    print str(u_file)
    
    # u_file = "A00-1002.txt"
    u_file_id = backend.getDocID(str(u_file))
    topResults = backend.getTopNID(u_file_id, 30)
    print len(topResults)

    titleArr = []
    fileArr = []
    yearArr = []
    print 'hi, sunny'
    try:
        for idx in topResults:
            filename = backend.getFilename(idx)
            titleArr += [backend.getTitle(filename)]
            fileArr += [filename]
            yearArr += [backend.getYear(filename)]
    except Exception, e:
        print e

    print titleArr
    print fileArr
    print yearArr
    res = {'title': titleArr,
            'file': fileArr,
            'year': yearArr}

    # do whatever you want :)

    # res = {'title': ['Machine Translation of Very Close Languages',
    #                   'Cross-Language Multimedia Information Retrieval',
    #                   'A Dialogue-Based System for Identifying Parts for Medical Systems',
    #                   'BusTUC - A Natural Language Bus Route Oracle'],
    #        'file': ['A00-1002.txt', 'A00-1003.txt', 'A00-1005.txt', 'A00-1001.txt'],
    #        'year': [1995, 2015, 2000, 2000]}
    return HttpResponse(json.dumps(res), content_type = "application/json")
