# models.py

from django.db import models

class OperadorLogico(models.Model):
    id_departamento = models.IntegerField(primary_key=True)
    departamento = models.CharField(max_length=100)
    ciudad = models.CharField(max_length=100)
    operador = models.CharField(max_length=100)
    ventana_cambio = models.CharField(max_length=100)
    dias = models.CharField(max_length=100)

    class Meta:
        db_table = 'operador_logico'

    def __str__(self):
        return f"{self.departamento} - {self.ciudad}"
