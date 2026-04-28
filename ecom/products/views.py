from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny
from rest_framework.pagination import PageNumberPagination


# Create your views here.

@api_view(['GET','POST'])
@permission_classes([AllowAny])
def product_list(request):

    #GET -> list all products
    if request.method == 'GET':
        products = Product.objects.all().order_by('id')

        #filter by category
        category_id = request.GET.get('category')
        if category_id:
            products = products.filter(category_id=category_id)

        #filter by search
        search = request.GET.get('search')
        if search:
            products = products.filter(name__icontains=search)

        #Pagination
        paginator = PageNumberPagination()
        paginator.page_size = 5
        result_page = paginator.paginate_queryset(products, request)

        serializer = ProductSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    #POST -> create new product
    elif request.method == 'POST':
        #only admin can create
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({"message":"only admin can add products"},status=status.HTTP_403_FORBIDDEN)

        serializer = ProductSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET','PUT','DELETE'])
@permission_classes([AllowAny])
def product_detail(request,id):
    product = get_object_or_404(Product,id=id)

    #GET -> single product
    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    #PUT -> update product
    elif request.method == 'PUT':
        #admin
        if not request.user.is_staff:
            return Response({"message":"only admin can update products"},status=403)

        serializer = ProductSerializer(product,data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    #DELETE -> delete product
    elif request.method == 'DELETE':
        #admin
        if not request.user.is_staff:
            return Response({"message":"only admin can delete the products"},status=403)

        product.delete()
        return Response({"message":"Product deleted"},status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories,many=True)
    return Response(serializer.data)

