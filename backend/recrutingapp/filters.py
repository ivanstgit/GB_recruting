from django_filters.rest_framework import (
    FilterSet,
    CharFilter,
    DateFromToRangeFilter,
)
from django_filters.widgets import DateRangeWidget

from recrutingapp.models import NewsPost


class NewsFilter(FilterSet):
    title = CharFilter(lookup_expr="contains")
    created_at = DateFromToRangeFilter(
        widget=DateRangeWidget(attrs={"placeholder": "YYYY-MM-DD"})
    )

    class Meta:
        model = NewsPost
        fields = ["title", "created_at", "tags__name"]
