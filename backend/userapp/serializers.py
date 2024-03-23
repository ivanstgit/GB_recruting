import random
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password

from rest_framework.serializers import (
    Serializer,
    ModelSerializer,
    EmailField,
    CharField,
    ValidationError,
)
from rest_framework.validators import UniqueValidator

from userapp.models import UserRoles, ROLE_GROUPS, CustomUser


class SignUpSerializer(ModelSerializer):
    email = EmailField(validators=[UniqueValidator(queryset=CustomUser.objects.all())])

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
        raise ValidationError

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        validation_code = str(random.randint(1000, 9000))
        user.validation_code = validation_code
        user.is_validated = False
        user.set_password(validated_data["password"])
        user.save()
        send_mail(
            "E-mail confirmation",
            "Your confirmation code is " + validation_code,
            "noreply@example.com",
            [user.email],
            fail_silently=False,
        )
        return user


class EmailConfirmSerializer(Serializer):
    username = CharField()
    token = CharField(write_only=True)

    def validate(self, attrs):
        return super().validate(attrs)

    def create(self, validated_data: dict):
        user_name = validated_data.get("username")
        if user_name:
            user = CustomUser.objects.get(username=user_name)
        validation_code = validated_data.get("token")

        print(validated_data)
        if (
            user
            and user.is_validated == False
            and user.validation_code == validation_code
        ):
            user.validation_code = ""
            user.is_validated = True

            if user.role:
                for group_name in ROLE_GROUPS.get(user.role):
                    group = Group.objects.get(name=group_name)
                    user.groups.add(group)
            user.save()

            return user
        else:
            raise ValidationError


class UserSerializer(ModelSerializer):
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
