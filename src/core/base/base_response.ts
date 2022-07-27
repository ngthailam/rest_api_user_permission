import { BaseError } from "./base_error"

// TODO: Use this as a wrapper for all responses
export class BaseResponse {
    public data: any

    public statusCode: number

    public error: BaseError
}
