import datetime
from rest_framework import serializers

from recrutingapp.models import (
    DOCUMENT_STATUSES,
    City,
    DocStatusMixin,
    DocumentStatus,
    Employee,
    CV,
    CVEducation,
    CVExperience,
    Gender,
    NewsTag,
    NewsPost,
)


class OwnedModelMixin(serializers.ModelSerializer):
    is_owned = True
    owner = serializers.SlugRelatedField(read_only=True, slug_field="username")


class LoggedModelMixin(serializers.ModelSerializer):
    is_logged = True
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    # Update users by login in view
    updated_by = serializers.SlugRelatedField(read_only=True, slug_field="username")


class GenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gender
        fields = ["id", "name"]


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["id", "name", "region", "fullname"]


class DocumentStatusMixinSerializer(serializers.Serializer):
    status = serializers.CharField(max_length=1)
    info = serializers.CharField(max_length=150, allow_blank=True)

    def validate_status(self, value):
        statuses = (_[0] for _ in DOCUMENT_STATUSES)
        if value not in statuses:
            raise serializers.ValidationError("Invalid status")
        return value

    class Meta:
        fields = ["status", "info"]


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


class NewsStaffSerializer(LoggedModelMixin, serializers.ModelSerializer):
    """
    Serializer for administration
    """

    # created_at = serializers.DateTimeField(read_only=True)
    # updated_at = serializers.DateTimeField(read_only=True)
    # # Update users by login in view
    # updated_by = serializers.SlugRelatedField(read_only=True, slug_field="username")
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


class EmployeeSerializerExt(OwnedModelMixin, serializers.ModelSerializer):
    """
    Serializer for reading
    """

    class Meta:
        model = Employee
        fields = [
            "id",
            "owner",
            "name",
            "birthday",
            "age",
            "email",
            "city",
            "gender",
            "description",
            "skills",
            "updated_at",
        ]
        depth = 1


class EmployeeSerializerInt(OwnedModelMixin, serializers.ModelSerializer):
    """
    Serializer internal pk
    """

    # owner = serializers.SlugRelatedField(read_only=True, slug_field="username")
    name = serializers.CharField(max_length=100)
    birthday = serializers.DateField()
    email = serializers.EmailField(required=True)
    city = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), required=True
    )
    gender = serializers.PrimaryKeyRelatedField(
        queryset=Gender.objects.all(), required=True
    )

    def validate_birthday(self, value):
        if (
            isinstance(value, datetime.date)
            and value < datetime.date.today()
            and value > datetime.date(1910, 1, 1)
        ):
            return value
        raise serializers.ValidationError("Incorrect date")

    class Meta:
        model = Employee
        fields = [
            "id",
            "owner",
            "email",
            "name",
            "birthday",
            "city",
            "gender",
            "description",
            "skills",
        ]
        # user updated by name
        depth = 1


class CVExperienceSerializerInt(serializers.ModelSerializer):
    """
    Serializer for employee experience
    """

    datefrom = serializers.DateField(required=True)
    dateto = serializers.DateField(required=False)
    is_current = serializers.BooleanField()
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())

    class Meta:
        model = CVExperience
        fields = [
            "id",
            "datefrom",
            "dateto",
            "is_current",
            "city",
            "company",
            "content",
        ]


class CVExperienceSerializerExt(serializers.ModelSerializer):
    """
    Serializer for employee experience
    """

    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = CVExperience
        fields = [
            "id",
            "datefrom",
            "dateto",
            "is_current",
            "city",
            "company",
            "position",
            "content",
            "created_at",
            "updated_at",
        ]
        depth = 2


class CVEducationSerializer(serializers.ModelSerializer):
    """
    Serializer for employee education
    """

    date = serializers.DateField()
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = CVEducation
        fields = [
            "id",
            "date",
            "institution",
            "content",
            "created_at",
            "updated_at",
        ]
        depth = 1


class CVSerializerInt(OwnedModelMixin, LoggedModelMixin, serializers.ModelSerializer):
    """
    Serializer internal pk
    """

    # owner = serializers.SlugRelatedField(read_only=True, slug_field="username")
    experience = CVExperienceSerializerInt(many=True)
    education = CVEducationSerializer(many=True)

    class Meta:
        model = CV
        fields = [
            "id",
            "owner",
            "employee",
            "title",
            "description",
            "experience",
            "education",
            "created_at",
            "updated_at",
        ]
        depth = 1

    def create(self, validated_data):
        experience_data = validated_data.pop("experience")
        education_data = validated_data.pop("education")
        cv = CV.objects.create(**validated_data)
        for experience_ in experience_data:
            CVExperience.objects.create(cv=cv, **experience_)
        for education_ in education_data:
            CVEducation.objects.create(cv=cv, **education_)
        return cv

    def update(self, instance, validated_data: dict):
        experience_data = validated_data.pop("experience")
        education_data = validated_data.pop("education")

        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)

        cv = instance

        if experience_data:
            cv.experience.all().delete()
            for experience_ in experience_data:
                CVExperience.objects.create(cv=cv, **experience_)
        if education_data:
            cv.education.all().delete()
            for education_ in education_data:
                CVEducation.objects.create(cv=cv, **education_)
        return cv


class CVSerializerExt(OwnedModelMixin, LoggedModelMixin, serializers.ModelSerializer):
    """
    Serializer for reading
    """

    # owner = serializers.SlugRelatedField(read_only=True, slug_field="username")

    employee = EmployeeSerializerExt()
    experience = CVExperienceSerializerExt(many=True)
    education = CVEducationSerializer(many=True)

    class Meta:
        model = CV
        fields = [
            "id",
            "owner",
            "employee",
            "status",
            "status_info",
            "title",
            "description",
            "experience",
            "education",
            "created_at",
            "updated_at",
        ]
        depth = 1
