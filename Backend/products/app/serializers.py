from rest_framework import serializers
from .models import Products, Variant, SubVariant


class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = '__all__'


class SubVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubVariant
        fields = '__all__'


class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = '__all__'

    def create(self, validated_data):
        variants_data = validated_data.pop('variants')
        product = Products.objects.create(**validated_data)

        for variant_data in variants_data:
            sub_variants_data = variant_data.pop('sub_variants')
            variant = Variant.objects.create(product=product, **variant_data)

            for sub_variant_data in sub_variants_data:
                SubVariant.objects.create(variant=variant, **sub_variant_data)

        return product