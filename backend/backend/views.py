from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from core.models import CFUser


class CFTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user: CFUser):
        token = super().get_token(user)
        token["username"] = user.username
        token["email"] = user.email
        token["department"] = user.department
        return token


class CFTokenObtainPairView(TokenObtainPairView):
    serializer_class = CFTokenObtainPairSerializer
