from rest_framework.serializers import DateTimeField, ModelSerializer, SlugRelatedField

from recrutingapp.models import NewsTag, NewsPost


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
