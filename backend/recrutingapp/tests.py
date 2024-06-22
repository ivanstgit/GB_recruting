"""
Tests of /account/ url path viewsets from userapp
"""

import datetime
from rest_framework import status
from rest_framework.test import (
    APITestCase,
)

from recrutingapp.models import (
    CV,
    CVResponse,
    City,
    ConstDocumentStatus,
    DocumentStatus,
    Employee,
    Employer,
    Gender,
    NewsPost,
    NewsTag,
    Vacancy,
    VacancyResponse,
)
from userapp.models import CustomUser, UserRoles
from userapp.utils import UserGroupUtils, UserUtils


FIXTURES = ["test_users.json", "test_data.json"]


class RecrutingTestCase(APITestCase):
    fixtures = FIXTURES

    @classmethod
    def setUpTestData(cls):
        UserGroupUtils.create_user_groups()
        cls.tu_moderator, _ = UserUtils.create_test_user(
            UserUtils.test_moderator, raise_if_exists=False
        )
        cls.tu_employee, _ = UserUtils.create_test_user(
            UserUtils.test_employee, raise_if_exists=False
        )
        cls.tu_employer, _ = UserUtils.create_test_user(
            UserUtils.test_employer, raise_if_exists=False
        )

    @staticmethod
    def get_request_data_status(status, status_info=""):
        return {"status": status, "info": status_info}

    @staticmethod
    def get_request_data_message(content="content"):
        return {"content": content}

    @staticmethod
    def get_url_detail(url, id):
        return url + str(id) + "/"

    @staticmethod
    def get_url_status(url, id):
        return url + str(id) + "/status/"

    @staticmethod
    def get_url_favorite(url, id):
        return url + str(id) + "/favorite/"

    @staticmethod
    def get_url_message(url, id):
        return url + str(id) + "/messages/"


class TestNewsTagViewSet(RecrutingTestCase):
    """
    Moderator tags test.
    """

    def setUp(self) -> None:
        self.url = "/api/v1.0/protected/news/tags/"
        return super().setUp()

    def test_tags(self) -> None:
        self.client.force_login(self.tu_moderator)

        data = {"name": "tag description"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data)

        new_id = response.data.get("id", None)
        self.assertIsNotNone(new_id)

        response = self.client.put(
            self.get_url_detail(self.url, new_id), data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = {"name": "tag description 2"}
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data.get("results")) > 0)

        self.client.logout()

    def tearDown(self) -> None:
        self.client.logout()
        return super().tearDown()


