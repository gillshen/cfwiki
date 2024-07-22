from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView

from core.models import Student

from core.serializers import StudentSerializer, NewStudentSerializer


class StudentListView(ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentDetailView(RetrieveAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentCreateView(CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = NewStudentSerializer
