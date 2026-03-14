package edu.ucaldas.hackathon.infra.exception;

/**
 * Exception thrown to indicate an error occurred while saving a file.
 * <p>
 * This exception can be used to signal various file saving issues,
 * such as I/O errors, permission problems, or other unexpected failures
 * during the file save operation.
 * </p>
 */
public class SaveFileError extends RuntimeException {
    public SaveFileError() {
        super("Error saving file.");
    }

    public SaveFileError(String message) {
        super(message);
    }

    public SaveFileError(String message, Throwable cause) {
        super(message, cause);
    }

    public SaveFileError(Throwable cause) {
        super(cause);
    }

    public SaveFileError(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

}
