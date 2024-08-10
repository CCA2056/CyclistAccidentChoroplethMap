from django.db import models

# Create your models here.
class SummarizedAccidentData(models.Model):
    postcode = models.IntegerField()
    suburb = models.CharField(max_length=100)
    place_id = models.CharField(max_length=100)
    total = models.IntegerField()
    severity_1 = models.IntegerField()
    severity_2 = models.IntegerField()
    severity_3 = models.IntegerField()
    severity_4 = models.IntegerField()

    class Meta:
        db_table = 'Summarized_Accident_Data_with_Suburb_Info'