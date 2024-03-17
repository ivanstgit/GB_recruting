from django.core.validators import URLValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from userapp.models import CustomUser

CONTENT_TYPES = [
    ("MD", "Markdown"),
    ("HT", "HTML"),
    ("TX", "Plain text"),
]


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
