from .base import *

DEBUG = True
ALLOWED_HOSTS = ['*']
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'claro_claro2',  
        'USER': 'root', 
        'PASSWORD': '',  
        'HOST': 'localhost',  
        'PORT': '3306',  
    }
}
