from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    email = models.EmailField(unique=True)

    ROLE_CHOICES = (
        ('admin','Admin'),
        ('customer','Customer'),
    )

    role = models.CharField(max_length=10,choices=ROLE_CHOICES,default='customer')
    
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email
    