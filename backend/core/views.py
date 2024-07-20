from rest_framework.generics import ListAPIView

from core.models import Student

from core.serializers import StudentSerializer


class StudentListView(ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
