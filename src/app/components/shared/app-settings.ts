import { HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Permissions, UserPermissions } from "../permission/permission-model";

export class AppSettings {
    static headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    static API_Url = "http://dirlms.com/";
    static leads_URL = AppSettings.API_Url + "backend/leads";
    static employees_URL = AppSettings.API_Url + "backend/employees";
    static areas_URL = AppSettings.API_Url + "backend/areas";
    static levels_URL = AppSettings.API_Url + "backend/levels";
    static compound_URL = AppSettings.API_Url + "backend/compounds";
    static client_URL = AppSettings.API_Url + "backend/clients";
    static unit_URL = AppSettings.API_Url + "backend/units";
    static todo_URL = AppSettings.API_Url + "backend/todos";
    static activities_URL = AppSettings.API_Url + "backend/activities";
    static notifications_URL = AppSettings.API_Url + "backend/reminders";
    static gamification_URL = AppSettings.API_Url + "backend/points";
    static login_URL = AppSettings.API_Url + "login";
    static logout_URL = AppSettings.API_Url + "logout";
    static permissions_URL = AppSettings.API_Url + "backend/userPermissions";
    static broker_URL = AppSettings.API_Url + "backend/brokers";

    static DateDisplayFormat = "yyyy-MM-dd";
    static DateTimeDisplayFormat = "yyyy-MM-dd HH:mm:ss";

    static MainPageRoute: "home";

    static loggedInUser = {
        permissions: [],
    }
    static permissionPage = {
        Areas: {
            add: "area_add",
            edit: "area_edit",
            delete: "area_delete",
            view: "area_view"
        },
        Levels: {
            add: "level_add",
            edit: "level_edit",
            delete: "level_delete",
            view: "level_view"
        },
        Employees: {
            add: "employee_add",
            edit: "employee_edit",
            delete: "employee_delete",
            view: "employee_view"
        },
        Compounds: {
            add: "compound_add",
            edit: "compound_edit",
            delete: "compound_delete",
            view: "compound_view"
        },
        Units: {
            add: "unit_add",
            edit: "unit_edit",
            delete: "unit_delete",
            view: "Unit_view"
        },
        Clients: {
            add: "client_add",
            edit: "client_edit",
            delete: "client_delete",
            view: "client_view"
        },
        Activities: {
            add: "activity_add",
            edit: "activity_edit",
            delete: "activity_delete",
            view: "activity_view"
        },
        Points: {
            add: null,
            edit: "update_fixed_points",
            delete: null,
            view: null
        },
        Happy_Hour: {
            add: null,
            edit: "update_HappyHour_points",
            delete: null,
            view: null
        },
        Target: {
            add: null,
            edit: "update_Target_points",
            delete: null,
            view: null
        },
        Formula: {
            add: null,
            edit: "update_Formula_points",
            delete: null,
            view: null
        },
        System: {
            root_admin: "root_admin",
            team_leader: "team_leader",
            salesman: "salesman"
        }
    }
    static checkLoggedUserPermission(checkFor: string): boolean {
        if (AppSettings.loggedInUser.permissions.length > 0) {
            for (let permission of AppSettings.loggedInUser.permissions) {
                if (permission.name == checkFor) {
                    return true;
                }
            }
        }
        return false;
    }

    constructor() {
    }
}
