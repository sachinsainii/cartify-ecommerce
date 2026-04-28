from django.urls import path
from .views import product_list, product_detail,category_list

urlpatterns = [
    path('',product_list),
    path('<int:id>/',product_detail),
    path('categories/',category_list)
]
