from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from core.models import CFUser


class CFTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user: CFUser):
        token = super().get_token(user)
        token["username"] = user.username
        token["is_active"] = user.is_active
        token["is_staff"] = user.is_staff
        token["is_superuser"] = user.is_superuser
        return token


class CFTokenObtainPairView(TokenObtainPairView):
    serializer_class = CFTokenObtainPairSerializer
