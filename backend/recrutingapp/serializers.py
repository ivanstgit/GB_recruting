from rest_framework import serializers

from recrutingapp.models import (
    City,
    EmployeeEducation,
    EmployeeExperience,
    Employee,
    Gender,
    NewsTag,
    NewsPost,
)


class GenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gender
        fields = ["id", "name"]


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["id", "name", "region", "fullname"]


class NewsPublicListSerializer(serializers.ModelSerializer):
    """
    Serializer for public list access
    """

    created_at = serializers.DateTimeField(read_only=True)
    tags = serializers.SlugRelatedField(many=True, slug_field="name", read_only=True)

    class Meta:
        model = NewsPost
        fields = ["id", "title", "body", "created_at", "tags"]
        depth = 1


class NewsPublicDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for public detail access
    """

    created_at = serializers.DateTimeField(read_only=True)
    tags = serializers.SlugRelatedField(many=True, slug_field="name", read_only=True)

    class Meta:
        model = NewsPost
        fields = [
            "id",
            "title",
            "body",
            "content_type",
            "content",
            "created_at",
            "tags",
        ]
        depth = 1


class NewsTagStaffSerializer(serializers.ModelSerializer):
    """
    Serializer for administration
    """

    class Meta:
        model = NewsTag
        fields = "__all__"


class NewsStaffSerializer(serializers.ModelSerializer):
    """
    Serializer for administration
    """

    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    # Update users by login in view
    updated_by = serializers.SlugRelatedField(read_only=True, slug_field="username")
    tags = serializers.SlugRelatedField(
        many=True, slug_field="name", queryset=NewsTag.objects.all(), required=False
    )

    class Meta:
        model = NewsPost
        fields = [
            "id",
            "title",
            "body",
            "content_type",
            "content",
            "created_at",
            "updated_at",
            "updated_by",
            "tags",
        ]
        # user & tag updated by name
        depth = 1


class EmployeeExperienceSerializerInt(serializers.ModelSerializer):
    """
    Serializer for employee experience
    """

    owner = serializers.SlugRelatedField(read_only=True, slug_field="username")

    datefrom = serializers.DateField(required=True)
    dateto = serializers.DateField(required=False)
    is_current = serializers.BooleanField()
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())

    class Meta:
        model = EmployeeExperience
        fields = [
            "id",
            "owner",
            "datefrom",
            "dateto",
            "is_current",
            "city",
            "company",
            "content",
        ]
        depth = 1


class EmployeeExperienceSerializerExt(serializers.ModelSerializer):
    """
    Serializer for employee experience
    """

    owner = serializers.SlugRelatedField(read_only=True, slug_field="username")

    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = EmployeeExperience
        fields = [
            "id",
            "owner",
            "datefrom",
            "dateto",
            "is_current",
            "city",
            "company",
            "content",
            "created_at",
            "updated_at",
        ]
        depth = 1


class EmployeeEducationSerializer(serializers.ModelSerializer):
    """
    Serializer for employee education
    """

    owner = serializers.SlugRelatedField(read_only=True, slug_field="username")

    date = serializers.DateField()
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = EmployeeEducation
        fields = [
            "id",
            "owner",
            "date",
            "institution",
            "content",
            "created_at",
            "updated_at",
        ]
        depth = 1


class EmployeeSerializerExt(serializers.ModelSerializer):
    """
    Serializer for reading
    """

    owner = serializers.SlugRelatedField(read_only=True, slug_field="username")

    class Meta:
        model = Employee
        fields = [
            "id",
            "owner",
            "email",
            "city",
            "gender",
            "created_at",
            "updated_at",
        ]
        # user & tag updated by name
        depth = 1


class EmployeeSerializerInt(serializers.ModelSerializer):
    """
    Serializer internal pk
    """

    owner = serializers.SlugRelatedField(read_only=True, slug_field="username")

    email = serializers.EmailField(required=True)
    city = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), required=True
    )
    gender = serializers.PrimaryKeyRelatedField(
        queryset=Gender.objects.all(), required=True
    )

    # experience = EmployeeExperienceSerializer(many=True)
    # education = EmployeeEducationSerializer(many=True)

    class Meta:
        model = Employee
        fields = [
            "id",
            "owner",
            "email",
            "city",
            "gender",
            # "experience",
            # "education",
            "created_at",
            "updated_at",
        ]
        # user updated by name
        depth = 1

    # def create(self, validated_data):
    #     experience_data = validated_data.pop("experience")
    #     education_data = validated_data.pop("education")
    #     employee = Employee.objects.create(**validated_data)
    #     for experience in experience_data:
    #         EmployeeExperience.objects.create(employee=employee, **experience)
    #     for education in education_data:
    #         EmployeeEducation.objects.create(employee=employee, **education)
    #     return employee

    # def update(self, instance, validated_data):
    #     experience_data = validated_data.pop("experience")
    #     education_data = validated_data.pop("education")

    #     for field, value in validated_data:
    #         instance[field] = value

    #     employee=instance

    #     if experience_data:
    #         employee.experience.delete()
    #         for experience in experience_data:
    #             EmployeeExperience.objects.create(employee=employee, **experience)
    #     if education_data:
    #         employee.experience.delete()
    #     for education in education_data:
    #         EmployeeEducation.objects.create(employee=employee, **education)
    #     return employee
