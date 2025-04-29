from rest_framework.permissions import BasePermission

class CanCreateReadPermission(BasePermission):
    """
    Usuarios con permiso 12 pueden GET/POST; permiso 1 (administrador) puede todo.
    """
    def has_permission(self, request, view):
        # bypass total para el admin (permiso 1)
        if request.user.permisos.filter(id=1).exists():
            return True

        # para GET y POST, los 12 tienen acceso
        if request.method in ['GET', 'POST']:
            return request.user.permisos.filter(id=12).exists()

        return False


class CanEditDeletePermission(BasePermission):
    """
    Usuarios con permiso 10 pueden PUT/DELETE; permiso 1 (administrador) puede todo.
    """
    def has_permission(self, request, view):
        # bypass total para el admin (permiso 1)
        if request.user.permisos.filter(id=1).exists():
            return True

        # para PUT y DELETE, los 10 tienen acceso
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            return request.user.permisos.filter(id=10).exists()

        return False


class SupervisorPermission(BasePermission):
    """
    Usuarios con permiso 9 (Supervisor) o permiso 1 (administrador) pueden todo.
    """
    def has_permission(self, request, view):
        # bypass total para el admin (permiso 1)
        if request.user.permisos.filter(id=1).exists():
            return True

        # supervisores (id 9)
        return request.user.permisos.filter(id=9).exists()
