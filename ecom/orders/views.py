from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from .permissions import IsAdminUserCustom
from rest_framework.response import Response
from cart.models import Cart,CartItem 
from .models import Order,OrderItem
from .services import create_order
from rest_framework import status
from .serializers import OrderSerializer

# Create your views here.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404

from .services import create_order
from cart.models import Cart


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    user = request.user

    # ✅ get cart (cleaner)
    cart = get_object_or_404(Cart, user=user)

    # ✅ check empty cart
    if not cart.items.exists():
        return Response({"error": "Cart is empty"}, status=400)

    try:
        order = create_order(user, cart)

        return Response({
            "message": "Order placed successfully",
            "order_id": order.id
        }, status=201)

    # ✅ expected business error (stock issue etc.)
    except ValidationError as e:
        return Response({"error": str(e)}, status=400)

    # 🚨 unexpected server error
    except Exception as e:
        return Response({"error": "Something went wrong"}, status=500)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated,IsAdminUserCustom])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    new_status = request.data.get('status')

    if new_status not in [choice[0] for choice in Order.STATUS_CHOICES]:
        return Response({"error": "Invalid status"}, status=400)

    order.status = new_status
    order.save()

    return Response({"message": "Status updated", "status": order.status})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_orders(request):
    orders = Order.objects.filter(user=request.user)\
    .prefetch_related('items__product')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

        items = order.items.select_related('product')
    return Response({
        "order_id": order.id,
        "status": order.status,
        "items": [
            {
            "product": item.product.name,
            "quantity": item.quantity,
            "price": item.product.price
        }
        for item in items
    ]
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history(request):

    orders = Order.objects.filter(user=request.user).order_by('-created_at')

    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)





