require("dotenv").config()
/**
 * Make call to Lightquark API.
 * Returns false if failed, otherwise returns data.
 *
 * @param {string} path  - Api endpoint, `/quark/me`
 * @param {"GET" | "POST" | "PATCH" | "PUT" | "DELETE"} method - Default GET
 * @param {object} body - Default empty object
 * @returns {object|false}
 */
async function apiCall(path, method = "GET", body = {}) {
    let options = {
        method: method,
        headers: {
            "Authorization": `Bearer ${process.env.LIGHTQUARK_TOKEN}`,
            "Content-Type": "application/json",
            "User-Agent": "lightquark-emote-importer",
            "lq-agent": "lightquark-emote-importer"
        }
    }
    // GET requests cannot have a body
    if (method !== "GET") {
        options.body = JSON.stringify(body);
    }

    try {
        let res = await fetch(`${process.env.LIGHTQUARK_BASEURL}/v2${path}`, options);
        let data = await res.json();
        if (data.request.success) return data; // Success
        // Return data, even though success is false
        if (data.request.status_code === 404) {
            return data;
        }
        // Failed :(
        return false;
    } catch (e) {
        console.log(e)
        return false;
    }
}

module.exports = apiCall;