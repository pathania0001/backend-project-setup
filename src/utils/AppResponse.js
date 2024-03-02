class ApiRespinse{
    constructor(statusCode,data,message="Success")
    {
        this.code=code
        this.message=message
        this.data=data
        this.success = statusCode<400
    }
}