from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Products, Variant
from .serializers import ProductsSerializer, VariantSerializer
from rest_framework.pagination import PageNumberPagination


# Create your views here.


# Creating Model Instances:


class ProductsCreateView(APIView):

    def post(self, request):
        serializer = ProductsSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Reading Model Instances (List and Detail):

class ProductsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductsListView(APIView):
    def get(self, request):
        paginator = ProductsPagination()
        products = Products.objects.all()
        result_page = paginator.paginate_queryset(products, request)
        serializer = ProductsSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class ProductsDetailView(APIView):
    def get(self, request, pk):
        try:
            product = Products.objects.get(pk=pk)
        except Products.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ProductsSerializer(product)
        return Response(serializer.data)


# Updating Model Instances:

class ProductsUpdateView(APIView):
    def put(self, request, pk):
        try:
            product = Products.objects.get(pk=pk)
        except Products.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ProductsSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Deleting Model Instances:

class ProductsDeleteView(APIView):
    def delete(self, request, pk):
        try:
            product = Products.objects.get(pk=pk)
        except Products.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Add Stock (Purchase) Endpoint:

class AddStockView(APIView):
    def post(self, request, variant_id):
        try:
            variant = Variant.objects.get(pk=variant_id)
        except Variant.DoesNotExist:
            return Response({"error": "Variant not found."}, status=status.HTTP_404_NOT_FOUND)

        # Assuming the request data contains the quantity to be added
        quantity = request.data.get('quantity')
        if quantity is None:
            return Response({"error": "Quantity not provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the stock
        variant.stock += quantity
        variant.save()

        # Serialize and return the updated variant
        serializer = VariantSerializer(variant)
        return Response(serializer.data)


# Remove Stock (Sale) Endpoint:

class RemoveStockView(APIView):
    def post(self, request, variant_id):
        try:
            variant = Variant.objects.get(pk=variant_id)
        except Variant.DoesNotExist:
            return Response({"error": "Variant not found."}, status=status.HTTP_404_NOT_FOUND)

        # Assuming the request data contains the quantity to be removed
        quantity = request.data.get('quantity')
        if quantity is None:
            return Response({"error": "Quantity not provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure that sufficient stock is available
        if variant.stock < quantity:
            return Response({"error": "Insufficient stock."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the stock
        variant.stock -= quantity
        variant.save()

        # Serialize and return the updated variant
        serializer = VariantSerializer(variant)
        return Response(serializer.data)
