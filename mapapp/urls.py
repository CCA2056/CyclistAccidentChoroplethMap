from django.urls import path
from . import views

urlpatterns = [
    path('api/accident-data/', views.accident_data, name='accident_data'),
    #path('accident-map/', views.accident_map, name='accident_map'),
    path('map/', views.accident_map, name='accident_map'), 
    path('', views.accident_map, name='accident_map'), 
]
