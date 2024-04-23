from django.core.mail import send_mail


def send_confirmation_mail(user):
    send_mail(
        "E-mail confirmation",
        "Your confirmation code is " + user.validation_code,
        "noreply@example.com",
        [user.email],
        fail_silently=False,
    )
