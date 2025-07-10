import { UrlSegment } from "@angular/router";
import { isValidShortURLKey } from "@g2mu/core/services";

// exclude your “real” routes here
//!['auth', 'home', 'plans', 'app'].includes(segments[0].path)
const slugMatcher = (segments: UrlSegment[]) => {
  if (segments.length === 1 && isValidShortURLKey(segments[0].path)) {
    return { consumed: segments, posParams: { slug: segments[0] } };
  }
  return null;
}

export { slugMatcher };