"""
All models for recruting App
"""

import datetime
from dateutil.relativedelta import relativedelta

from django.db import models
from django.utils.translation import gettext_lazy as _

from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType

from userapp.models import CustomUser

CONTENT_TYPES = [
    ("MD", "Markdown"),
    ("HT", "HTML"),
    ("TX", "Plain text"),
]


class ConstDocumentStatus:
    """
    Status keys for documents, stored in DB
    """

    draft = "d"
    pending = "p"
    approved = "a"
    rejected = "r"


DOCUMENT_STATUSES = [
    (ConstDocumentStatus.draft, "Draft"),
    (ConstDocumentStatus.pending, "Pending"),
    (ConstDocumentStatus.approved, "Approved"),
    (ConstDocumentStatus.rejected, "Rejected"),
]


class DocumentStatus(models.Model):
    """
    Document statuses properties and description
    """

    id = models.CharField(
        max_length=1,
        primary_key=True,
        help_text=_("Status code"),
        choices=DOCUMENT_STATUSES,
    )
    name = models.CharField(
        max_length=25,
        help_text=_("Status name"),
    )

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name = _("status")
        verbose_name_plural = _("statuses")


class DocStatusMixin(models.Model):
    """
    Mix-in for status fields adding
    """

    status = models.ForeignKey(
        DocumentStatus,
        help_text=_("Status"),
        on_delete=models.PROTECT,
        choices=DOCUMENT_STATUSES,
        default=ConstDocumentStatus.draft,
    )
    status_info = models.CharField(
        max_length=150, help_text=_("Status info"), default=""
    )

    class Meta:
        abstract = True


class DocumentMessage(models.Model):
    """
    Generic messages model for documents with chat feature
    """

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    created_at = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField(
        help_text=_("Content"),
        max_length=1024,
    )

    class Meta:
        verbose_name = _("message")
        verbose_name_plural = _("messages")


class DocMessagesMixin(models.Model):
    """
    Mix-in for messages relation adding
    """

    messages = GenericRelation(DocumentMessage)

    class Meta:
        abstract = True


