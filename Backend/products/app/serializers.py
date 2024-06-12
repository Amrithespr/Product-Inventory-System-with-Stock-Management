from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Products, Variant, SubVariant , Stock


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'

class SubVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubVariant
        fields = '__all__'


class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = '__all__'

class ProductsSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)

    class Meta:
        model = Products
        fields = '__all__'
        
        

    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ 'username', 'email', 'password', 'confirmPassword']  # Add any additional fields you want to include

        extra_kwargs = {
            'password': {'write_only': True},  # Ensures password is not returned in responses
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)  # Create a new user using create_user method of User model
        return user