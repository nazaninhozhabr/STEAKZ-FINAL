/**
 * Password Hashing Utilities
 */

import bcrypt from 'bcrypt';

/**
 * @param password - Plain text password to hash
 * @returns Promise<string> - Secure hash of the password including salt
 */
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10; // Computational cost factor (2^10 = 1024 iterations)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}
/** 
 * @param password - Plain text password to verify
 * @param hashedPassword - Stored hash to compare against
 * @returns Promise<boolean> - True if password matches hash, false otherwise
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}