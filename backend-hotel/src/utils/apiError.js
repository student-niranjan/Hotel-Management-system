
class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);                 // (A)
    this.statusCode = statusCode;   // (B)
    this.message = message;         // (C)
    this.errors = errors;           // (D)
    this.success = false;           // (E)
    this.data = null;               // (F)

    if (stack) {                    // (G)
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // (H)
    }
  }
}
export default ApiError;