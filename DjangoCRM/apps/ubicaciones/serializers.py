# serializers.py

from rest_framework import serializers
from .models import OperadorLogico

class OperadorLogicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperadorLogico
        fields = '__all__'
