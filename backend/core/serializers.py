from rest_framework import serializers
from core.models import Student, Contract


class StudentSerializer(serializers.ModelSerializer):
    class ContractSerializer(serializers.ModelSerializer):
        class Meta:
            model = Contract
            exclude = ["student"]

    class Meta:
        model = Student
        fields = "__all__"

    fullname = serializers.CharField()
    contracts_sorted = ContractSerializer(many=True)


class StudentCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

    student_name = serializers.CharField()


class ContractCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"
