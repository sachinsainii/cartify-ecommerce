from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cart,CartItem
from products.models import Product
from django.shortcuts import get_object_or_404
# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):

    user = request.user
    product_id = request.data.get('product_id')
    # quantity = request.data.get('quantity',1)
    quantity = int(request.data.get('quantity', 1))

    # product = Product.objects.get(id=product_id)
    product = get_object_or_404(Product, id=product_id)

    #get or create cart
    cart,_ = Cart.objects.get_or_create(user=user)
    
    #check if item already exists
    cart_item,created = CartItem.objects.get_or_create(cart=cart,product=product)

    # if not created:
    #     cart_item.quantity += int(quantity)
    # else:
    #     cart_item.quantity = int(quantity)

    # cart_item.save()
    if quantity <= 0:
        cart_item.delete()
    else:
        cart_item.quantity = quantity
        cart_item.save()

    return Response({"message":"product added to cart"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request):

    cart,created = Cart.objects.get_or_create(user=request.user)
    items = CartItem.objects.filter(cart=cart)
    items = CartItem.objects.filter(cart=cart).select_related('product')

    data = []

    for item in items:
        data.append({
        "id": item.id,
        "product": {
        "id": item.product.id,
        "name": item.product.name,
        "price": item.product.price
        },
        "quantity": item.quantity,
        "total": item.quantity * item.product.price
        })
        # data.append({
        #     "product":item.product.name,
        #     "quantity":item.quantity,
        #     "price":item.product.price,
        #     "total":item.quantity*item.product.price 
        # })

    return Response(data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request,product_id):
    try:
        cart = Cart.objects.get(user=request.user)
        item = CartItem.objects.get(cart=cart,product_id=product_id)
        item.delete()
        return Response({"message":"item removed"})
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_count(request):
    cart = Cart.objects.get(user=request.user)
    count = sum(item.quantity for item in cart.items.all())
    return Response({"count":count})

    