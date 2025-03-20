"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_wsgi_application()


# In Python web development, WSGI (Web Server Gateway Interface) and ASGI (Asynchronous Server Gateway Interface) 
# are protocols that define how web servers and Python web applications or frameworks communicate. WSGI is synchronous,
# while ASGI is asynchronous and designed to handle more complex scenarios like real-time applications. 