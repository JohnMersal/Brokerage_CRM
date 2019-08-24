export class UserPermissions{
    id: number;
    system_module_id: number;
    label: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    pivot: {
        user_id: number;
        permission_id: number;
    }
}
export class SystemModule{
    id: number;
    module_name: string;
    created_at: Date;
    updated_at: Date;
    permissions: SinglePermission[]
}
export class SinglePermission{
    id: number;
    system_module_id: number;
    label: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}
export class Permissions {
    user_permissions: UserPermissions[];
    system_Modules: SystemModule[]
}
