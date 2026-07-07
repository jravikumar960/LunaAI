from duckduckgo_search import DDGS


def search_web(query: str):
    try:
        with DDGS(timeout=10) as ddgs:
            results = []

            for r in ddgs.text(
                query,
                max_results=5,
            ):
                results.append({
                    "title": r.get("title", ""),
                    "body": r.get("body", ""),
                    "href": r.get("href", "")
                })

            return results

    except Exception as e:
        return [{
            "title": "Search Error",
            "body": str(e),
            "href": ""
        }]