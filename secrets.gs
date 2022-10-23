/**
 * @OnlyCurrentDoc
 */

/**
 * This file is for keeping service account secrets, and is excluded in GasHub when I sync to/from github.
 * 
 * You need to put your own service account credentials here.
 * How to create them is explained in the wiki.
 * 
 * Most recent key used here, so it only has access to Gmail.
 * private_key_id: "..."
 * 
 * These credentials are now only in this place. Loaded as global constants.
 */
const PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n';
const CLIENT_EMAIL = '...';
