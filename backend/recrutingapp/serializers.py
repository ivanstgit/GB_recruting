from rest_framework.serializers import (
    DateField,
    DateTimeField,
    ModelSerializer,
    SlugRelatedField,
)

from recrutingapp.models import (
    EmployeeEducation,
    EmployeeExperience,
    EmployeeProfile,
    NewsTag,
    NewsPost,
)


class NewsPublicListSerializer(ModelSerializer):
    """
    Serializer for public list access
    """

    created_at = DateTimeField(read_only=True)
    tags = SlugRelatedField(many=True, slug_field="name", read_only=True)

    class Meta:
        model = NewsPost
        fields = ["id", "title", "body", "created_at", "tags"]
        depth = 1


class NewsPublicDetailSerializer(ModelSerializer):
    """
    Serializer for public detail access
    """

    created_at = DateTimeField(read_only=True)
    tags = SlugRelatedField(many=True, slug_field="name", read_only=True)

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


class NewsTagStaffSerializer(ModelSerializer):
    """
    Serializer for administration
    """

    class Meta:
        model = NewsTag
        fields = "__all__"


class NewsStaffSerializer(ModelSerializer):
    """
    Serializer for administration
    """

    created_at = DateTimeField(read_only=True)
    updated_at = DateTimeField(read_only=True)
    # Update users by login in view
    updated_by = SlugRelatedField(read_only=True, slug_field="username")
    tags = SlugRelatedField(
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


class EmployeeExperienceSerializer(ModelSerializer):
    """
    Serializer for employee experience
    """

    datefrom = DateField()
    datefrom = DateField()
    created_at = DateTimeField(read_only=True)
    updated_at = DateTimeField(read_only=True)

    class Meta:
        model = EmployeeExperience
        fields = "__all__"


class EmployeeEducationSerializer(ModelSerializer):
    """
    Serializer for employee experience
    """

    date = DateField()
    created_at = DateTimeField(read_only=True)
    updated_at = DateTimeField(read_only=True)

    class Meta:
        model = EmployeeEducation
        fields = "__all__"


# https://www.django-rest-framework.org/api-guide/validators/#validators
# https://www.django-rest-framework.org/api-guide/serializers/#writable-nested-representations
class EmployeeProfileSerializer(ModelSerializer):
    """
    Serializer for employee profile
    """

    experience = EmployeeExperienceSerializer(many=True)
    education = EmployeeEducationSerializer(many=True)

    created_at = DateTimeField(read_only=True)
    updated_at = DateTimeField(read_only=True)
    # Update users by login in view
    user = SlugRelatedField(read_only=True, slug_field="username")

    class Meta:
        model = EmployeeProfile
        fields = "__all__"
        # user & tag updated by name
        depth = 1
