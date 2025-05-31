export class AppError extends Error{
    public statusCode:number;
    public details?:any;
    
    constructor(message = "Internal Server error",statusCode = 500,details?:any){
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this);
    }
}

export class ValidationError extends AppError{
    constructor(message = "Invalid Data",details?:any){
        super(message,400,details);
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad Request", details?: any) {
        super(message, 400, details);
    }
}

export class AuthError extends AppError{
    constructor(message = "UnAuthorized"){
        super(message,401);
    }
}

export class ForbiddenError extends AppError{
    constructor(message = "Forbidden"){
        super(message,403);
    }
}

export class NotFoundError extends AppError{
    constructor(message = "Resources Not Found"){
        super(message,404);
    }
}

export class RateLimitError extends AppError{
    constructor(message="Too Many Requests,please try again later!"){
        super(message,429);
    }
}

export class DataBaseError extends AppError{
    constructor(message="DataBase Error",details?:any){
        super(message,500,details);
    }
}

export class DBUserNotFoundError extends AppError {
    constructor(message = "User not found in database") {
        super(message, 404);
    }
}