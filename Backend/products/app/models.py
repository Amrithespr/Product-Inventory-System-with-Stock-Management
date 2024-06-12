from django.db import models
import uuid
from versatileimagefield.fields import VersatileImageField
from django.utils.translation import gettext_lazy as _

class Products(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product_id = models.BigIntegerField(unique=True)
    product_code = models.CharField(max_length=255, unique=True)
    product_name = models.CharField(max_length=255)
    product_image = VersatileImageField(upload_to="uploads/", blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(blank=True, null=True)
    created_user = models.ForeignKey("auth.User", related_name="user_products", on_delete=models.CASCADE)
    is_favourite = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    hsn_code = models.CharField(max_length=255, blank=True, null=True)
    total_stock = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)

    class Meta:
        db_table = "Products"
        verbose_name = _("product")
        verbose_name_plural = _("products")
        unique_together = (("product_code", "product_id"),)
        ordering = ("-created_date", "product_id")

    def __str__(self):
        return self.product_name

class Variant(models.Model):
    product = models.ForeignKey(Products, related_name="variants", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "Variant"
        verbose_name = _("variant")
        verbose_name_plural = _("variants")
        ordering = ["name"]
        unique_together = (("product", "name"),)

    def __str__(self):
        return f"{self.name}"

class SubVariant(models.Model):
    product = models.ForeignKey(Products, related_name="sub_variants", on_delete=models.CASCADE)
    variant = models.ForeignKey(Variant, related_name="sub_variants", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)


    class Meta:
        db_table = "SubVariant"
        verbose_name = _("sub variant")
        verbose_name_plural = _("sub variants")
        ordering = ["name"]
        unique_together = (("product", "variant", "name"),)

    def __str__(self):
        return self.name


class Stock(models.Model):
    product = models.ForeignKey(Products, related_name="stocks", on_delete=models.CASCADE)
    variant = models.ForeignKey(Variant, related_name="stocks", on_delete=models.CASCADE)
    subvariant = models.ForeignKey(SubVariant, related_name="stocks", on_delete=models.CASCADE)
    stock = models.PositiveIntegerField(default=0)  


    class Meta:
        db_table = "Stock"
        verbose_name = _("stock")
        verbose_name_plural = _("stock")
        ordering = ["stock"]
        unique_together = (("product", "variant", "subvariant", "stock"),)

    def __str__(self):
        return self.stock






