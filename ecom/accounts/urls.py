from django.urls import path
from .views import signup,login,logout,profile,admin_dashboard
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('signup/',signup, name="signup"),
    # path('login/',TokenObtainPairView.as_view(), name="login"),
    path('login/',login, name="login"),
    path('logout/',logout,name="logout"),
     path('profile/', profile),            
    path('admin-dashboard/', admin_dashboard),
]

