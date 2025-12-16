class ApiResponse {
  constructor(statusCode, message="sucess", data = null) {
    this.statusCode = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;