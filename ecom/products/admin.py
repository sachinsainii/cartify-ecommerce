from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Product,Category


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price','stock')
    search_fields = ('name',)
    list_filter = ('price',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    list_filter = ('name',)