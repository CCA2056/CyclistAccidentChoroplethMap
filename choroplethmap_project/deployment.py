import os
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS = [os.environ['WEBSITE_HOSTNAME']]
CSRF_TRUSTED_ORIGINS = ['https://' + os.environ['WEBSITE_HOSTNAME']]
DEBUG = True

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Get data from environment variable
host = os.getenv('AZURE_POSTGRESQL_HOST')
user = os.getenv('AZURE_POSTGRESQL_USER')
password = os.getenv('AZURE_POSTGRESQL_PASSWORD')
database = os.getenv('AZURE_POSTGRESQL_NAME')

# Connect to the db
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': database,
        'USER': user,
        'PASSWORD': password,
        'HOST': host,
        'PORT': '5432',
    }
}