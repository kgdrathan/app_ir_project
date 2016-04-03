from xml.etree import ElementTree
import numpy as np
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
print BASE_DIR

debug = False
aan_filepath = BASE_DIR + '/my_ir_project/static/data/ir_term_project/aan/'

def getTitle(filename):

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

def getYear(filename):

    y = filename[1:3]
    if int(y) > 16:
        return int("19" + y)
    return int("20" + y)


# def main():

#     # print getTitle(filename="P00-1001.txt")
#     # print getDocID(filename='W12-3129.txt')
#     # print getFilename(docID=9913)

# if __name__ == '__main__':
#     main()