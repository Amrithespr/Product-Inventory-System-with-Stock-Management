"""
URL configuration for products project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from rest_framework.routers import DefaultRouter
from app.views import RegisterViewSet, LoginViewSet, ProductsViewSet, VariantViewSet, SubVariantViewSet, StockViewSet

router = DefaultRouter()
router.register(r'products', ProductsViewSet)
router.register(r'variants', VariantViewSet)
router.register(r'subvariants', SubVariantViewSet)
router.register(r'stock', StockViewSet)


urlpatterns = [
    path('', include(router.urls)),
    
    path('admin/', admin.site.urls),
    
    path('register/', RegisterViewSet.as_view({'post': 'create'}), name='register'),
    path('login/', LoginViewSet.as_view({'post': 'create'}), name='login'),
    path('subvariants/<uuid:pk>/add_stock/', SubVariantViewSet.as_view({'post': 'add_stock'}), name='subvariant-add-stock'),
    path('subvariants/<uuid:pk>/remove_stock/', SubVariantViewSet.as_view({'post': 'remove_stock'}), name='subvariant-remove-stock'),

    
    
    path('api/',include('app.urls')),
    
    

]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    
    


