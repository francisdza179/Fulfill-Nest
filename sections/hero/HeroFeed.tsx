import { HeartIcon, RibbonIcon } from "@/components/ui/Icons";
import { HeroShell } from "./HeroShell";

interface Shoutout {
  initials: string;
  avatarClass: string;
  name: string;
  team: string;
  time: string;
  message: string;
  likes: number;
}

const posts: Shoutout[] = [
  {
    initials: "AR",
    avatarClass: "bg-accent-100 text-accent-700",
    name: "Ananya R.",
    team: "Product",
    time: "2h",
    message: "You carried the entire launch — the whole team noticed. Thank you!",
    likes: 14,
  },
  {
    initials: "DK",
    avatarClass: "bg-linen text-walnut",
    name: "Dev K.",
    team: "Engineering",
    time: "1d",
    message:
      "Five years, five unforgettable quarters. This one's for the team behind it.",
    likes: 27,
  },
  {
    initials: "MS",
    avatarClass: "bg-warm-grey text-charcoal-60",
    name: "Meera S.",
    team: "People Ops",
    time: "just now",
    message: "Wellness month kicks off Monday — your hamper is already packed.",
    likes: 8,
  },
];

/**
 * Hero variant 2 — Recognition feed. A mini culture stream of peer
 * shoutouts: names, messages, team tags and likes. It sells the culture
 * rewards create rather than a single delivery moment.
 */
export function HeroFeed() {
  return <HeroShell visual={<RecognitionFeed />} />;
}

function RecognitionFeed() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <div
            key={post.name}
            className={`rounded-card border border-sand bg-white p-4 shadow-elev-1 sm:p-5 ${
              i === 1 ? "md:translate-x-5" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-grotesk text-sm font-bold ${post.avatarClass}`}
              >
                {post.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-charcoal">
                  {post.name}{" "}
                  <span className="font-normal text-taupe">· {post.team}</span>
                </p>
                <p className="text-xs text-stone">{post.time}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-walnut">{post.message}</p>
            <div className="mt-3 flex items-center gap-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-taupe">
                <HeartIcon className="h-4 w-4 text-accent-700" />
                {post.likes}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-taupe">
                <RibbonIcon className="h-4 w-4 text-accent-700" />
                Recognised
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}