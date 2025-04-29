# urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('departamentos/', views.get_departamentos, name='get_departamentos'),
    path('departamentos/<str:departamento>/ciudades/', views.get_ciudades_por_departamento, name='get_ciudades_por_departamento'),
]
