from xml.etree import ElementTree
import numpy as np

debug = False

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
	filepath = './LDA/relavant_papers.npy'

	x = np.load(filepath)
	i = 0
	for ele in x:
		if(ele[-12:]==filename):
			return i
		i += 1

def getFilename(docID):

	# filepath for relavant_papers.npy
	filepath = './LDA/relavant_papers.npy'
	x = np.load(filepath)
	return x[docID][-12:]

def main():

	print getTitle(filename="P00-1001.txt")
	print getDocID(filename='W12-3129.txt')
	print getFilename(docID=9913)

if __name__ == '__main__':
	main()