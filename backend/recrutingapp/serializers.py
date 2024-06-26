"""
All serializers for recruting App
"""

import datetime
from rest_framework import serializers, validators
from drf_spectacular.utils import extend_schema_field

from recrutingapp.models import (
    DOCUMENT_STATUSES,
    CVResponse,
    City,
    ConstDocumentStatus,
    DocumentMessage,
    Employee,
    CV,
    CVEducation,
    CVExperience,
    Employer,
    Gender,
    NewsTag,
    NewsPost,
    Skill,
    Vacancy,
    VacancyResponse,
)


# Mixins
class OwnedModelMixin(serializers.ModelSerializer):
    """Mixin for owned objects"""

    is_owned = True
    owner = serializers.SlugRelatedField(read_only=True, slug_field="username")


class LoggedModelMixin(serializers.ModelSerializer):
    """Mixin for objects with changes logging fields"""

    is_logged = True
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    # Update users by login in view
    updated_by = serializers.SlugRelatedField(read_only=True, slug_field="username")


class DocumentStatusMixinSerializer(serializers.Serializer):
    """Mixin for objects with status ('status' action handling)"""

    status = serializers.CharField(max_length=1)
    info = serializers.CharField(max_length=150, allow_blank=True)

    def validate_status(self, value):
        statuses = (_[0] for _ in DOCUMENT_STATUSES)
        if value not in statuses:
            raise serializers.ValidationError("Invalid status")
        return value

    class Meta:
        fields = ["status", "info"]


class DocumentMessageSerializer(serializers.Serializer):
    """Serializer for document chat messages"""

    sender = serializers.SlugRelatedField(read_only=True, slug_field="role")
    content = serializers.CharField(max_length=1024)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = DocumentMessage
        fields = ["sender", "content", "created_at"]


@extend_schema_field(DocumentMessageSerializer())
class DocumentMessagesField(serializers.RelatedField):
    """
    Helper for nested serialization
    """

    def to_representation(self, value):
        return DocumentMessageSerializer(value).data


# Common objects
class GenderSerializer(serializers.ModelSerializer):
    """Gender model serializer (no logic)"""

    class Meta:
        model = Gender
        fields = ["id", "name"]


class SkillWritableField(serializers.CharField):
    """Skill serializer. Only for write."""

    def to_internal_value(self, data):
        skill, is_created = Skill.objects.get_or_create(name=data)
        if is_created:
            skill.save()
        return skill


class CitySerializer(serializers.ModelSerializer):
    """City model serializer (no logic)"""

    class Meta:
        model = City
        fields = ["id", "name", "region", "fullname"]


# News
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
    Serializer for managimg news (staff)
    """

    class Meta:
        model = NewsTag
        fields = "__all__"


class NewsStaffSerializer(LoggedModelMixin, serializers.ModelSerializer):
    """
    Serializer for managimg news (staff)
    """

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


# Employee profile
class EmployeeSerializerExt(OwnedModelMixin, serializers.ModelSerializer):
    """
    Serializer for reading
    """

    skills = serializers.SlugRelatedField(many=True, slug_field="name", read_only=True)

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
    skills = serializers.ListSerializer(child=SkillWritableField())

    def validate_birthday(self, value):
        """birthday must be in past"""
        if (
            isinstance(value, datetime.date)
            and value < datetime.date.today()
            and value > datetime.date(1910, 1, 1)
        ):
            return value
        raise serializers.ValidationError("Incorrect date")

    def create(self, validated_data):
        skills_data = validated_data.pop("skills")
        employee = super().create(validated_data)

        for skill in skills_data:
            employee.skills.add(skill)
        employee.save()
        return employee

    def update(self, instance: Employee, validated_data):
        skills_data = validated_data.pop("skills")
        employee = super().update(instance, validated_data)
        employee.skills.clear()

        for skill in skills_data:
            employee.skills.add(skill)
        employee.save()
        return employee

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


# Employer
class EmployerSerializerExt(OwnedModelMixin, serializers.ModelSerializer):
    """
    Serializer for employer profile reading
    """

    class Meta:
        model = Employer
        fields = [
            "id",
            "owner",
            "name",
            "established",
            "age",
            "email",
            "city",
            "description",
            "welcome_letter",
            "updated_at",
            "status",
            "status_info",
        ]
        depth = 1


class EmployerSerializerInt(OwnedModelMixin, serializers.ModelSerializer):
    """
    Employer profile serializer for create/update actions
    """

    name = serializers.CharField(max_length=100)
    established = serializers.DateField()
    email = serializers.EmailField(required=True)
    city = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), required=True
    )

    def validate_established(self, value):
        """establishing date must be in past"""
        if (
            isinstance(value, datetime.date)
            and value < datetime.date.today()
            and value > datetime.date(1910, 1, 1)
        ):
            return value
        raise serializers.ValidationError("Incorrect date")

    class Meta:
        model = Employer
        fields = [
            "id",
            "owner",
            "email",
            "name",
            "established",
            "city",
            "description",
            "welcome_letter",
        ]
        # user updated by name
        depth = 1


# CV
class CVExperienceSerializerInt(serializers.ModelSerializer):
    """
    Serializer for employee experience (create/update)
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
            "position",
            "content",
        ]


