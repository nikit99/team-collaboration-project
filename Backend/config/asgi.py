"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_asgi_application()



# In Python web development, WSGI (Web Server Gateway Interface) and ASGI (Asynchronous Server Gateway Interface) 
# are protocols that define how web servers and Python web applications or frameworks communicate. WSGI is synchronous,
# while ASGI is asynchronous and designed to handle more complex scenarios like real-time applications. 