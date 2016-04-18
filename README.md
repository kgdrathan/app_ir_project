# ACL TimeLine Retrieval 

Timeline retrieval of academic papers from ACL Anthology collection


## References


* [LDA Model for Topic Modelling](https://www.cs.princeton.edu/~blei/topicmodeling.html)
* [HDP Model for Topic Modelling](www.cs.berkeley.edu/~jordan/papers/hdp.pdf)
* [ACL Dataset](http://clair.eecs.umich.edu/aan/index.php)
* [Analyzing NLP Research over time](http://www.aclweb.org/anthology/D15-1235)
* [Random Walk with restart](http://repository.cmu.edu/cgi/viewcontent.cgi?article=1533&context=compsci)
* [DivRank](dl.acm.org/ft_gateway.cfm?id=1835931)

## Slides for Presentation

* [Slides] (https://docs.google.com/presentation/d/1oJz0S1t27yeFW5U0F750fuiW3Oh97I41tP352O_HgQ0/edit?usp=sharing)


## Instructions to use


### TP - ICP
* run ```python doc_tp.py``` to get all the topics and get topic proportions. This will create ```doc_tp_scores.npy``` object.
* run ```python doc_tp_icp.py``` to get TP-ICP scores for all the documents. This will create ```ICP.npy``` and ```TP_ICP_DOC.npy``` object.

### Document Similarity
* run ```python doc_similarity.py``` to get similarity between documents. This will create ```DOC_SIMILARITY.npy``` object.
* run ```python doc_similarity_normalised.py``` to get similarity between documents. This will create ```DOC_SIMILARITY_NORMALIZED.npy``` object.

### Random Walk with restarts
* run ```python random_walk_parallel.py``` to get similarity between documents. This will create 9916 numpy objects based on random walk being started from each node.

### Running the Web Application
* run ```python manage.py runserver 0:8000``` to start the server. Open your browser and goto ```127.0.0.1:8000```


## Requirements


* [NumPy](www.numpy.org)
* [Django](https://www.djangoproject.com)

### Sample Screenshots
#### 
![showcase1](https://github.com/kgdrathan/app_ir_project/blob/master/images/s1.png)
#### Ranked retrieval
![showcase2](https://github.com/kgdrathan/app_ir_project/blob/master/images/s2.png)

#### Year-wise Reterival
![showcase3](https://github.com/kgdrathan/app_ir_project/blob/master/images/s3.png)
#### Clustered Reterival
![showcase1](https://github.com/kgdrathan/app_ir_project/blob/master/images/s4.png)