class CVExperienceSerializerExt(serializers.ModelSerializer):
    """
    Serializer for employee experience (reading)
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
            "specialty",
            "institution",
            "content",
            "created_at",
            "updated_at",
        ]
        depth = 1


class CVSerializerInt(OwnedModelMixin, LoggedModelMixin, serializers.ModelSerializer):
    """
    Serializer for CV's create/update actions (internal pk)
    """

    experience = CVExperienceSerializerInt(many=True)
    education = CVEducationSerializer(many=True)

    class Meta:
        model = CV
        fields = [
            "id",
            "owner",
            "employee",
            "title",
            "position",
            "salary",
            "description",
            "experience",
            "education",
            "created_at",
            "updated_at",
        ]
        depth = 1

    def validate(self, attrs):
        """Check employee profile exists"""
        request = self.context["request"]
        if (
            request.method == "POST"
            and Employee.objects.filter(owner=request.user).count() == 0
        ):
            raise serializers.ValidationError("No profile exists!")
        return super().validate(attrs)

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
        instance.position = validated_data.get("position", instance.position)
        instance.salary = validated_data.get("salary", instance.salary)
        instance.description = validated_data.get("description", instance.description)

        instance.save()

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
    Serializer for CV reading
    """

    employee = EmployeeSerializerExt()
    experience = CVExperienceSerializerExt(many=True)
    education = CVEducationSerializer(many=True)
    is_favorite = serializers.BooleanField(read_only=True)

    class Meta:
        model = CV
        fields = [
            "id",
            "owner",
            "employee",
            "status",
            "status_info",
            "title",
            "position",
            "salary",
            "description",
            "experience",
            "education",
            "created_at",
            "updated_at",
            "is_favorite",
        ]
        depth = 1


# Vacancy
class VacancySerializerInt(
    OwnedModelMixin, LoggedModelMixin, serializers.ModelSerializer
):
    """
    Serializer for Vacancies's create/update actions (internal pk)
    """

    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())

    def validate(self, attrs):
        """Check employer profile exists"""
        request = self.context["request"]
        if (
            request.method == "POST"
            and Employer.objects.filter(owner=request.user).count() == 0
        ):
            raise serializers.ValidationError("No profile exists!")
        return super().validate(attrs)

    class Meta:
        model = Vacancy
        fields = [
            "id",
            "owner",
            "employer",
            "title",
            "city",
            "position",
            "salary",
            "description",
            "created_at",
            "updated_at",
        ]
        depth = 1


class VacancySerializerExt(
    OwnedModelMixin, LoggedModelMixin, serializers.ModelSerializer
):
    """
    Serializer for Vacancy reading
    """

    employer = EmployerSerializerExt()
    is_favorite = serializers.BooleanField(read_only=True)

    class Meta:
        model = Vacancy
        fields = [
            "id",
            "owner",
            "employer",
            "status",
            "status_info",
            "title",
            "city",
            "position",
            "salary",
            "description",
            "created_at",
            "updated_at",
            "is_favorite",
        ]
        depth = 1


