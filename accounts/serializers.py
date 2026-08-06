from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Role


def _resolve_roles(role_names):
    roles = []
    for name in role_names or []:
        role, _ = Role.objects.get_or_create(name=name)
        roles.append(role)
    return roles


def _split_full_name(full_name):
    first, _, last = (full_name or '').strip().partition(' ')
    return first, last


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        token['roles'] = list(user.roles.values_list('name', flat=True))
        token['pwd_reset'] = user.force_password_change
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'full_name': self.user.get_full_name() or self.user.username,
            'is_staff': self.user.is_staff,
            'force_password_change': self.user.force_password_change,
            'roles': list(self.user.roles.values_list('name', flat=True)),
        }
        return data


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'is_system_role', 'permissions']


class UserListSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    fullName = serializers.SerializerMethodField()
    isActive = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'fullName', 'is_active',
                  'isActive', 'is_active_member', 'is_staff',
                  'force_password_change', 'roles']

    def get_roles(self, obj):
        return list(obj.roles.values_list('name', flat=True))

    def get_fullName(self, obj):
        return obj.get_full_name() or obj.username

    def get_isActive(self, obj):
        return obj.is_active and obj.is_active_member

    def update(self, instance, validated_data):
        data = self.initial_data

        if 'email' in data:
            instance.email = data['email']
        if 'fullName' in data:
            instance.first_name, instance.last_name = _split_full_name(data['fullName'])
        if 'isActive' in data:
            instance.is_active_member = bool(data['isActive'])
            instance.is_active = bool(data['isActive'])
        if 'is_staff' in data:
            instance.is_staff = bool(data['is_staff'])

        instance.save()

        if 'roles' in data:
            instance.roles.set(_resolve_roles(data['roles']))

        return instance


class UserCreateSerializer(serializers.ModelSerializer):
    roles = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    fullName = serializers.CharField(write_only=True, required=False, allow_blank=True)
    isActive = serializers.BooleanField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password',
                  'is_staff', 'isActive', 'roles', 'fullName']

    def create(self, validated_data):
        role_names = validated_data.pop('roles', [])
        full_name = validated_data.pop('fullName', '')
        is_active = validated_data.pop('isActive', True)
        password = validated_data.pop('password', None) or 'Welcome@123'
        first_name, last_name = _split_full_name(full_name)

        user = User(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            is_staff=validated_data.get('is_staff', False),
            is_active_member=is_active,
            is_active=is_active,
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(password)
        user.force_password_change = True
        user.save()
        user.roles.set(_resolve_roles(role_names))
        return user

    def to_representation(self, instance):
        return UserListSerializer(instance).data


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value


class MeSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    fullName = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'fullName', 'is_staff',
                  'is_active_member', 'force_password_change', 'roles']

    def get_roles(self, obj):
        return list(obj.roles.values_list('name', flat=True))

    def get_fullName(self, obj):
        return obj.get_full_name() or obj.username
