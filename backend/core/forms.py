from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from core.models import CFUser


class CFUserCreationForm(UserCreationForm):
    class Meta:
        model = CFUser
        fields = "__all__"


class CFUserChangeForm(UserChangeForm):
    class Meta:
        model = CFUser
        fields = "__all__"