class CVResponseSerializerInt(
    OwnedModelMixin, LoggedModelMixin, serializers.ModelSerializer
):
    """
    Serializer for create/update actions (internal pk) with validation
    """

    cv = serializers.PrimaryKeyRelatedField(queryset=CV.objects.all())
    vacancy = serializers.PrimaryKeyRelatedField(queryset=Vacancy.objects.all())

    def validate_cv(self, value):
        """Validate CV and check if it's published (approved)"""
        cv_obj = value
        if cv_obj and cv_obj.status.id == ConstDocumentStatus.approved:
            return value
        raise serializers.ValidationError("Approved CV required")

    def validate_vacancy(self, value):
        """Validate vacancy and check if it's approved and owned by creator"""
        request = self.context["request"]
        vacancy_obj = value
        if (
            vacancy_obj
            and vacancy_obj.owner == request.user
            and vacancy_obj.status.id == ConstDocumentStatus.approved
        ):
            return value
        raise serializers.ValidationError("Own approved Vacancy required")

    class Meta:
        model = CVResponse
        fields = [
            "id",
            "owner",
            "cv",
            "vacancy",
            "created_at",
            "updated_at",
        ]
        depth = 1
        validators = [
            validators.UniqueTogetherValidator(
                queryset=CVResponse.objects.all(),
                fields=[
                    "cv",
                    "vacancy",
                ],
            )
        ]


# CV Response
class CVResponseSerializerExt(
    OwnedModelMixin,
    LoggedModelMixin,
    serializers.ModelSerializer,
):
    """
    Serializer for reading
    """

    cv = CVSerializerExt()
    vacancy = VacancySerializerExt()
    messages = DocumentMessagesField(read_only=True, many=True)

    class Meta:
        model = CVResponse
        fields = [
            "id",
            "owner",
            "cv",
            "vacancy",
            "created_at",
            "updated_at",
            "status",
            "status_info",
            "messages",
        ]
        depth = 1


# Vacancy Response
class VacancyResponseSerializerInt(
    OwnedModelMixin, LoggedModelMixin, serializers.ModelSerializer
):
    """
    Serializer for write operations (internal pk)
    """

    cv = serializers.PrimaryKeyRelatedField(queryset=CV.objects.all())
    vacancy = serializers.PrimaryKeyRelatedField(queryset=Vacancy.objects.all())

    def validate_cv(self, value):
        """Validate CV and check if it's approved and owned by creator"""
        request = self.context["request"]
        cv_obj = value
        if (
            cv_obj
            and cv_obj.owner == request.user
            and cv_obj.status.id == ConstDocumentStatus.approved
        ):
            return value
        raise serializers.ValidationError("Own approved CV required")

    def validate_vacancy(self, value):
        """Validate vacancy and check if it's published (approved)"""
        vacancy_obj = value
        if vacancy_obj and vacancy_obj.status.id == ConstDocumentStatus.approved:
            return value
        raise serializers.ValidationError("Approved vacancy required")

    class Meta:
        model = VacancyResponse
        fields = [
            "id",
            "owner",
            "cv",
            "vacancy",
            "created_at",
            "updated_at",
        ]
        depth = 1
        validators = [
            validators.UniqueTogetherValidator(
                queryset=VacancyResponse.objects.all(),
                fields=[
                    "cv",
                    "vacancy",
                ],
            )
        ]


class VacancyResponseSerializerExt(
    OwnedModelMixin,
    LoggedModelMixin,
    serializers.ModelSerializer,
):
    """
    Serializer for reading
    """

    cv = CVSerializerExt()
    vacancy = VacancySerializerExt()
    messages = DocumentMessagesField(read_only=True, many=True)

    class Meta:
        model = VacancyResponse
        fields = [
            "id",
            "owner",
            "cv",
            "vacancy",
            "created_at",
            "updated_at",
            "status",
            "status_info",
            "messages",
        ]
        depth = 1
