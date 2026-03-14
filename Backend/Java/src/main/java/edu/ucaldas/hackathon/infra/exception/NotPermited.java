package edu.ucaldas.hackathon.infra.exception;

/**
 * Exception thrown to indicate that an operation is not permitted.
 * <p>
 * This exception is typically used to signal that the current user or context
 * does not have the necessary permissions to perform a specific action.
 * </p>
 *
 * <p>
 * Example usage:
 * <pre>
 *     if (!user.hasPermission(action)) {
 *         throw new NotPermited();
 *     }
 * </pre>
 * </p>
 *
 * @see RuntimeException
 */
public class NotPermited extends RuntimeException {
    public NotPermited() {
        super("You are not allowed to perform this action.");
    }

    public NotPermited(String message) {
        super(message);
    }

    public NotPermited(String message, Throwable cause) {
        super(message, cause);
    }

    public NotPermited(Throwable cause) {
        super(cause);
    }

    public NotPermited(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

}
