from rest_framework.permissions import BasePermission


class HasRolePermission(BasePermission):
    message = "You do not have permission to perform this action."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_staff:
            return True
        required_roles = getattr(view, 'required_roles', None)
        if required_roles is None:
            return True
        if isinstance(required_roles, dict):
            action = getattr(view, 'action', None)
            roles = required_roles.get(action, ['Admin'])
        else:
            roles = required_roles
        return request.user.has_role(*roles)


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.is_staff
        )