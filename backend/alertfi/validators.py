import re
from django.core.exceptions import ValidationError

def validate_email_domain(value):
    """
    Ensure the email is in the format: name@domain.tld (optionally with a country code).
    Accepts both name@example.com and name@example.com.ph
    """
    pattern = r'^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$'
    if not re.match(pattern, value):
        raise ValidationError(
            'Invalid email format. Example: name@example.com or name@example.com.ph'
        )

def validate_password_strength(value):
    """Ensure the password has at least 8 characters and a special character."""
    if len(value) < 8:
        raise ValidationError('Password must be at least 8 characters long.')

    if not re.search(r'[\W_]', value):
        raise ValidationError('Password must include at least one special character.')
