import django_filters.rest_framework as filters
from django_filters.widgets import DateRangeWidget

from recrutingapp.models import NewsPost, CV


class NewsFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr="contains")
    created_at = filters.DateFromToRangeFilter(
        widget=DateRangeWidget(attrs={"placeholder": "YYYY-MM-DD"})
    )

    class Meta:
        model = NewsPost
        fields = ["title", "created_at", "tags__name"]


class CVFilter(filters.FilterSet):
    position = filters.CharFilter(lookup_expr="icontains")
    description = filters.CharFilter(lookup_expr="icontains")
    salary_min = filters.NumberFilter(field_name="salary", lookup_expr="gte")
    salary_max = filters.NumberFilter(field_name="salary", lookup_expr="lte")
    published_since = filters.IsoDateTimeFilter(
        field_name="updated_at", lookup_expr="gte"
    )
    city = filters.CharFilter(
        field_name="employee__city__name", lookup_expr="icontains"
    )
    is_favorite = filters.BooleanFilter()

    class Meta:
        model = CV
        fields = [
            "position",
            "description",
            "city",
        ]
