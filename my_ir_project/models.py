from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Papers_Title(models.Model):

	# id = models.AutoField(primary_key=True)
	filename = models.CharField(max_length=50,primary_key=True)
	titlename = models.CharField(max_length=500)
	class Meta:
		db_table = 'title'
	
	def __unicode__(self):
		return self.filename