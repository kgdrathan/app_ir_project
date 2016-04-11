from django.shortcuts import render
from django.http import HttpResponse
# from django.http import JsonResponse
import backend
import k_medoids
import Queue as Q
import unicodedata
from models import Papers_Title
import json
import numpy as np

def home(request):
    return render(request, 'home.html', {})

def autocompleteModel(request):
    if request.is_ajax():
        q = request.GET.get('term', '')
        
        papers = Papers_Title.objects.filter(titlename__icontains = q )[:20]
        results = []
        for paper in papers:
            paper_json = {}
            paper_json['value'] = paper.filename
            paper_json['label'] = paper.titlename
            results.append(paper_json)
        data = json.dumps(results)
    else:
        data = 'fail'
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)

def get_title(request):
    # u_file = request.POST.get('file_name', False)
    u_file = request.GET['file_name']
    
    title = backend.getTitle(str(u_file));
    
    return HttpResponse(title)

def get_cluster(request):
    # console.log('enter in cluster')
    start_year = request.POST['start_year']
    end_year = request.POST['end_year']
    # you can treat this as file object
    # u_file = request.FILES['file']
    u_file = request.POST['file']

    u_file_id = backend.getDocID(str(u_file))
    topResults_1 = backend.getTopNID(u_file_id, 11)
    topResults_1= np.delete(topResults_1,0)
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


    for i in range(0,10):
        topResults = backend.getTopNID(topResults_1[i],11)
        topResults= np.delete(topResults,0)
        for idx in topResults:
            if idx not in idsArr:
                idsArr.append(idx)
                filename = backend.getFilename(idx)
                titleArr += [backend.getTitle(filename)]
                fileArr += [filename]
                yearArr += [backend.getYear(filename)]

    # for i in range(0,len(fileArr)):
    #     print fileArr[i], " ", titleArr[i]

    with open('cluster.txt','w+') as f1:
        print fileArr
        for ele in fileArr:
            f1.write(str(ele)+'\n')

    print idsArr

    tp_icp_docs = backend.get_doc_vec(idsArr)
    clusters  = k_medoids.k_mediod_util(tp_icp_docs)
    print "medads:",clusters
    res = { 'file': fileArr,'year': yearArr,'title':titleArr,'clusters':clusters}
    
    return HttpResponse(json.dumps(res), content_type = "application/json")

def get_cluster_div(request):
    start_year = request.POST['start_year']
    end_year = request.POST['end_year']
    u_file = request.POST['file']
    fileArr = {}
    titleArr = {}
    yearArr = {}
    idsArr = []
    clusters = backend.getDivClusters(str(u_file))
    print clusters
    for i in clusters:
        filename = backend.getFilename(i)
        fileArr[i] = filename
        titleArr[i] = backend.getTitle(filename)
        yearArr[i] = backend.getYear(filename)
        for j in clusters[i]:
            filename = backend.getFilename(j)
            fileArr[j] = filename
            titleArr[j] = backend.getTitle(filename)
            yearArr[j] = backend.getYear(filename)
    print 'div_cla',fileArr
    with open('./divcluster.txt','w+') as f1:
        for i in fileArr:
            f1.write(str(fileArr[i])+'\n')


    res = { 'file': fileArr,'year': yearArr,'title':titleArr,'clusters':clusters}   

    return HttpResponse(json.dumps(res), content_type = "application/json")

def get_json_random(request):
    with open("./data_mediod.json") as json_file:
        json_data = json.load(json_file)
    # return JsonResponse(list(json_data), safe=False)
    return HttpResponse(json.dumps(json_data), content_type = "application/json") 

def get_json_div(request):
    with open("./data_div.json") as json_file:
        json_data = json.load(json_file)
    # return JsonResponse(list(json_data), safe=False)
    return HttpResponse(json.dumps(json_data), content_type = "application/json") 


def get_result(request):
    start_year = request.POST['start_year']
    end_year = request.POST['end_year']
    # you can treat this as file object
    print end_year
    u_file = request.POST['file']
    # u_file = request.FILES['file']
    print u_file
    u_file_id = backend.getDocID(str(u_file))
    topResults = backend.getTopNID(u_file_id, 30)
    topResults= np.delete(topResults,0)
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

def get_result_div(request):
    start_year = request.POST['start_year']
    end_year = request.POST['end_year']
    # you can treat this as file object
    u_file = request.POST['file']

    u_file_id = backend.getDocID(str(u_file))
    topResults = backend.getTopNID_DIV(u_file_id, 30)
    topResults = np.delete(topResults,0)
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

