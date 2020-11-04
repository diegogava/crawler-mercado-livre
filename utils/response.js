module.exports = {

    success: (result, message = null) => {
        return {
            'statusCode': 200,
            'headers': {
                'Content-type': 'application/json'
            },
            'body': JSON.stringify({
                'message': message,
                'data': result,
                'status': 200,
                'redirectToATH': false
            })
        }
    },

    error: (message, statusCode, redirectToAth) => {
        return {
            'statusCode': statusCode,
            'headers': {
                'Content-type': 'application/json'
            },
            'body': JSON.stringify({
                'message': message,
                'data': {},
                'status': statusCode,
                'redirectToAth': redirectToAth
            })
        }
    },

    errorByException: (exception) => {
        return {
            'statusCode': exception.statusCode,
            'headers': {
                'Content-type': 'application/json'
            },
            'body': JSON.stringify({
                'message': exception.message,
                'data': {},
                'status': exception.statusCode,
                'redirectToAth': exception.redirectToAth
            })
        }
    }

}
