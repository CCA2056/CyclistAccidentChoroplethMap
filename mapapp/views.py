from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from .models import SummarizedAccidentData

def accident_data(request):
    data = SummarizedAccidentData.objects.all().values()
    return JsonResponse(list(data), safe=False)

def accident_map(request):
    return render(request, 'AccidentMap.html')