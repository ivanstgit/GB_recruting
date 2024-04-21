from django.core.validators import URLValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from userapp.models import CustomUser

CONTENT_TYPES = [
    ("MD", "Markdown"),
    ("HT", "HTML"),
    ("TX", "Plain text"),
]


class Region(models.Model):
    name = models.CharField(
        max_length=100,
        help_text=_("Region name"),
        unique=True,
        error_messages={
            "unique": _("Region already exists!"),
        },
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("region")
        verbose_name_plural = _("regions")


class City(models.Model):
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
    def fullname(self):
        return ", ".join([self.name, " ,", str(self.region)])

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("city")
        verbose_name_plural = _("cities")


class Skill(models.Model):
    name = models.CharField(
        max_length=100,
        help_text=_("Skill name"),
        unique=True,
        error_messages={
            "unique": _("Skill already exists!"),
        },
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("skill")
        verbose_name_plural = _("skills")


class Gender(models.Model):
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
        return self.name

    class Meta:
        verbose_name = _("gender")
        verbose_name_plural = _("genders")


class NewsTag(models.Model):
    name = models.CharField(
        max_length=30,
        help_text=_("News tag name"),
        unique=True,
        error_messages={
            "unique": _("Tag already exists!"),
        },
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("newstag")
        verbose_name_plural = _("newstags")


class NewsPost(models.Model):

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

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        CustomUser,
        help_text=_("Creator (author)"),
        on_delete=models.PROTECT,
    )

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("newspost")
        verbose_name_plural = _("newsposts")


class Employee(models.Model):
    owner = models.OneToOneField(
        CustomUser,
        help_text=_("Owner"),
        on_delete=models.PROTECT,
    )
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
    skills = models.ManyToManyField(Skill, help_text=_("Skills"), related_name="skills")
    # experience = models.OneToManyField(
    #     EmployeeExperience, help_text=_("Experience"), related_name="experience"
    # )
    # education = models.ManyToManyField(
    #     EmployeeEducation, help_text=_("Education"), related_name="education"
    # )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Employee" + str(self.user.get_full_name())

    class Meta:
        verbose_name = _("employee")
        verbose_name_plural = _("employees")


class EmployeeExperience(models.Model):

    owner = models.ForeignKey(
        CustomUser,
        help_text=_("Owner"),
        on_delete=models.PROTECT,
    )
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
    content = models.TextField(
        help_text=_("Content"),
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class EmployeeEducation(models.Model):
    owner = models.ForeignKey(
        CustomUser,
        help_text=_("Owner"),
        on_delete=models.PROTECT,
    )
    date = models.DateField()

    institution = models.CharField(
        _("Institution"),
        max_length=100,
    )
    content = models.TextField(
        help_text=_("Content"),
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
