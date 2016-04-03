from django.shortcuts import render
from django.http import HttpResponse
# from django.http import JsonResponse
import backend
import k_medoids
import Queue as Q
import json
import unicodedata

def home(request):
    return render(request, 'home.html', {})

def get_title(request):
    # u_file = request.POST.get('file_name', False)
    u_file = request.GET['file_name']
    print u_file
    title = backend.getTitle(str(u_file));
    print title
    return HttpResponse(title)

def get_cluster(request):
    # console.log('enter in cluster')
    start_year = request.POST['start_year']
    end_year = request.POST['end_year']
    # you can treat this as file object
    u_file = request.FILES['file']

    u_file_id = backend.getDocID(str(u_file))
    topResults_1 = backend.getTopNID(u_file_id, 5)
    topResults = topResults_1
    print topResults
    titleArr = []
    fileArr = []
    yearArr = []
    idsArr = []
    i = 0
    q = Q.Queue()
    for idx in topResults:
        idsArr.append(idx)
        q.put(idx)
        filename = backend.getFilename(idx)
        titleArr += [backend.getTitle(filename)]
        fileArr += [filename]
        yearArr += [backend.getYear(filename)]


    while not q.empty():
        if len(idsArr)==30:
            break
        id1 = q.get()
        print id1
        topResults = backend.getTopNID(id1,5)
        for idx in topResults:
            print idx
            if idx not in idsArr:
                print "id is ", idx
                q.put(idx)
                idsArr.append(idx)
                filename = backend.getFilename(idx)
                titleArr += [backend.getTitle(filename)]
                fileArr += [filename]
                yearArr += [backend.getYear(filename)]


    # for i in range(0,5):
    #     topResults = backend.getTopNID(topResults_1[i],5)
    #     for idx in topResults:
    #         if idx not in idsArr:
    #             idsArr.append(idx)
    #             filename = backend.getFilename(idx)
    #             titleArr += [backend.getTitle(filename)]
    #             fileArr += [filename]
    #             yearArr += [backend.getYear(filename)]
    for i in range(0,len(fileArr)):
        print fileArr[i], " ", titleArr[i]

    tp_icp_docs = backend.get_doc_vec(idsArr)
    clusters  = k_medoids.k_mediod_util(tp_icp_docs)
    print "medads:",clusters
    res = { 'file': fileArr,'year': yearArr,'title':titleArr,'clusters':clusters}
    
    return HttpResponse(json.dumps(res), content_type = "application/json")

def get_json(request):
    with open("./data.json") as json_file:
        json_data = json.load(json_file)
    # return JsonResponse(list(json_data), safe=False)
    return HttpResponse(json.dumps(json_data), content_type = "application/json") 

def get_result(request):
    start_year = request.POST['start_year']
    end_year = request.POST['end_year']
    # you can treat this as file object
    u_file = request.FILES['file']

    u_file_id = backend.getDocID(str(u_file))
    topResults = backend.getTopNID(u_file_id, 30)

    titleArr = []
    fileArr = []
    yearArr = []
    try:
        for idx in topResults:
            filename = backend.getFilename(idx)
            titleArr += [backend.getTitle(filename)]
            fileArr += [filename]
            yearArr += [backend.getYear(filename)]
    except Exception, e:
        print e

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
