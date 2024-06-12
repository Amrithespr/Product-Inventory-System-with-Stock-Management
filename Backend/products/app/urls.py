from django.urls import path
from .views import ProductsCreateView, ProductsListView, ProductsDetailView, ProductsUpdateView, ProductsDeleteView, \
    AddStockView, RemoveStockView

urlpatterns = [
    # Creating Model Instances
    path('products/create/', ProductsCreateView.as_view(), name='create_product'),

    # Reading Model Instances (List and Detail)
    path('products/', ProductsListView.as_view(), name='list_products'),
    path('products/<uuid:pk>/', ProductsDetailView.as_view(), name='detail_product'),

    # Updating Model Instances
    path('products/<uuid:pk>/update/', ProductsUpdateView.as_view(), name='update_product'),

    # Deleting Model Instances
    path('products/<uuid:pk>/delete/', ProductsDeleteView.as_view(), name='delete_product'),

    # Add Stock (Purchase) Endpoint
    path('variants/<uuid:variant_id>/add_stock/', AddStockView.as_view(), name='add_stock'),

    # Remove Stock (Sale) Endpoint
    path('variants/<uuid:variant_id>/remove_stock/', RemoveStockView.as_view(), name='remove_stock'),
]
