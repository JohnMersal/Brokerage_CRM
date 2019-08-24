import { HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

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
    static permissions_URL = AppSettings.API_Url + "backend/userPermissions"

    static DateDisplayFormat = "yyyy-MM-dd";
    static DateTimeDisplayFormat = "yyyy-MM-dd HH:mm:ss";

    static MainPageRoute: "home";
    constructor(private snackBar: MatSnackBar, private snackbarConfig:MatSnackBarConfig) {
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, { duration: 2000, });
        this.snackbarConfig.direction = "ltr";
        this.snackbarConfig.duration = 2000;
        this.snackbarConfig.horizontalPosition = "center";
        this.snackbarConfig.verticalPosition = "bottom";
        this.snackbarConfig.politeness = "off";
    }
}
