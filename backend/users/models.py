from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # AbstractUser already gives us username, first_name, last_name, email, password, etc.
    # We can add a custom field or two here.
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    is_seller = models.BooleanField(default=False)

    def __str__(self):
        return self.email or self.username
class EmailOTP(models.Model):
    email = models.EmailField(unique=True)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - {self.code}"
