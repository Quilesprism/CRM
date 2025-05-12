from rest_framework import permissions

class CanCreateReadPermission(permissions.BasePermission):
    """
    Permite acceso a operaciones de lectura (list, retrieve) y reportes
    para usuarios con roles específicos.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        permisos = request.user.permisos.all() if hasattr(request.user, 'permisos') else []
        permisos_nombres = [p.nombre for p in permisos]
            
        return (
            'administrador' in permisos_nombres or
            'backoficce fija' in permisos_nombres or
            'supervisor fija' in permisos_nombres or
            'asesor fija' in permisos_nombres  
        )

class CanEditDeletePermission(permissions.BasePermission):
    """
    Permite operaciones de modificación (update, partial_update, destroy)
    para usuarios con roles de administrador o backoffice.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        permisos = request.user.permisos.all() if hasattr(request.user, 'permisos') else []
        permisos_nombres = [p.nombre for p in permisos]
            
        return (
            'administrador' in permisos_nombres or
            'backoficce fija' in permisos_nombres
        )

class SupervisorPermission(permissions.BasePermission):
    """
    Otorga permisos específicos para supervisores.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        permisos = request.user.permisos.all() if hasattr(request.user, 'permisos') else []
        permisos_nombres = [p.nombre for p in permisos]
            
        return (
            'supervisor fija' in permisos_nombres or
            'administrador' in permisos_nombres
        )

class AsesorPermission(permissions.BasePermission):
    """
    Otorga permisos específicos para asesores para crear y subir ventas.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        permisos = request.user.permisos.all() if hasattr(request.user, 'permisos') else []
        permisos_nombres = [p.nombre for p in permisos]
            
        return (
            'asesor fija' in permisos_nombres or
            'supervisor fija' in permisos_nombres or
            'backoficce fija' in permisos_nombres or
            'administrador' in permisos_nombres
        )