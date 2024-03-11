from rest_framework.serializers import HyperlinkedModelSerializer

from .models import CustomUser


class CustomUserModelSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("username", "first_name", "last_name", "email")
