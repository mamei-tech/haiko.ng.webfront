/***
 * This enum is used to specify to a component how it should specialize / adapt according to the entity that is defined.
 * This helps to tailor the components to specific use cases and entities accordingly
 */
export enum EntityTypes {
    // TODO refactor this EntityTypes to ENTITY_TYPES
    Default = 0,
    Staff = 1
}

/**
 * This helps to get entities names strings so one don't have to manually write it down on the code, just call this use it
 *
 * ! The values defined here must match one2one with the definition of EntityGenericNames type definition in the 'types-common.ts' file
 * ! The values defined here must match one2one with the business entity names we are working with
 */
export enum ENTITY_NAMES {
    DEFAULT = 'default',
    STAFF = 'staff',
    ROLE = 'role'
}
