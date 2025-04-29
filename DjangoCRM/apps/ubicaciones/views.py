# views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import OperadorLogico

@api_view(['GET'])
def get_departamentos(request):
    departamentos = OperadorLogico.objects.values_list('departamento', flat=True).distinct()
    return Response(sorted(departamentos))

@api_view(['GET'])
def get_ciudades_por_departamento(request, departamento):
    ciudades = OperadorLogico.objects.filter(departamento=departamento).values_list('ciudad', flat=True).distinct()
    return Response(sorted(ciudades))
