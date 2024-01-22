import { ResponsePagination, ResponseSuccess } from "src/interface/response";

class BaseResponse {
    _success(message: string, data?: any): ResponseSuccess {
        return {
            status: "Success",
            message: message,
            data: data || {}
        }
    }

    _pagiantion(
        message: string,
        data: any,
        totalData: number,
        page: number,
        pageSize: number,
    ): ResponsePagination {
        return {
            status: "Success",
            message: message,
            count: totalData,
            data: data,
            pagination: {
                page: page,
                pageSize: pageSize
            }
        }
    }
}

export default BaseResponse