class TestCityViewSet(RecrutingTestCase):
    """
    City viewset test.
    """

    def setUp(self) -> None:
        self.url = "/api/v1.0/protected/cities/"
        test_city = City.objects.first()
        self.url_detail = self.get_url_detail(self.url, test_city.id)
        return super().setUp()

    def test_registered(self) -> None:
        for user in (self.tu_employee, self.tu_moderator, self.tu_employer):
            self.client.force_login(user)

            data = {"name": "description"}
            response = self.client.post(self.url, data, format="json")
            self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
            response = self.client.put(self.url_detail, data, format="json")
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
            response = self.client.patch(self.url_detail, data, format="json")
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

            response = self.client.get(self.url_detail, format="json")
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
            response = self.client.get(self.url, format="json")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIsNotNone(response.data)
            self.assertTrue(len(response.data) > 0)

            self.client.logout()

    def test_anon(self) -> None:

        data = {"name": "description"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.put(self.url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        response = self.client.patch(self.url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.get(self.url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def tearDown(self) -> None:
        self.client.logout()
        return super().tearDown()


class TestGenderViewSet(RecrutingTestCase):
    """
    City viewset test.
    """

    def setUp(self) -> None:
        self.url = "/api/v1.0/protected/genders/"
        test_gender = Gender.objects.first()
        self.url_detail = self.get_url_detail(self.url, test_gender.id)
        return super().setUp()

    def test_registered(self) -> None:
        for user in (self.tu_employee, self.tu_moderator, self.tu_employer):
            self.client.force_login(user)

            data = {"name": "description"}
            response = self.client.post(self.url, data, format="json")
            self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
            response = self.client.put(self.url_detail, data, format="json")
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
            response = self.client.patch(self.url_detail, data, format="json")
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

            response = self.client.get(self.url_detail, format="json")
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
            response = self.client.get(self.url, format="json")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIsNotNone(response.data)
            self.assertTrue(len(response.data) > 0)

            self.client.logout()

    def test_anon(self) -> None:

        data = {"name": "description"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.put(self.url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        response = self.client.patch(self.url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.get(self.url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def tearDown(self) -> None:
        self.client.logout()
        return super().tearDown()


class TestNewsPostViewSets(RecrutingTestCase):
    """
    News test.
    """

    test_data = {
        "title": "string",
        "body": "string",
        "content_type": "MD",
        "content": "string",
    }

    def setUp(self) -> None:
        self.posts_url = "/api/v1.0/protected/news/posts/"
        self.public_url = "/api/v1.0/public/news/"

        self.tag, _ = NewsTag.objects.get_or_create(name="tag descr")
        self.newspost, _ = NewsPost.objects.get_or_create(
            **self.test_data, updated_by=self.tu_moderator
        )
        return super().setUp()

    def test_news_crud_moderator(self) -> None:
        self.client.force_login(self.tu_moderator)

        data = self.test_data
        url = self.posts_url
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data)

        new_id = response.data.get("id", None)
        self.assertIsNotNone(new_id)

        url_detail = self.get_url_detail(self.posts_url, new_id)
        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(
            url_detail, {"tags": [self.tag.name]}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        cnt_before = len(response.data.get("results"))
        self.assertTrue(cnt_before > 0)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        cnt_after = len(response.data.get("results"))
        self.assertTrue((cnt_before - cnt_after) == 1)

        self.client.logout()

    def test_permissions_for_anon(self) -> None:
        response = self.client.get(self.public_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data.get("results")) > 0)

        url = self.posts_url
        url_detail = self.get_url_detail(url, self.newspost.id)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.patch(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_permissions_for_registered(self) -> None:
        for user in [self.tu_employee, self.tu_employer]:
            self.client.force_login(user)

            response = self.client.get(self.public_url, format="json")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIsNotNone(response.data)
            self.assertTrue(len(response.data.get("results")) > 0)

            url = self.posts_url
            url_detail = self.get_url_detail(url, self.newspost.id)
            response = self.client.get(url_detail, format="json")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(url, {}, format="json")
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
            response = self.client.patch(url_detail, {}, format="json")
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
            response = self.client.delete(url_detail, format="json")
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

            self.client.logout()

    def tearDown(self) -> None:
        self.client.logout()
        return super().tearDown()


class TestEmployeeViewSets(RecrutingTestCase):
    """
    Employee profile test.
    """

    test_data = {
        "email": "userddddd@example.com",
        "name": "string",
        "birthday": "2024-06-21",
        "city": 1,
        "gender": "m",
        "description": "desc",
        "skills": ["skill 1", "skill 2"],
    }

    @staticmethod
    def get_test_employee(user: CustomUser) -> Employee:
        return Employee.objects.get(owner=user)

    def setUp(self) -> None:
        self.url = "/api/v1.0/protected/employees/"

        employee2_data = UserUtils.test_employee.copy()
        employee2_data["username"] = "testEmployee_2"
        employee2_data["email"] = "testEmployee_2@mail.com"
        self.tu_employee2, _ = UserUtils.create_test_user(
            employee2_data, raise_if_exists=False
        )

        self.employee = self.get_test_employee(self.tu_employee)
        return super().setUp()

    def test_crud_employee(self) -> None:
        self.client.force_login(self.tu_employee2)

        data = self.test_data
        url = self.url
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data)

        new_id = response.data.get("id", None)
        self.assertIsNotNone(new_id)
        url_detail = self.get_url_detail(url, new_id)

        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.client.logout()

    def test_permissions_for_anon(self) -> None:
        url = self.url
        url_detail = self.get_url_detail(url, self.employee.id)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.patch(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_permissions_for_moderator(self) -> None:
        url = self.url
        url_detail = self.get_url_detail(url, self.employee.id)
        self.client.force_login(self.tu_moderator)

        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.put(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.logout()

    def test_permissions_for_employer(self) -> None:
        url = self.url
        url_detail = self.get_url_detail(url, self.employee.id)
        self.client.force_login(self.tu_employer)

        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.put(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.logout()

    def test_permissions_for_another_employee(self) -> None:
        url_detail = self.get_url_detail(self.url, self.employee.id)
        self.client.force_login(self.tu_employee2)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.put(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.patch(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        self.client.logout()

    def tearDown(self) -> None:
        self.client.logout()
        return super().tearDown()


class TestEmployerViewSets(RecrutingTestCase):
    """
    Employer profile test.
    """

    test_data = {
        "email": "user@example.com",
        "name": "string",
        "established": "2022-06-22",
        "city": 1,
        "description": "description",
        "welcome_letter": "welcome_letter",
    }

    @staticmethod
    def get_test_employer(user: CustomUser) -> Employer:
        return Employer.objects.get(owner=user)

    @staticmethod
    def create_test_employer_user() -> CustomUser:
        tu_employer_new_data = UserUtils.test_employer.copy()
        tu_employer_new_data["username"] = "testEmployer_new"
        tu_employer_new_data["email"] = "testEmployer_new@mail.com"
        tu_employer_new, _ = UserUtils.create_test_user(
            tu_employer_new_data, raise_if_exists=False
        )
        Employer.objects.filter(owner=tu_employer_new).delete()
        tu_employer_new.save()
        return tu_employer_new

    @staticmethod
    def create_test_employer(
        user: CustomUser, status=ConstDocumentStatus.draft
    ) -> Employer:
        Employer.objects.filter(owner=user).delete()
        employer = Employer.objects.create(
            name="name",
            established=datetime.date(2023, 11, 1),
            city=City.objects.first(),
            description="description",
            welcome_letter="welcome_letter",
            email=user.email,
            owner=user,
            updated_by=user,
            status=DocumentStatus.objects.get(pk=status),
        )
        employer.save()
        return employer

    def setUp(self) -> None:
        self.url = "/api/v1.0/protected/employers/"
        return super().setUp()

    def test_crud_employer(self) -> None:
        user = self.create_test_employer_user()
        self.client.force_login(user)

        data = self.test_data
        url = self.url

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertIsNotNone(response.data)
        new_id = response.data.get("id", None)
        self.assertIsNotNone(new_id)
        self.assertEqual(
            Employer.objects.get(pk=new_id).status.id, ConstDocumentStatus.draft
        )

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        # object actions depends on status
        for obj_status in [
            ConstDocumentStatus.draft,
            ConstDocumentStatus.approved,
            ConstDocumentStatus.rejected,
            ConstDocumentStatus.pending,
        ]:
            obj_id = self.create_test_employer(user, obj_status).id
            url_detail = self.get_url_detail(self.url, obj_id)

            response = self.client.put(url_detail, data, format="json")
            if obj_status in [ConstDocumentStatus.draft, ConstDocumentStatus.rejected]:
                self.assertEqual(response.status_code, status.HTTP_200_OK)
            else:
                self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

            response = self.client.patch(url_detail, data, format="json")
            if obj_status in [ConstDocumentStatus.draft, ConstDocumentStatus.rejected]:
                self.assertEqual(response.status_code, status.HTTP_200_OK)
            else:
                self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

            response = self.client.get(url_detail, format="json")
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            response = self.client.delete(url_detail, format="json")
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.logout()

    def test_status_employer(self) -> None:
        user = self.create_test_employer_user()
        self.client.force_login(user)

        permitted_paths = [
            ConstDocumentStatus.draft + ConstDocumentStatus.pending,
            ConstDocumentStatus.rejected + ConstDocumentStatus.pending,
            ConstDocumentStatus.approved + ConstDocumentStatus.draft,
            ConstDocumentStatus.rejected + ConstDocumentStatus.draft,
            ConstDocumentStatus.pending + ConstDocumentStatus.draft,
            ConstDocumentStatus.draft + ConstDocumentStatus.draft,
        ]
        for new_obj_status in [
            ConstDocumentStatus.draft,
            ConstDocumentStatus.approved,
            ConstDocumentStatus.rejected,
            ConstDocumentStatus.pending,
        ]:
            for obj_status in [
                ConstDocumentStatus.draft,
                ConstDocumentStatus.approved,
                ConstDocumentStatus.rejected,
                ConstDocumentStatus.pending,
            ]:
                obj_id = self.create_test_employer(user, obj_status).id
                url_status = self.get_url_status(self.url, obj_id)

                response = self.client.patch(
                    url_status,
                    self.get_request_data_status(new_obj_status),
                    format="json",
                )

                path = obj_status + new_obj_status
                if path in permitted_paths:
                    self.assertEqual(response.status_code, status.HTTP_200_OK)
                else:
                    self.assertEqual(
                        response.status_code, status.HTTP_400_BAD_REQUEST, f"{path}"
                    )

        self.client.logout()

    def test_status_moderator(self) -> None:
        user = self.create_test_employer_user()
        self.client.force_login(self.tu_moderator)

        permitted_paths = [
            ConstDocumentStatus.pending + ConstDocumentStatus.rejected,
            ConstDocumentStatus.pending + ConstDocumentStatus.approved,
        ]
        for new_obj_status in [
            ConstDocumentStatus.draft,
            ConstDocumentStatus.approved,
            ConstDocumentStatus.rejected,
            ConstDocumentStatus.pending,
        ]:
            for obj_status in [
                ConstDocumentStatus.draft,
                ConstDocumentStatus.approved,
                ConstDocumentStatus.rejected,
                ConstDocumentStatus.pending,
            ]:
                obj_id = self.create_test_employer(user, obj_status).id
                url_status = self.get_url_status(self.url, obj_id)

                response = self.client.patch(
                    url_status,
                    self.get_request_data_status(new_obj_status),
                    format="json",
                )

                path = obj_status + new_obj_status
                if path in permitted_paths:
                    self.assertEqual(response.status_code, status.HTTP_200_OK)
                else:
                    self.assertIn(
                        response.status_code,
                        [status.HTTP_404_NOT_FOUND, status.HTTP_400_BAD_REQUEST],
                        f"path {path}",
                    )

        self.client.logout()

    def test_permissions_for_anon(self) -> None:
        self.client.logout()
        user = self.create_test_employer_user()

        url = self.url

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        for obj_status in [
            ConstDocumentStatus.draft,
            ConstDocumentStatus.approved,
            ConstDocumentStatus.rejected,
            ConstDocumentStatus.pending,
        ]:
            obj_id = self.create_test_employer(user, obj_status).id
            url_detail = self.get_url_detail(self.url, obj_id)
            url_status = self.get_url_status(self.url, obj_id)

            response = self.client.get(url_detail, format="json")
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
            response = self.client.put(url_detail, {}, format="json")
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
            response = self.client.patch(url_detail, {}, format="json")
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
            response = self.client.delete(url_detail, format="json")
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
            response = self.client.patch(url_status, {}, format="json")
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_permissions_for_moderator(self) -> None:
        user = self.create_test_employer_user()
        self.client.force_login(self.tu_moderator)

        url = self.url

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        for obj_status in [
            ConstDocumentStatus.draft,
            ConstDocumentStatus.approved,
            ConstDocumentStatus.rejected,
            ConstDocumentStatus.pending,
        ]:
            obj_id = self.create_test_employer(user, obj_status).id
            url_detail = self.get_url_detail(self.url, obj_id)

            response = self.client.get(url_detail, format="json")
            if obj_status in (
                ConstDocumentStatus.pending,
                ConstDocumentStatus.approved,
            ):
                self.assertIn(
                    response.status_code,
                    (status.HTTP_200_OK, status.HTTP_404_NOT_FOUND),
                )
            else:
                self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

            response = self.client.put(url_detail, {}, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND),
            )
            response = self.client.patch(url_detail, {}, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND),
            )
            response = self.client.delete(url_detail, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND),
            )

        self.client.logout()

    def test_permissions_for_employee(self) -> None:
        user = self.create_test_employer_user()
        self.client.force_login(self.tu_employee)

        url = self.url

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        for obj_status in [
            ConstDocumentStatus.draft,
            ConstDocumentStatus.approved,
            ConstDocumentStatus.rejected,
            ConstDocumentStatus.pending,
        ]:
            obj_id = self.create_test_employer(user, obj_status).id
            url_detail = self.get_url_detail(self.url, obj_id)

            response = self.client.get(url_detail, format="json")
            if obj_status == ConstDocumentStatus.approved:
                self.assertEqual(response.status_code, status.HTTP_200_OK)
            else:
                self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

            response = self.client.put(url_detail, {}, format="json")
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
            response = self.client.patch(url_detail, {}, format="json")
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
            response = self.client.delete(url_detail, format="json")
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.logout()

    def test_permissions_for_another_employer(self) -> None:
        user = self.create_test_employer_user()
        self.client.force_login(self.tu_employer)

        url = self.url

        for obj_status in [
            ConstDocumentStatus.draft,
            ConstDocumentStatus.approved,
            ConstDocumentStatus.rejected,
            ConstDocumentStatus.pending,
        ]:
            obj_id = self.create_test_employer(user, obj_status).id
            url_detail = self.get_url_detail(self.url, obj_id)

            response = self.client.get(url_detail, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND),
            )

            response = self.client.put(url_detail, {}, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND),
            )
            response = self.client.patch(url_detail, {}, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND),
            )
            response = self.client.delete(url_detail, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND),
            )

        self.client.logout()

    def tearDown(self) -> None:
        return super().tearDown()


class TestCVViewSets(RecrutingTestCase):
    """
    CV test.
    """

    test_data = {
        "title": "string",
        "position": "string",
        "salary": "52225",
        "description": "string",
        "experience": [
            {
                "datefrom": "2024-06-22",
                "dateto": "2024-06-22",
                "is_current": False,
                "city": 1,
                "company": "string",
                "position": "string",
                "content": "string",
            }
        ],
        "education": [
            {
                "date": "2024-06-22",
                "specialty": "string",
                "institution": "string",
                "content": "string",
            }
        ],
    }

    @staticmethod
    def get_test_CV(status=ConstDocumentStatus.approved) -> CV:
        return CV.objects.filter(status=status).first()

    def setUp(self) -> None:
        self.url = "/api/v1.0/protected/cvs/"

        return super().setUp()

    def test_all_path(self) -> None:

        # create CV
        self.client.force_login(self.tu_employee)
        data = self.test_data
        url = self.url
        response = self.client.post(url, data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, f"{response.data}"
        )
        self.assertIsNotNone(response.data)

        new_id = response.data.get("id", None)
        self.assertIsNotNone(new_id)
        url_detail = self.get_url_detail(url, new_id)
        url_status = self.get_url_status(url, new_id)
        url_favorites = self.get_url_favorite(url, new_id)

        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        # to moderation 1
        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.pending),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, f"{response.data}")
        self.client.logout()

        # moderation -> reject
        self.client.force_login(self.tu_moderator)
        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.rejected),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.client.logout()

        # to moderation 2
        self.client.force_login(self.tu_employee)
        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.pending),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()

        # moderation -> approve
        self.client.force_login(self.tu_moderator)
        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.approved),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()

        # employer
        self.client.force_login(self.tu_employer)
        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.rejected),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.post(
            url_favorites,
            {},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.delete(
            url_favorites,
            {},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.client.logout()

        # delete
        self.client.force_login(self.tu_employee)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.client.logout()

    def test_permissions_for_anon(self) -> None:
        obj_id = self.get_test_CV().id
        url = self.url
        url_detail = self.get_url_detail(url, obj_id)
        url_status = self.get_url_status(url, obj_id)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.patch(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.patch(url_status, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_permissions_for_moderator(self) -> None:
        self.client.force_login(self.tu_moderator)
        url = self.url

        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        for status_id in (
            ConstDocumentStatus.draft,
            ConstDocumentStatus.rejected,
            ConstDocumentStatus.approved,
        ):
            obj_id = self.get_test_CV(status_id).id

            url_detail = self.get_url_detail(url, obj_id)
            url_status = self.get_url_status(url, obj_id)

            response = self.client.get(url_detail, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

            response = self.client.put(url_detail, {}, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

            response = self.client.patch(url_detail, {}, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

            response = self.client.delete(url_detail, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

        self.client.logout()

    def test_permissions_for_employer(self) -> None:
        self.client.force_login(self.tu_employer)
        url = self.url

        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        for status_id in (
            ConstDocumentStatus.draft,
            ConstDocumentStatus.rejected,
            ConstDocumentStatus.pending,
        ):
            obj_id = self.get_test_CV(status_id).id

            url_detail = self.get_url_detail(url, obj_id)
            url_status = self.get_url_status(url, obj_id)

            response = self.client.get(url_detail, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

            response = self.client.put(url_detail, {}, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

            response = self.client.patch(url_detail, {}, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

            response = self.client.delete(url_detail, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

        self.client.logout()

    def tearDown(self) -> None:
        self.client.logout()
        return super().tearDown()


class TestVacancyViewSets(RecrutingTestCase):
    """
    Vacancy test.
    """

    test_data = {
        "title": "string",
        "city": 1,
        "position": "string",
        "salary": 500,
        "description": "string",
    }

    @staticmethod
    def get_test_vacancy(status=ConstDocumentStatus.approved) -> Vacancy:
        return Vacancy.objects.filter(status=status).first()

    def setUp(self) -> None:
        self.url = "/api/v1.0/protected/vacancies/"

        return super().setUp()

    def test_all_path(self) -> None:

        # create
        self.client.force_login(self.tu_employer)
        data = self.test_data
        url = self.url
        response = self.client.post(url, data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, f"{response.data}"
        )
        self.assertIsNotNone(response.data)

        new_id = response.data.get("id", None)
        self.assertIsNotNone(new_id)
        url_detail = self.get_url_detail(url, new_id)
        url_status = self.get_url_status(url, new_id)
        url_favorite = self.get_url_favorite(url, new_id)

        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        # to moderation 1
        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.pending),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, f"{response.data}")
        self.client.logout()

        # moderation -> reject
        self.client.force_login(self.tu_moderator)
        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.rejected),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.client.logout()

        # to moderation 2
        self.client.force_login(self.tu_employer)
        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.pending),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()

        # moderation -> approve
        self.client.force_login(self.tu_moderator)
        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.approved),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()

        # employee
        self.client.force_login(self.tu_employee)
        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.rejected),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.post(
            url_favorite,
            {},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.delete(
            url_favorite,
            {},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.client.logout()

        # delete
        self.client.force_login(self.tu_employer)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.client.logout()

    def test_permissions_for_anon(self) -> None:
        obj_id = self.get_test_vacancy().id
        url = self.url
        url_detail = self.get_url_detail(url, obj_id)
        url_status = self.get_url_status(url, obj_id)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.patch(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.patch(url_status, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_permissions_for_moderator(self) -> None:
        self.client.force_login(self.tu_moderator)
        url = self.url

        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        for status_id in (
            ConstDocumentStatus.draft,
            ConstDocumentStatus.rejected,
            ConstDocumentStatus.approved,
        ):
            obj_id = self.get_test_vacancy(status_id).id

            url_detail = self.get_url_detail(url, obj_id)
            url_status = self.get_url_status(url, obj_id)

            response = self.client.get(url_detail, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

            response = self.client.put(url_detail, {}, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

            response = self.client.patch(url_detail, {}, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

            response = self.client.delete(url_detail, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

        self.client.logout()

    def test_permissions_for_employee(self) -> None:
        self.client.force_login(self.tu_employee)
        url = self.url

        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        for status_id in (
            ConstDocumentStatus.draft,
            ConstDocumentStatus.rejected,
            ConstDocumentStatus.pending,
        ):
            obj_id = self.get_test_vacancy(status_id).id

            url_detail = self.get_url_detail(url, obj_id)
            url_status = self.get_url_status(url, obj_id)

            response = self.client.get(url_detail, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

            response = self.client.put(url_detail, {}, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

            response = self.client.patch(url_detail, {}, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

            response = self.client.delete(url_detail, format="json")
            self.assertIn(
                response.status_code,
                (status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN),
            )

        self.client.logout()

    def tearDown(self) -> None:
        self.client.logout()
        return super().tearDown()


class TestCVResponseViewSets(RecrutingTestCase):
    """
    CV Response test.
    """

    @staticmethod
    def get_test_cv_response(status=ConstDocumentStatus.pending) -> CVResponse:
        return CVResponse.objects.filter(status=status).first()

    def setUp(self) -> None:
        self.url = "/api/v1.0/protected/cv-responses/"

        self.vacancy = Vacancy.objects.filter(
            owner=self.tu_employer, status=ConstDocumentStatus.approved
        ).first()
        self.vacancy.pk = None
        self.vacancy.save()

        self.cv = CV.objects.filter(
            owner=self.tu_employee, status=ConstDocumentStatus.approved
        ).first()
        self.cv.pk = None
        self.cv.save()

        return super().setUp()

    def test_all_path(self) -> None:

        # create
        self.client.force_login(self.tu_employer)
        data = {
            "cv": self.cv.id,
            "vacancy": self.vacancy.id,
        }
        url = self.url
        response = self.client.post(url, data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, f"{response.data}"
        )
        self.assertIsNotNone(response.data)

        new_id = response.data.get("id", None)
        self.assertIsNotNone(new_id)
        url_detail = self.get_url_detail(url, new_id)
        url_status = self.get_url_status(url, new_id)

        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        # to employee
        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.pending),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, f"{response.data}")
        self.client.logout()

        # employee -> reject
        self.client.force_login(self.tu_employee)
        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.rejected),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.client.logout()

        # to employee 2
        self.client.force_login(self.tu_employer)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        response = self.client.post(url, data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, f"{response.data}"
        )
        self.assertIsNotNone(response.data)

        new_id = response.data.get("id", None)
        self.assertIsNotNone(new_id)
        url_detail = self.get_url_detail(url, new_id)
        url_status = self.get_url_status(url, new_id)
        url_message = self.get_url_message(url, new_id)

        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.pending),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()

        # employee -> approve
        self.client.force_login(self.tu_employee)
        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.approved),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(
            url_message,
            self.get_request_data_message(),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.client.logout()

        # employee
        self.client.force_login(self.tu_employee)
        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.rejected),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(
            url_message,
            self.get_request_data_message(),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.client.logout()

        # delete
        self.client.force_login(self.tu_employer)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.client.logout()

    def test_permissions_for_anon(self) -> None:
        obj_id = self.get_test_cv_response().id
        url = self.url
        url_detail = self.get_url_detail(url, obj_id)
        url_status = self.get_url_status(url, obj_id)
        url_message = self.get_url_message(url, obj_id)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.patch(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.patch(url_status, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.patch(url_message, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_permissions_for_moderator(self) -> None:
        self.client.force_login(self.tu_moderator)
        obj_id = self.get_test_cv_response().id
        url = self.url
        url_detail = self.get_url_detail(url, obj_id)
        url_status = self.get_url_status(url, obj_id)
        url_message = self.get_url_message(url, obj_id)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) == 0)
        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.patch(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.patch(url_status, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.patch(url_message, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.logout()

    def tearDown(self) -> None:
        self.client.logout()
        return super().tearDown()


class TestVacancyResponseViewSets(RecrutingTestCase):
    """
    Vacancy Response test.
    """

    @staticmethod
    def get_test_vacancy_response(
        status=ConstDocumentStatus.pending,
    ) -> VacancyResponse:
        return VacancyResponse.objects.filter(status=status).first()

    def setUp(self) -> None:
        self.url = "/api/v1.0/protected/vacancy-responses/"

        self.vacancy = Vacancy.objects.filter(
            owner=self.tu_employer, status=ConstDocumentStatus.approved
        ).first()
        self.vacancy.pk = None
        self.vacancy.save()

        self.cv = CV.objects.filter(
            owner=self.tu_employee, status=ConstDocumentStatus.approved
        ).first()
        self.cv.pk = None
        self.cv.save()

        return super().setUp()

    def test_all_path(self) -> None:

        # create
        self.client.force_login(self.tu_employee)
        data = {
            "cv": self.cv.id,
            "vacancy": self.vacancy.id,
        }
        url = self.url
        response = self.client.post(url, data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, f"{response.data}"
        )
        self.assertIsNotNone(response.data)

        new_id = response.data.get("id", None)
        self.assertIsNotNone(new_id)
        url_detail = self.get_url_detail(url, new_id)
        url_status = self.get_url_status(url, new_id)

        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        # to employer
        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.pending),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, f"{response.data}")
        self.client.logout()

        # employer -> reject
        self.client.force_login(self.tu_employer)
        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.rejected),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.client.logout()

        # to employer 2
        self.client.force_login(self.tu_employee)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        response = self.client.post(url, data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, f"{response.data}"
        )
        self.assertIsNotNone(response.data)

        new_id = response.data.get("id", None)
        self.assertIsNotNone(new_id)
        url_detail = self.get_url_detail(url, new_id)
        url_status = self.get_url_status(url, new_id)
        url_message = self.get_url_message(url, new_id)

        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.pending),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()

        # employer -> approve
        self.client.force_login(self.tu_employer)
        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.approved),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(
            url_message,
            self.get_request_data_message(),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.client.logout()

        # employer
        self.client.force_login(self.tu_employer)
        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) > 0)

        response = self.client.patch(
            url_status,
            self.get_request_data_status(ConstDocumentStatus.rejected),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(
            url_message,
            self.get_request_data_message(),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.client.logout()

        # delete
        self.client.force_login(self.tu_employee)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.client.logout()

    def test_permissions_for_anon(self) -> None:
        obj_id = self.get_test_vacancy_response().id
        url = self.url
        url_detail = self.get_url_detail(url, obj_id)
        url_status = self.get_url_status(url, obj_id)
        url_message = self.get_url_message(url, obj_id)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.patch(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.patch(url_status, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.patch(url_message, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_permissions_for_moderator(self) -> None:
        self.client.force_login(self.tu_moderator)
        obj_id = self.get_test_vacancy_response().id
        url = self.url
        url_detail = self.get_url_detail(url, obj_id)
        url_status = self.get_url_status(url, obj_id)
        url_message = self.get_url_message(url, obj_id)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data) == 0)
        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.patch(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.patch(url_status, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.patch(url_message, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.logout()

    def tearDown(self) -> None:
        self.client.logout()
        return super().tearDown()
