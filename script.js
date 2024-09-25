function fetchLastPostDate(feedUrl) {
    // Use the proxy service to bypass CORS issues
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;

    fetch(proxyUrl)
        .then(response => response.json())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
            // Extract pubDate from the first <item>
            const latestPostDateStr = xmlDoc.querySelector('channel > item > pubDate').textContent;
            const latestPostDate = new Date(latestPostDateStr);

            if (!isNaN(latestPostDate.getTime())) {
                const today = new Date();
                const timeDiff = Math.abs(today - latestPostDate);
                const daysSinceLastPost = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                
                document.getElementById('daysSincePost').textContent = `${daysSinceLastPost} day${daysSinceLastPost !== 1 ? 's' : ''} since the last post`;
            } else {
                document.getElementById('daysSincePost').textContent = 'Unable to parse the date.';
            }
        })
        .catch(error => {
            console.error('Error fetching RSS feed:', error);
            document.getElementById('daysSincePost').textContent = 'Failed to load the RSS feed.';
        });
}

window.onload = function() {
    const feedUrl = new URLSearchParams(window.location.search).get('feed');
    if (feedUrl) {
        fetchLastPostDate(feedUrl);
    } else {
        document.getElementById('daysSincePost').textContent = 'Feed URL not provided.';
    }
};
