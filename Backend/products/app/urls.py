from django.urls import path
from .views import LoginView, RegisterView, ProductsViewSet, VariantViewSet, SubVariantViewSet

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('products/', ProductsViewSet.as_view({'get': 'list', 'post': 'create'}), name='list_create_products'),
    path('products/<uuid:pk>/', ProductsViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='retrieve_update_delete_product'),
    path('variants/', VariantViewSet.as_view({'get': 'list', 'post': 'create'}), name='list_create_variants'),
    path('variants/<uuid:pk>/', VariantViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='retrieve_update_delete_variant'),
    path('subvariants/', SubVariantViewSet.as_view({'get': 'list', 'post': 'create'}), name='list_create_subvariants'),
    path('subvariants/<uuid:pk>/', SubVariantViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='retrieve_update_delete_subvariant'),
    path('subvariants/<uuid:pk>/add_stock/', SubVariantViewSet.as_view({'post': 'add_stock'}), name='add_stock'),
    path('subvariants/<uuid:pk>/remove_stock/', SubVariantViewSet.as_view({'post': 'remove_stock'}), name='remove_stock'),
]
