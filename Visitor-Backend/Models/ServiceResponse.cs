namespace Visitor_Backend.Models
{
    /**
     * This class is used to standardise the response from Services.
     * It helps in passing success status, data, and messages back to the controller.
     */
    public class ServiceResponse<T>
    {
        public T? Data { get; set; }
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;

        // Helper method for Success responses
        public static ServiceResponse<T> SuccessResponse(T data, string message = "")
        {
            return new ServiceResponse<T> { Data = data, Success = true, Message = message };
        }

        // Helper method for Failure responses
        public static ServiceResponse<T> FailureResponse(string message)
        {
            return new ServiceResponse<T> { Success = false, Message = message };
        }
    }
}
