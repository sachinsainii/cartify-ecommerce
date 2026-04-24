from django.urls import path
from .views import view_cart,add_to_cart,remove_from_cart,cart_count

urlpatterns = [
    path("view/",view_cart),
    path("add/",add_to_cart),
    path("remove/<int:product_id>/",remove_from_cart),
    path("cart/count/",cart_count),
]
