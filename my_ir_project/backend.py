from xml.etree import ElementTree
import numpy as np
import os
import MySQLdb as mdb
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
print BASE_DIR
import json

debug = False
aan_filepath = BASE_DIR + '/my_ir_project/static/data/ir_term_project/aan/'

db = mdb.connect('localhost','root','1234asdf','titles')    
cur = db.cursor()

def getTitle(filename):

    sql = "select titlename from title where filename = '"+filename+"';"
    cur.execute(sql)
    title = ""
    for (filename) in cur:
        title = filename[0]
    return title

# def getTitle(filename):

    # filepath for xml file containing the metadata, files are in aclxml folder
    filepath = './aclxml/' + filename[0] + '/' + filename[0:3] + '/' + filename[0:3] + '.xml'
    document = ElementTree.parse(filepath)

    for paper in document.findall( 'paper' ):        
        if(paper.attrib['id'] == filename[4:-4]):
            for node in paper.getchildren():
                if node.tag == 'title':
                    return node.text

def getDocID(filename):
    # filepath for relavant_papers.npy
    filepath = aan_filepath + 'LDA/relavant_papers.npy'
    x = np.load(filepath)
    i = 0
    for ele in x:
        if(ele[-12:]==filename):
            return i
        i += 1
def getTop(row, type, k):

    if type==1:
        filepath = aan_filepath + "LDA/final/output/DIV_RANK_ROW_" + str(row) + ".npy"
    else:
        filepath = aan_filepath + "LDA/final/output/DIV_RANK_ROW_" + str(row) + ".npy"

    x = np.load(filepath)
    
    y = x.tolist()
    z = sorted(range(len(y)), key=lambda l: y[l])[-k:]
    z = z[:-1]
    z = z[::-1]
    return z

def get_doc_vec(idsArr):
    filepath = aan_filepath + 'LDA/TP_ICP_DOC.npy'
    x = np.load(filepath)
    tp_icp_docs=[]
    for ele in idsArr:
        tp_icp_docs.append(x[ele])
    return tp_icp_docs


def getFilename(docID):

    # filepath for relavant_papers.npy
    filepath = aan_filepath + 'LDA/relavant_papers.npy'
    x = np.load(filepath)
    return x[docID][-12:]

def getTopNID(docID, N = 30):

    #filepath for random walk row
    filepath = aan_filepath + "LDA/final/output/RANDOM_WALK_ROW_" + str(docID) + ".npy"
    x = np.load(filepath)
    x = x.reshape((9916))
    return x.argsort()[-N:][::-1]

def getTopNID_DIV(docID, N = 30):

    #filepath for random walk row
    
    filepath = aan_filepath + "LDA/final/output/DIV_RANK_ROW_" + str(docID) + ".npy"
    x = np.load(filepath)
    x = x.reshape((9916))
    return x.argsort()[-N:][::-1]

def getDivClusters(filename):

    # 5 clusters, top 5 of div_rank
    z = getTop(getDocID(filename), 1, 6)
    
    l1 = []
    l2 = []
    l3 = []
    l4 = []
    l5 = []

    l1 = getTop(z[0], 0, 12)
    l2 = getTop(z[1], 0, 17)
    l3 = getTop(z[2], 0, 22)
    l4 = getTop(z[3], 0, 27)
    l5 = getTop(z[4], 0, 32)

    increment = []
    for ele in z:
        increment.append(ele)

    increment.append(getDocID(filename))

    # preparing l1
    temp = []
    for ele in l1:
        if ele not in increment:
            temp.append(ele)
            increment.append(ele)
        if len(temp) == 5:
            break
    l1 = temp

    # preparing l2
    temp = []
    for ele in l2:
        if ele not in increment:
            temp.append(ele)
            increment.append(ele)
        if len(temp) == 5:
            break
    l2 = temp

    # preparing l3
    temp = []
    for ele in l3:
        if ele not in increment:
            temp.append(ele)
            increment.append(ele)
        if len(temp) == 5:
            break
    l3 = temp


    # preparing l4
    temp = []
    for ele in l4:
        if ele not in increment:
            temp.append(ele)
            increment.append(ele)
        if len(temp) == 5:
            break
    l4 = temp

    # preparing l5
    temp = []
    for ele in l5:
        if ele not in increment:
            temp.append(ele)
            increment.append(ele)
        if len(temp) == 5:
            break
    l5 = temp



    dicter = {}
    dicter["nodes"] = []
    dicter["links"] = []

    # adding nodes and edges
    temp_dict = {}
    temp_dict["name"] = 10000
    temp_dict["group"] = 10000
    dicter["nodes"].append(temp_dict)

    i = 1
    for ele in z:
        temp_dict = {}
        temp_dict["name"] = ele
        temp_dict["group"] = ele
        dicter["nodes"].append(temp_dict)

        temp_dict = {}
        temp_dict["source"] = 0
        temp_dict["target"] = i
        temp_dict["value"] = 8
        dicter["links"].append(temp_dict)
        i += 1

    # adding l1 nodes and edges
    for ele in l1:
        temp_dict = {}
        temp_dict["name"] = ele
        temp_dict["group"] = z[0]
        dicter["nodes"].append(temp_dict)

        temp_dict = {}
        temp_dict["source"] = 1
        temp_dict["target"] = i
        temp_dict["value"] = 8
        dicter["links"].append(temp_dict)
        i += 1

    # adding l2 nodes and edges
    for ele in l2:
        temp_dict = {}
        temp_dict["name"] = ele
        temp_dict["group"] = z[1]
        dicter["nodes"].append(temp_dict)

        temp_dict = {}
        temp_dict["source"] = 2
        temp_dict["target"] = i
        temp_dict["value"] = 8
        dicter["links"].append(temp_dict)
        i += 1

    # adding l3 nodes and edges
    for ele in l3:
        temp_dict = {}
        temp_dict["name"] = ele
        temp_dict["group"] = z[2]
        dicter["nodes"].append(temp_dict)

        temp_dict = {}
        temp_dict["source"] = 3
        temp_dict["target"] = i
        temp_dict["value"] = 8
        dicter["links"].append(temp_dict)
        i += 1

    # adding l4 nodes and edges
    for ele in l4:
        temp_dict = {}
        temp_dict["name"] = ele
        temp_dict["group"] = z[3]
        dicter["nodes"].append(temp_dict)

        temp_dict = {}
        temp_dict["source"] = 4
        temp_dict["target"] = i
        temp_dict["value"] = 8
        dicter["links"].append(temp_dict)
        i += 1

    # adding l5 nodes and edges
    for ele in l5:
        temp_dict = {}
        temp_dict["name"] = ele
        temp_dict["group"] = z[4]
        dicter["nodes"].append(temp_dict)

        temp_dict = {}
        temp_dict["source"] = 5
        temp_dict["target"] = i
        temp_dict["value"] = 8
        dicter["links"].append(temp_dict)
        i += 1

    with open('./data_div.json','w') as f:
        json.dump(dicter, f)

    dicter = {} 
    for ele in z:
        dicter[ele] = []

    for ele in l1:
        dicter[z[0]].append(ele)

    for ele in l2:
        dicter[z[1]].append(ele)

    for ele in l3:
        dicter[z[2]].append(ele)

    for ele in l4:
        dicter[z[3]].append(ele)

    for ele in l5:
        dicter[z[4]].append(ele)

    return dicter

def getYear(filename):

    y = filename[1:3]
    if int(y) > 16:
        return int("19" + y)
    return int("20" + y)

