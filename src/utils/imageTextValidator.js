/**
 * Utility for performing Optical Character Recognition (OCR) and contact-info
 * detection on uploaded image files (projects, profile pictures, products, portfolios).
 *
 * Enforces policy: No phone numbers, mobile numbers, WhatsApp numbers, or emails
 * embedded inside uploaded images.
 */

import { createWorker } from "tesseract.js";

// Cached worker instance so subsequent OCR scans in the same session are near-instant
let sharedWorkerPromise = null;

async function getWorker() {
    if (!sharedWorkerPromise) {
        sharedWorkerPromise = (async () => {
            try {
                const worker = await createWorker("eng");
                return worker;
            } catch (err) {
                console.warn("Failed to initialize Tesseract worker:", err);
                sharedWorkerPromise = null;
                return null;
            }
        })();
    }
    return sharedWorkerPromise;
}

/**
 * Scales an image file down to max dimension (e.g. 1200px) and renders onto canvas.
 * This significantly speeds up OCR processing while retaining high recognition accuracy.
 */
function fileToOptimizedCanvas(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            try {
                const MAX_DIM = 1200;
                let { width, height } = img;
                if (width > MAX_DIM || height > MAX_DIM) {
                    if (width > height) {
                        height = Math.round((height * MAX_DIM) / width);
                        width = MAX_DIM;
                    } else {
                        width = Math.round((width * MAX_DIM) / height);
                        height = MAX_DIM;
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas);
            } catch (err) {
                reject(err);
            }
        };

        img.onerror = (err) => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load image for scanning"));
        };

        img.src = url;
    });
}

/**
 * Performs OCR text extraction using browser native TextDetector if present,
 * or tesseract.js worker as reliable cross-browser engine.
 */
export async function extractTextFromImage(file) {
    if (!file || typeof window === "undefined") return "";

    const isImage = file.type?.startsWith("image/") ||
        /\.(jpe?g|png|webp|bmp|tiff|gif)$/i.test(file.name || "");

    if (!isImage) return "";

    try {
        const canvas = await fileToOptimizedCanvas(file);

        // 1. Fast Path: Native Browser TextDetector (Chrome/Edge/Chromium)
        if ("TextDetector" in window) {
            try {
                const detector = new window.TextDetector();
                const detected = await detector.detect(canvas);
                if (Array.isArray(detected) && detected.length > 0) {
                    const extracted = detected.map((item) => item.rawValue || "").join(" ").trim();
                    if (extracted) return extracted;
                }
            } catch (detectorErr) {
                // Fall back to Tesseract
            }
        }

        // 2. Primary Engine: Tesseract.js in Web Worker
        const worker = await getWorker();
        if (worker) {
            const { data } = await worker.recognize(canvas);
            return data?.text || "";
        }

        return "";
    } catch (err) {
        console.warn("OCR extraction warning for", file.name, err.message);
        return "";
    }
}

/**
 * Scans a string of text for prohibited contact info:
 * - Phone numbers (7-15 digits formatted with spaces, dots, hyphens, parentheses, etc.)
 * - Email addresses (standard or obfuscated with [at], (at), etc.)
 * - Call/WhatsApp/Contact keywords associated with numbers
 *
 * @param {string} text
 * @returns {{ hasProhibitedInfo: boolean, reason?: string, matchedText?: string }}
 */
export function scanTextForContactInfo(text) {
    if (!text || typeof text !== "string") {
        return { hasProhibitedInfo: false };
    }

    const clean = text.replace(/[\u200B-\u200D\uFEFF]/g, ""); // remove zero-width chars

    // 1. Check for standard email addresses
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i;
    const emailMatch = clean.match(emailRegex);
    if (emailMatch) {
        return {
            hasProhibitedInfo: true,
            reason: "Image contains an email address.",
            matchedText: emailMatch[0],
        };
    }

    // 2. Check for obfuscated emails (e.g., user [at] domain [dot] com)
    const obfuscatedEmail = /\b[A-Za-z0-9._%+-]+\s*(?:@|\[at\]|\(at\))\s*[A-Za-z0-9.-]+\s*(?:\.|\[dot\]|\(dot\))\s*[A-Za-z]{2,}\b/i;
    const obMatch = clean.match(obfuscatedEmail);
    if (obMatch) {
        return {
            hasProhibitedInfo: true,
            reason: "Image contains an email address.",
            matchedText: obMatch[0],
        };
    }

    // 3. Contact keyword + number sequences (e.g. Call: 9876..., WhatsApp: +91...)
    const contactKeywordRegex = /(?:call|phone|ph|tel|mob|mobile|cell|whatsapp|wa|contact)[\s:=-]*([+\d\s().-]{6,20})/i;
    const keywordMatch = clean.match(contactKeywordRegex);
    if (keywordMatch) {
        const digitsOnly = keywordMatch[1].replace(/\D/g, "");
        if (digitsOnly.length >= 6) {
            return {
                hasProhibitedInfo: true,
                reason: "Image contains a contact/phone number.",
                matchedText: keywordMatch[0].trim(),
            };
        }
    }

    // 4. General phone number patterns
    // Matches numbers with 7 to 15 digits even if separated by spaces, dots, dashes, or parens
    // Examples: +91 98765 43210, 9876543210, 080-1234567, (123) 456-7890, 9876-543-210
    const phoneCandidateRegex = /(?:\+?\d{1,4}[\s().-]*)?(?:\(?\d{2,5}\)?[\s().-]*){2,5}\d{2,5}/g;
    const candidates = clean.match(phoneCandidateRegex) || [];

    for (const cand of candidates) {
        const digits = cand.replace(/\D/g, "");
        // 7 to 15 digits is typical for local, mobile, and international phone numbers
        if (digits.length >= 7 && digits.length <= 15) {
            // Exclude obvious year patterns (e.g. 2024, 2025, 2026 alone have length 4, not >= 7)
            return {
                hasProhibitedInfo: true,
                reason: "Image contains a phone number.",
                matchedText: cand.trim(),
            };
        }
    }

    // 5. Sequence of consecutive digits (any block of 7+ digits)
    const longDigitBlock = /\b\d{7,15}\b/;
    const blockMatch = clean.match(longDigitBlock);
    if (blockMatch) {
        return {
            hasProhibitedInfo: true,
            reason: "Image contains a phone or contact number.",
            matchedText: blockMatch[0],
        };
    }

    return { hasProhibitedInfo: false };
}

/**
 * Validates a single File object. If it's an image, extracts any text via OCR
 * and verifies that no phone numbers, mobile numbers, or emails are present.
 *
 * @param {File} file
 * @returns {Promise<{ isValid: boolean, error?: string, detectedText?: string }>}
 */
export async function validateImageForContactInfo(file) {
    if (!file) return { isValid: true };

    const isImage = file.type?.startsWith("image/") ||
        /\.(jpe?g|png|webp|bmp|tiff|gif)$/i.test(file.name || "");

    // Only inspect image files for visual contact text
    if (!isImage) return { isValid: true };

    try {
        const extractedText = await extractTextFromImage(file);
        if (!extractedText) return { isValid: true };

        const check = scanTextForContactInfo(extractedText);
        if (check.hasProhibitedInfo) {
            return {
                isValid: false,
                error: `Image "${file.name}" contains prohibited contact details (${check.reason.toLowerCase() || "phone number/email"}). Direct contact information is not permitted in uploaded images.`,
                detectedText: extractedText,
            };
        }

        return { isValid: true, detectedText: extractedText };
    } catch (err) {
        console.warn("Image contact validation error:", err);
        return { isValid: true }; // Do not block upload on scanner failure
    }
}
