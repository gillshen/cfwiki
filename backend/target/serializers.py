from rest_framework import serializers
from target.models import School, Program


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = "__all__"


class SchoolCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = "__all__"


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = "__all__"

    class SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = ["id", "name"]

    schools = SchoolSerializer(many=True)
    display_name = serializers.CharField()


class ProgramCRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = "__all__"