class LoggingMixin(models.Model):
    """
    Mix-in for changes logging
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        CustomUser,
        related_name="+",
        help_text=_("Updated by"),
        on_delete=models.PROTECT,
    )

    class Meta:
        abstract = True


class OwnedMixin(models.Model):
    """
    Mix-in for document with 'owner' property
    """

    owner = models.ForeignKey(
        CustomUser,
        help_text=_("Owner"),
        on_delete=models.PROTECT,
    )

    class Meta:
        abstract = True


class Region(models.Model):
    """
    Geographic region for city
    """

    name = models.CharField(
        max_length=100,
        help_text=_("Region name"),
        unique=True,
        error_messages={
            "unique": _("Region already exists!"),
        },
    )

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name = _("region")
        verbose_name_plural = _("regions")


class City(models.Model):
    """
    City master data (name and region)
    """

    name = models.CharField(
        max_length=100,
        help_text=_("City name"),
        unique=True,
        error_messages={
            "unique": _("Region already exists!"),
        },
    )

    region = models.ForeignKey(
        Region,
        help_text=_("Region"),
        on_delete=models.PROTECT,
    )

    @property
    def fullname(self) -> str:
        return ", ".join([self.name, " ,", str(self.region)])

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name = _("city")
        verbose_name_plural = _("cities")


class Skill(models.Model):
    """
    Employee skill description
    """

    name = models.CharField(
        max_length=100,
        help_text=_("Skill name"),
        unique=True,
        error_messages={
            "unique": _("Skill already exists!"),
        },
    )

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name = _("skill")
        verbose_name_plural = _("skills")


class Gender(models.Model):
    """
    Gender master data
    """

    id = models.CharField(
        max_length=1,
        primary_key=True,
        help_text=_("Gender id"),
    )
    name = models.CharField(
        max_length=25,
        help_text=_("Gender name"),
    )

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name = _("gender")
        verbose_name_plural = _("genders")


class NewsTag(models.Model):
    """
    Tag description for news
    """

    name = models.CharField(
        max_length=30,
        help_text=_("News tag name"),
        unique=True,
        error_messages={
            "unique": _("Tag already exists!"),
        },
    )

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name = _("newstag")
        verbose_name_plural = _("newstags")


class NewsPost(LoggingMixin, models.Model):
    """
    News model
    """

    title = models.CharField(
        max_length=60,
        help_text=_("Title"),
        error_messages={},
    )
    body = models.CharField(
        max_length=200,
        help_text=_("Body"),
        error_messages={},
    )
    content_type = models.CharField(max_length=2, choices=CONTENT_TYPES)
    content = models.TextField(
        help_text=_("Content"),
    )

    tags = models.ManyToManyField(
        NewsTag, help_text=_("Tag list"), related_name="posts"
    )

    def __str__(self):
        return str(self.title)

    class Meta:
        verbose_name = _("newspost")
        verbose_name_plural = _("newsposts")


class Employee(LoggingMixin, models.Model):
    """
    Employee profile (extends user model)
    """

    # one-to-one!!!
    owner = models.OneToOneField(
        CustomUser,
        help_text=_("Owner"),
        on_delete=models.PROTECT,
        related_name="employee",
    )

    name = models.CharField(_("Name"), max_length=100)
    birthday = models.DateField()
    gender = models.ForeignKey(
        Gender,
        on_delete=models.PROTECT,
    )
    email = models.CharField(
        _("email address"),
        max_length=256,
        unique=True,
        error_messages={
            "unique": _("An employee with that email address already exists."),
        },
    )
    city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
    )
    description = models.CharField(max_length=250, default="")
    skills = models.ManyToManyField(Skill, help_text=_("Skills"), related_name="skills")

    @property
    def age(self) -> int:
        """Age in years"""
        if self.birthday:
            return relativedelta(datetime.date.today(), self.birthday).years
        return 0

    def __str__(self):
        return "Employee" + str(self.name)

    class Meta:
        verbose_name = _("employee")
        verbose_name_plural = _("employees")


class Employer(OwnedMixin, LoggingMixin, DocStatusMixin, models.Model):
    """
    Employer profile (extends user model)
    """

    # one-to-one!!!
    owner = models.OneToOneField(
        CustomUser,
        help_text=_("Owner"),
        on_delete=models.PROTECT,
        related_name="employer",
    )

    name = models.CharField(_("Name"), max_length=100)
    established = models.DateField()
    email = models.CharField(
        _("email address"),
        max_length=256,
        unique=True,
        error_messages={
            "unique": _("An employer with that email address already exists."),
        },
    )
    city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
    )
    description = models.CharField(max_length=250, default="")
    welcome_letter = models.TextField(max_length=1000, default="")

    @property
    def age(self) -> int:
        if self.established:
            return relativedelta(datetime.date.today(), self.established).years
        return 0

    def __str__(self):
        return "Employer " + str(self.name)

    class Meta:
        verbose_name = _("employer")
        verbose_name_plural = _("employers")


class CV(OwnedMixin, LoggingMixin, DocStatusMixin, models.Model):
    """
    Employee CV
    """

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
    )

    title = models.CharField(
        max_length=60,
        help_text=_("Title"),
        error_messages={},
    )

    position = models.CharField(
        _("Position"),
        max_length=100,
    )

    salary = models.DecimalField(decimal_places=0, max_digits=10)

    description = models.TextField()

    class Meta:
        verbose_name = _("cv")
        verbose_name_plural = _("cvs")


class CVExperience(models.Model):
    """
    Experience items in employee's CV
    """

    cv = models.ForeignKey(CV, on_delete=models.CASCADE, related_name="experience")

    datefrom = models.DateField()
    dateto = models.DateField(blank=True)
    is_current = models.BooleanField(default=False)

    city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
    )
    company = models.CharField(
        _("Company"),
        max_length=100,
    )
    position = models.CharField(
        _("Position"),
        max_length=100,
    )
    content = models.TextField(
        help_text=_("Content"),
    )

    class Meta:
        verbose_name = _("experience")
        verbose_name_plural = _("experience")


class CVEducation(models.Model):
    """
    Education items in employee's CV
    """

    cv = models.ForeignKey(CV, on_delete=models.CASCADE, related_name="education")

    date = models.DateField()

    institution = models.CharField(
        _("Institution"),
        max_length=100,
    )
    specialty = models.CharField(
        _("Speciality"),
        max_length=100,
    )
    content = models.TextField(
        help_text=_("Content"),
        max_length=1024,
    )

    class Meta:
        verbose_name = _("education")
        verbose_name_plural = _("education")


class Vacancy(OwnedMixin, LoggingMixin, DocStatusMixin, models.Model):
    """
    Employer's vacancy
    """

    employer = models.ForeignKey(
        Employer, on_delete=models.CASCADE, related_name="vacancies"
    )

    title = models.CharField(
        max_length=60,
        help_text=_("Title"),
        error_messages={},
    )

    city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
    )

    position = models.CharField(
        _("Position"),
        max_length=100,
    )

    salary = models.DecimalField(decimal_places=0, max_digits=10)

    description = models.TextField()

    class Meta:
        verbose_name = _("vacancy")
        verbose_name_plural = _("vacancies")


class CVResponse(
    OwnedMixin, LoggingMixin, DocStatusMixin, DocMessagesMixin, models.Model
):
    """
    Employer's rosponse on CV
    """

    cv = models.ForeignKey(
        CV,
        on_delete=models.CASCADE,
    )
    vacancy = models.ForeignKey(
        Vacancy,
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = _("cv_response")
        verbose_name_plural = _("cv_responses")
        constraints = [
            models.UniqueConstraint(
                fields=["cv", "vacancy"],
                name="unique_cv_vacancy",
            )
        ]


class VacancyResponse(
    OwnedMixin, LoggingMixin, DocStatusMixin, DocMessagesMixin, models.Model
):
    """
    Employee's rosponse on vacancy
    """

    vacancy = models.ForeignKey(
        Vacancy,
        on_delete=models.CASCADE,
    )
    cv = models.ForeignKey(
        CV,
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = _("vacancy_response")
        verbose_name_plural = _("vacancy_responses")
        constraints = [
            models.UniqueConstraint(
                fields=["vacancy", "cv"],
                name="unique_vacancy_cv",
            )
        ]


class Favorite(models.Model):
    """
    Generic model for favorite user documents
    """

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    class Meta:
        verbose_name = _("favorite")
        verbose_name_plural = _("favorites")
        ordering = ["-id"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "object_id", "content_type"],
                name="unique_user_content_type_object_id",
            )
        ]
