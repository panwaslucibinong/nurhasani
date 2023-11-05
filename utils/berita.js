const beritaApi = async (link) => {
    try {
        const response = await fetch(link);
        const data = await response.json();
        return data.data.posts;
    } catch (error) {
        throw error;
    }
}

module.exports = { beritaApi };