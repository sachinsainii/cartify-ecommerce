from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Order, OrderItem
from products.models import Product


def create_order(user, cart):
    with transaction.atomic():
        order = Order.objects.create(user=user)
        total_price = 0

        for item in cart.items.select_related('product'):
            # 🔒 lock row
            product = Product.objects.select_for_update().get(id=item.product.id)

            # ✅ stock validation
            if item.quantity > product.stock:
                raise ValidationError(f"{product.name} is out of stock")

            total_price += item.quantity * product.price

            # ✅ create order item
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item.quantity,
                price=product.price
            )

            # ✅ reduce stock
            product.stock -= item.quantity
            product.save()

        # ✅ save total
        order.total_price = total_price
        order.save()

        # ✅ clear cart
        cart.items.all().delete()

    return order