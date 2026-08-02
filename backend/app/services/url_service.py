import re
import requests
from bs4 import BeautifulSoup
from youtube_transcript_api import YouTubeTranscriptApi

def is_youtube_url(url: str) -> bool:
    """Checks whether a given URL is a YouTube link."""
    youtube_regex = r"(https?://)?(www\.)?(youtube\.com|youtu\.be)/(watch\?v=|embed/|v/|shorts/)?([a-zA-Z0-9_-]{11})"
    return bool(re.search(youtube_regex, url))

def extract_youtube_video_id(url: str) -> str | None:
    """Extracts the 11-character YouTube video ID from various YouTube URL formats."""
    patterns = [
        r"(?:v=|\/)([a-zA-Z0-9_-]{11})(?:[\?&]|$)",
        r"youtu\.be\/([a-zA-Z0-9_-]{11})",
        r"youtube\.com\/embed\/([a-zA-Z0-9_-]{11})",
        r"youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})"
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def fetch_youtube_title(video_id: str) -> str:
    """Fetches video title using YouTube oEmbed API without requiring an API key."""
    try:
        oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        res = requests.get(oembed_url, timeout=5)
        if res.status_code == 200:
            data = res.json()
            return data.get("title", f"YouTube Video ({video_id})")
    except Exception as e:
        print(f"[YouTube Title Error] {e}")
    return f"YouTube Video ({video_id})"

def extract_youtube_transcript(video_id: str) -> str:
    """Fetches and formats transcript text for a YouTube video."""
    try:
        ytt = YouTubeTranscriptApi()
        # Try fetching default / available transcripts
        try:
            transcript_data = ytt.fetch(video_id)
        except Exception as e:
            # Try passing language list if available
            try:
                transcript_data = ytt.fetch(video_id, languages=['en', 'en-US', 'hi', 'ta', 'es', 'fr', 'de'])
            except Exception:
                # Fallback to list() method if present
                if hasattr(ytt, "list"):
                    transcripts = ytt.list(video_id)
                    first_t = next(iter(transcripts))
                    transcript_data = first_t.fetch()
                else:
                    raise e

        # Extract text snippets (handles both objects and dicts)
        text_snippets = []
        for item in transcript_data:
            if hasattr(item, "text"):
                text_snippets.append(item.text)
            elif isinstance(item, dict) and "text" in item:
                text_snippets.append(item["text"])
            else:
                text_snippets.append(str(item))

        full_text = " ".join(text_snippets)
        # Clean up repeated whitespace
        full_text = re.sub(r'\s+', ' ', full_text).strip()
        return full_text if full_text else f"Transcript is empty for YouTube Video ({video_id})."
    except Exception as e:
        print(f"[YouTube Transcript Error] {e}")
        return f"Could not fetch transcript for YouTube Video ({video_id}). The video may not have captions/subtitles enabled."

def extract_webpage_content(url: str) -> tuple[str, str]:
    """Scrapes clean text and title from a standard web page."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    # Ensure scheme
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, "html.parser")

        # Extract title
        page_title = ""
        if soup.title and soup.title.string:
            page_title = soup.title.string.strip()
        elif soup.find("h1"):
            page_title = soup.find("h1").get_text(strip=True)
        else:
            page_title = url

        # Remove irrelevant tags
        for element in soup(["script", "style", "nav", "footer", "header", "aside", "form", "noscript", "iframe", "svg"]):
            element.decompose()

        # Find main body container if present
        main_content = soup.find("article") or soup.find("main") or soup.find("div", {"role": "main"}) or soup.body

        if not main_content:
            main_content = soup

        # Extract text from paragraphs, headers, and list items
        paragraphs = main_content.find_all(["p", "h1", "h2", "h3", "h4", "li"])
        extracted_lines = [p.get_text(strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 15]

        if not extracted_lines:
            # Fallback to get all stripped text
            extracted_lines = [line.strip() for line in main_content.get_text(separator="\n").splitlines() if len(line.strip()) > 20]

        extracted_text = "\n\n".join(extracted_lines)
        return page_title, extracted_text.strip() or "No readable text content found on this webpage."

    except Exception as e:
        print(f"[Web Scraper Error] {e}")
        return url, f"Failed to fetch content from URL ({url}): {str(e)}"

def extract_content_from_url(url: str) -> dict:
    """Main router function to process either a YouTube link or a web page URL."""
    url = url.strip()
    if is_youtube_url(url):
        video_id = extract_youtube_video_id(url)
        if not video_id:
            return {
                "title": "YouTube Video",
                "text": "Invalid YouTube URL format.",
                "source_type": "youtube"
            }
        title = fetch_youtube_title(video_id)
        transcript = extract_youtube_transcript(video_id)
        return {
            "title": f"[Transcript] {title}",
            "text": transcript,
            "source_type": "youtube"
        }
    else:
        title, text = extract_webpage_content(url)
        return {
            "title": title,
            "text": text,
            "source_type": "url"
        }
