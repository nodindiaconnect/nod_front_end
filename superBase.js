import { createClient } from "@supabase/supabase-js";
import { validateImageForContactInfo } from "./src/utils/imageTextValidator.js";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

// List of known public buckets in Supabase
const KNOWN_BUCKETS = ["designers", "products", "posts"];

/**
 * Uploads a single file to a Supabase Storage bucket and returns its public URL.
 *
 * @param {File} file - The file object (e.g. from an <input type="file"> onChange event)
 * @param {string} bucket - Storage bucket name (default: "designers")
 * @param {string} folder - Optional folder/path prefix inside the bucket
 * @returns {Promise<{ path: string, publicUrl: string }>}
 */
export async function uploadFile(file, bucket = "designers", folder = "") {
    if (!file) throw new Error("No file provided");

    // Scan image files for prohibited phone numbers, emails, or contact info
    const scanResult = await validateImageForContactInfo(file);
    if (!scanResult.isValid) {
        throw new Error(
            scanResult.error ||
            "Upload rejected: This image contains prohibited contact details (phone number or email)."
        );
    }

    const fileExt = file.name.split(".").pop();
    const uniqueName = `${crypto.randomUUID()}.${fileExt}`;
    const path = folder ? `${folder}/${uniqueName}` : uniqueName;

    // Direct all portfolio and professional uploads to "designers" bucket if bucket is not recognized
    let targetBucket = KNOWN_BUCKETS.includes(bucket) ? bucket : "designers";

    let { error: uploadError } = await supabase.storage
        .from(targetBucket)
        .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) {
        // Fallback to "designers" bucket if target bucket is unavailable
        const fallbackBucket = "designers";
        if (targetBucket !== fallbackBucket) {
            const { error: fallbackError } = await supabase.storage
                .from(fallbackBucket)
                .upload(path, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (fallbackError) {
                throw new Error(`Upload failed: ${uploadError.message}`);
            }
            targetBucket = fallbackBucket;
        } else {
            throw new Error(`Upload failed: ${uploadError.message}`);
        }
    }

    const { data: publicUrlData } = supabase.storage
        .from(targetBucket)
        .getPublicUrl(path);

    return { path, publicUrl: publicUrlData.publicUrl };
}

/**
 * Convenience wrapper for uploading multiple files.
 * Supports both an Array of Files: [File, File, ...] -> returns [{ path, publicUrl }, ...]
 * and a named object map: { key1: File, key2: File } -> returns { key1: url, key2: url }
 *
 * @param {File[]|Record<string, File|null>} filesMap
 * @param {string} bucket - default: "designers"
 * @param {string} folder
 * @returns {Promise<Array<{path: string, publicUrl: string}>|Record<string, string>>}
 */
export async function uploadFiles(filesMap, bucket = "designers", folder = "") {
    if (!filesMap) return Array.isArray(filesMap) ? [] : {};

    // If passed as an Array of files
    if (Array.isArray(filesMap)) {
        const results = await Promise.all(
            filesMap.filter(Boolean).map(async (file) => {
                const { publicUrl, path } = await uploadFile(file, bucket, folder);
                return { publicUrl, path };
            })
        );
        return results;
    }

    // If passed as a named dictionary of files
    const entries = Object.entries(filesMap).filter(([, file]) => !!file);
    const results = await Promise.all(
        entries.map(async ([key, file]) => {
            const { publicUrl } = await uploadFile(file, bucket, folder);
            return [key, publicUrl];
        })
    );

    return Object.fromEntries(results);
}

export default supabase;