import random

from django.core.validators import validate_email
from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers, validators

from userapp.models import UserRoles, CustomUser
from userapp.utils import UserGroupUtils, send_confirmation_mail


class SignUpSerializer(serializers.ModelSerializer):
    """
    Creating user without group permissions and sending validation code
    """

    email = serializers.EmailField(
        validators=[validators.UniqueValidator(queryset=CustomUser.objects.all())]
    )

    class Meta:
        model = CustomUser
        fields = ("username", "first_name", "last_name", "email", "role", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_email(self, value):
        validate_email(value)
        return value

    def validate_role(self, value):
        if value in set([UserRoles.employee.value, UserRoles.employer.value]):
            return value
        raise serializers.ValidationError

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        validation_code = str(random.randint(1000, 9000))
        user.validation_code = validation_code
        user.is_validated = False
        user.set_password(validated_data["password"])
        user.save()
        try:
            send_confirmation_mail(user)
        finally:
            pass
        return user


class EmailConfirmSerializer(serializers.Serializer):
    """
    Validating user and assigning group permissions
    """

    username = serializers.CharField()
    token = serializers.CharField(write_only=True)

    def create(self, validated_data: dict):
        user_name = validated_data.get("username")
        if user_name:
            user = CustomUser.objects.get(username=user_name)
        validation_code = validated_data.get("token")

        if user and (not user.is_validated) and user.validation_code == validation_code:
            user.validation_code = ""
            user.is_validated = True

            if user.role:
                groups = UserGroupUtils.get_groups_for_role(user.role)
                for group in groups:
                    user.groups.add(group)
            user.save()

            return user
        else:
            raise serializers.ValidationError


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
            "is_validated",
        )
        extra_kwargs = {
            "username": {"read_only": True},
            "email": {"read_only": True},
            "role": {"read_only": True},
            "is_validated": {"read_only": True},
        }
