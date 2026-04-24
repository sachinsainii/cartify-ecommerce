from django.urls import path
from .views import place_order,user_orders,order_detail,update_order_status,order_history

urlpatterns = [
    # path("checkout/",checkout),
    path("place/",place_order),
    path('my-orders/', user_orders),
    path('<int:order_id>/', order_detail),
    path('update/<int:order_id>/', update_order_status),
    path('history/', order_history)
]
