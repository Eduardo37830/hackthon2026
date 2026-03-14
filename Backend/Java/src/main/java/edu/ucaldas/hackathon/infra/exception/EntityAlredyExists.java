package edu.ucaldas.hackathon.infra.exception;

/**
 * Exception thrown to indicate that an entity already exists in the system.
 * <p>
 * This exception is typically used to signal attempts to create or add an entity
 * that would violate uniqueness constraints.
 * </p>
 *
 * <p>
 * Example usage:
 * <pre>
 *     if (repository.exists(entity.getId())) {
 *         throw new EntityAlredyExists("Entity with ID already exists.");
 *     }
 * </pre>
 * </p>
 *
 * @author juan-manoel
 */
public class EntityAlredyExists extends RuntimeException {
    public EntityAlredyExists() {
        super("Entity already exists.");
    }

    public EntityAlredyExists(String message) {
        super(message);
    }

    public EntityAlredyExists(String message, Throwable cause) {
        super(message, cause);
    }

    public EntityAlredyExists(Throwable cause) {
        super(cause);
    }

    public EntityAlredyExists(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

}
