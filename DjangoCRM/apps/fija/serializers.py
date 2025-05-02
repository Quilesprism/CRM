from rest_framework import serializers
from apps.fija.models import Venta_fija, Historico_Fija

class FijaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Historico_Fija
        fields = '__all__'
        read_only_fields = ('id_venta',)

class FijaSerializerCreate(serializers.ModelSerializer):
    class Meta:
        model = Venta_fija
        fields = '__all__'
        read_only_fields = ('id_venta',)
      
class FijaSerializerUpdate(serializers.ModelSerializer):
    class Meta:
        model = Venta_fija
        fields = '__all__'
        read_only_fields = ['fecha_registro', 'ultima_modificacion', 'cedula_asesor'] 