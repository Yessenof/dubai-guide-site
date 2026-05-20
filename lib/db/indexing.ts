import type {
  NewsPostDetail,
  EventDetail,
  CalendarPageDetail,
} from "@/lib/db/news-events-calendar";

type RobotsDirective = { index: boolean; follow: boolean };

const INDEX: RobotsDirective = { index: true, follow: true };
const NOINDEX: RobotsDirective = { index: false, follow: true };

/** News: respects DB noindex flag. Returns NOINDEX if noindex=1. */
export function newsRobots(post: NewsPostDetail): RobotsDirective {
  return post.noindex === 1 ? NOINDEX : INDEX;
}

/** Event: no noindex field in DB. Reader gates on status=published. Safe to index. */
export function eventRobots(_event: EventDetail): RobotsDirective {
  return INDEX;
}

/** Calendar: no noindex field in DB. Reader gates on status=published. Safe to index. */
export function calendarRobots(_page: CalendarPageDetail): RobotsDirective {
  return INDEX;
}
