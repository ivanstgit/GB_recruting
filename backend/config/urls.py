"""config URL Configuration

1. admin 
2. userapp and recrutingapp
3. api schema documentation (openapi 3 by drf_specctacular)

"""

from django.contrib import admin
from django.urls import include, path, re_path

from rest_framework.authtoken import views as AuthtokenViews
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

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
    # Administration page
    path("admin/", admin.site.urls),
    # Auth tokens
    path("api-auth/", include("rest_framework.urls")),
    path("api-token-auth/", AuthtokenViews.obtain_auth_token),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # Main app router
    re_path(r"^api/v(?P<version>(1.0|2.1))/", include(router.urls)),
    # re_path(r"^api/v(?P<version>\d\.\d)/", include(router.urls)),
    # Documentation
    re_path(
        r"api/schema/v(?P<version>(1.0))/yaml/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),
    re_path(
        r"api/schema/v(?P<version>(1.0))/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    re_path(
        r"api/schema/v(?P<version>(1.0))/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]
