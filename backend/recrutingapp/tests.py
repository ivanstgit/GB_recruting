"""
Tests of /account/ url path viewsets from userapp
"""

from rest_framework import status
from rest_framework.test import (
    APITestCase,
)

from recrutingapp.models import Employee, NewsPost, NewsTag
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


class TestNewsTagViewSet(RecrutingTestCase):
    """
    Moderator tags test.
    """

    def setUp(self) -> None:
        self.tags_url = "/api/v1.0/protected/news/tags/"
        return super().setUp()

    def test_tags(self) -> None:
        self.client.force_login(self.tu_moderator)

        data = {"name": "tag description"}
        response = self.client.post(self.tags_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data)

        tag_id = response.data.get("id", None)
        self.assertIsNotNone(tag_id)

        response = self.client.put(
            self.tags_url + str(tag_id) + "/", data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = {"name": "tag description 2"}
        response = self.client.get(self.tags_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data.get("results")) > 0)

        self.client.logout()

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

        news_post_id = response.data.get("id", None)
        self.assertIsNotNone(news_post_id)

        url_detail = self.posts_url + str(news_post_id) + "/"
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
        url_detail = url + str(self.newspost.id) + "/"

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
            url_detail = url + str(self.newspost.id) + "/"
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
        print(response)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data)

        employee_id = response.data.get("id", None)
        self.assertIsNotNone(employee_id)
        url_detail = url + str(employee_id) + "/"

        response = self.client.put(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.patch(url_detail, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertTrue(len(response.data.get("results")) > 0)

        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.client.logout()

    def test_permissions_for_anon(self) -> None:
        url = self.url
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        url_detail = self.url + str(self.employee.id) + "/"
        response = self.client.get(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.patch(url_detail, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.delete(url_detail, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_permissions_for_registered(self) -> None:
        url = self.url
        url_detail = self.url + str(self.employee.id) + "/"

        for user in [self.tu_moderator, self.tu_employer]:
            self.client.force_login(user)
            response = self.client.post(url, {}, format="json")
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
            self.client.logout()

        for user in [self.tu_moderator]:
            self.client.force_login(user)
            response = self.client.get(url, format="json")
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            response = self.client.get(url_detail, format="json")
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
            self.client.logout()

        for user in [self.tu_employer, self.tu_employee2]:
            self.client.force_login(user)
            response = self.client.get(url_detail, format="json")
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
            self.client.logout()

        for user in [self.tu_moderator, self.tu_employer, self.tu_employee2]:
            self.client.force_login(user)
            response = self.client.patch(url_detail, {}, format="json")
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
            response = self.client.delete(url_detail, format="json")
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
            self.client.logout()

        for user in [self.tu_employee2]:
            self.client.force_login(user)
            response = self.client.get(url_detail, format="json")
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
            self.client.logout()

    def tearDown(self) -> None:
        self.client.logout()
        return super().tearDown()
