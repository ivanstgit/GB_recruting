"""
Tests of /account/ url path viewsets from userapp
"""

from rest_framework import status
from rest_framework.test import (
    APITestCase,
)

from userapp.models import CustomUser, UserRoles
from userapp.utils import UserGroupUtils

TESTUSERS = {
    "employer": {
        "username": "testEmployer",
        "password": "passworQ123",
        "first_name": "test",
        "last_name": "Employer",
        "email": "autotestEmployer@ru.ru",
        "role": UserRoles.employer.value,
    },
    "employee": {
        "username": "testEmployee",
        "password": "passworQ123",
        "first_name": "test",
        "last_name": "Employee",
        "email": "autotestEmployee@ru.ru",
        "role": UserRoles.employee.value,
    },
}


class TestAccountViewSet(APITestCase):
    """
    User registration test.
    Operation sequense is straightforward, no need in independence
    """

    def setUp(self) -> None:
        self.sign_out_url = "/api/v1.0/accounts/signup/"
        self.confirm_url = "/api/v1.0/accounts/confirm/"
        self.sign_in_url = "/api/v1.0/accounts/signin/"

        self.user_model = CustomUser

        UserGroupUtils.create_user_groups()
        return super().setUp()

    def get_user_obj(self, role) -> CustomUser:
        return self.user_model.objects.get_by_natural_key(
            TESTUSERS.get(role).get("username")
        )

    def t_01_signout(self) -> None:
        for role, data in TESTUSERS.items():
            response = self.client.post(self.sign_out_url, data, format="json")
            self.client.logout()

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertIsInstance(self.get_user_obj(role), self.user_model)

    def t_02_email_confirm(self) -> None:
        for role, _ in TESTUSERS.items():
            user = self.get_user_obj(role)
            data = {"username": user.username, "token": user.validation_code}

            response = self.client.post(self.confirm_url, data, format="json")
            self.client.logout()

            user = self.get_user_obj(role)

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(user.is_active, True)

    def t_03_signin(self) -> None:
        for role, _ in TESTUSERS.items():
            user = self.get_user_obj(role)

            self.client.force_login(user)
            response = self.client.get(self.sign_in_url)
            self.client.logout()

            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_all(self) -> None:
        self.t_01_signout()
        self.t_02_email_confirm()
        self.t_03_signin()

    def tearDown(self) -> None:
        for role, _ in TESTUSERS.items():
            user = self.get_user_obj(role)
            user.delete()
        UserGroupUtils.delete_user_groups()
        return super().tearDown()
