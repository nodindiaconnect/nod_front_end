import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Uploads a single file to a Supabase Storage bucket and returns its public URL.
 *
 * @param {File} file - The file object (e.g. from an <input type="file"> onChange event)
 * @param {string} bucket - Storage bucket name (default: "products")
 * @param {string} folder - Optional folder/path prefix inside the bucket
 * @returns {Promise<{ path: string, publicUrl: string }>}
 */
export async function uploadFile(file, bucket = "products", folder = "") {
    if (!file) throw new Error("No file provided");

    const fileExt = file.name.split(".").pop();
    const uniqueName = `${crypto.randomUUID()}.${fileExt}`;
    const path = folder ? `${folder}/${uniqueName}` : uniqueName;

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return { path, publicUrl: publicUrlData.publicUrl };
}

/**
 * Convenience wrapper for uploading multiple named files at once, e.g.
 * the { floorPlan, propertyPhoto, referenceImage, video } object from
 * ProjectsPage's `files` state. Skips any keys with a null value.
 *
 * @param {Record<string, File|null>} filesMap
 * @param {string} bucket
 * @param {string} folder
 * @returns {Promise<Record<string, string>>} map of key -> publicUrl
 */
export async function uploadFiles(filesMap, bucket = "products", folder = "") {
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