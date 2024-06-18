"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path, re_path

from rest_framework import permissions
from rest_framework.authtoken import views as AuthtokenViews
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from userapp.views import SignUpViewSet, EmailConfirmViewSet, SignInViewSet
from recrutingapp.views import (
    CVResponseViewSet,
    NewsPublicViewSet,
    EmployerPublicViewSet,
    CityViewSet,
    GenderViewSet,
    EmployeeProtectedViewSet,
    EmployerProtectedViewSet,
    NewsPostStaffViewSet,
    NewsTagsStaffViewSet,
    CVViewSet,
    VacancyResponseViewSet,
    VacancyViewSet,
)

schema_view = get_schema_view(
    openapi.Info(
        title="Recruting",
        default_version="1.0",
        description="Documentation",
        contact=openapi.Contact(email="admin@admin.local"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.IsAdminUser],
)

router = DefaultRouter()


router.register("accounts/signup", SignUpViewSet, basename="signup")
router.register("accounts/confirm", EmailConfirmViewSet, basename="confirm")
router.register("accounts/signin", SignInViewSet, basename="signin")

router.register("public/news", NewsPublicViewSet)
router.register("public/employers", EmployerPublicViewSet)
router.register("protected/cities", CityViewSet, basename="common_cities")
router.register("protected/genders", GenderViewSet, basename="common_genders")
router.register("protected/news/tags", NewsTagsStaffViewSet, basename="news_tags")
router.register("protected/news/posts", NewsPostStaffViewSet, basename="news_posts")
router.register("protected/employees", EmployeeProtectedViewSet, basename="employees")
router.register("protected/employers", EmployerProtectedViewSet, basename="employers")
router.register("protected/cvs", CVViewSet, basename="cvs")
router.register("protected/vacancies", VacancyViewSet, basename="vacancies")
router.register("protected/cv-responses", CVResponseViewSet, basename="cv_responses")
router.register(
    "protected/vacancy-responses", VacancyResponseViewSet, basename="vacancy_responses"
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    re_path(r"^api/v(?P<version>(1.0|2.1))/", include(router.urls)),
    # re_path(r"^api/v(?P<version>\d\.\d)/", include(router.urls)),
    # path("api/", include(router.urls)),
    path("api-token-auth/", AuthtokenViews.obtain_auth_token),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    re_path(
        r"^swagger/v(?P<version>(1.0))/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^swagger/v(?P<version>(1.0))(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^redoc/v(?P<version>(1.0))",
        schema_view.with_ui("redoc", cache_timeout=0),
        name="schema-redoc",
    ),
]
