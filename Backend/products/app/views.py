from urllib import response
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Products, Variant
from .serializers import ProductsSerializer, VariantSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets
from django.http import request


# Create your views here.





class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm_password = request.data.get('confirmPassword')

        if not username or not email or not password or not confirm_password:
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        if password != confirm_password:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()

        return Response({'success': 'User registered successfully'}, status=status.HTTP_201_CREATED)




class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Your authentication logic here (e.g., using Django's built-in authentication system)

        # Example: Authenticate the user
        user = authenticate(username=username, password=password)
        if user:
            # Generate a token
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



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




# using model viewsets



from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Products, Variant, SubVariant, Stock
from .serializers import ProductsSerializer, VariantSerializer, SubVariantSerializer, StockSerializer

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .serializers import UserSerializer

class ProductsViewSet(viewsets.ModelViewSet):
    queryset = Products.objects.all()
    serializer_class = ProductsSerializer

    @action(detail=True, methods=['get'])
    def variants(self, request, pk=None):
        product = self.get_object()
        variants = Variant.objects.filter(product=product)
        serializer = VariantSerializer(variants, many=True)
        return Response(serializer.data)

class VariantViewSet(viewsets.ModelViewSet):
    queryset = Variant.objects.all()
    serializer_class = VariantSerializer

    @action(detail=True, methods=['get'])
    def subvariants(self, request, pk=None):
        variant = self.get_object()
        subvariants = SubVariant.objects.filter(variant=variant)
        serializer = SubVariantSerializer(subvariants, many=True)
        return Response(serializer.data)

class SubVariantViewSet(viewsets.ModelViewSet):
    queryset = SubVariant.objects.all()
    serializer_class = SubVariantSerializer

    @action(detail=True, methods=['post'])
    def add_stock(self, request, pk=None):
        sub_variant = self.get_object()
        quantity = request.data.get('quantity')
        if quantity is not None:
            try:
                quantity = int(quantity)
                stock, created = Stock.objects.get_or_create(
                    product=sub_variant.product,
                    variant=sub_variant.variant,
                    subvariant=sub_variant,
                    defaults={'stock': 0}
                )
                stock.stock += quantity
                stock.save()
                return Response({'message': 'Stock added successfully'}, status=status.HTTP_200_OK)
            except ValueError:
                return Response({'error': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Quantity not provided'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def remove_stock(self, request, pk=None):
        sub_variant = self.get_object()
        quantity = request.data.get('quantity')
        if quantity is not None:
            try:
                quantity = int(quantity)
                stock = Stock.objects.get(
                    product=sub_variant.product,
                    variant=sub_variant.variant,
                    subvariant=sub_variant
                )
                if stock.stock >= quantity:
                    stock.stock -= quantity
                    stock.save()
                    return Response({'message': 'Stock removed successfully'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                return Response({'error': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)
            except Stock.DoesNotExist:
                return Response({'error': 'Stock record not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Quantity not provided'}, status=status.HTTP_400_BAD_REQUEST)

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    
    
    
# class RegisterViewSet(APIView):
class RegisterViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]  # Allow registration for anonymous users

    @action(detail=False, methods=['post'])
    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Create a new user
            if user:
                token = Token.objects.create(user=user)  # Create a token for the user
                return Response({'token': token.key}, status=status.HTTP_201_CREATED)  # Return token upon successful registration
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class LoginViewSet(APIView):
class LoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]  # Allow login for anonymous users

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)  # Retrieve existing token or create a new one
            return Response({'token': token.key}, status=status.HTTP_200_OK)  # Return token upon successful login
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)  # Unauthorized access


# class RegisterViewSet(viewsets.ViewSet):
#     @action(detail=False, methods=['post'])
#     def create(self, request):
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class LoginViewSet(viewsets.ViewSet):
#     @action(detail=False, methods=['post'])
#     def create(self, request):
#         # Your login logic here
#         return Response("Login view")