import type { MarkdownHeading } from "astro";
import { createEffect, For, JSX, Setter } from "solid-js";
import { createSignal } from "solid-js";

type Props = {
  headings: MarkdownHeading[];
};

const [headingSlug, setHeadingSlug] = createSignal<string | null>(null);

export function TOC(props: Props) {
  return (
    <div data-projector class="flex w-screen p-2 bg-red-100 overflow-clip">
      <p data-film class="w-max flex gap-2 whitespace-nowrap bg-red-200">
        <For each={props.headings}>
          {(heading) => (
            <span
              class="w-screen whitespace-nowrap overflow-hidden overflow-ellipsis"
              ref={(headingRef) => {
                createEffect(() => {
                  if (headingRef && heading.slug === headingSlug()) {
                    console.log({ heading });
                    headingRef.classList.add("bg-red-300");
                  }
                });
              }}
            >
              {heading.text}
            </span>
          )}
        </For>
      </p>
    </div>
  );
}

export function HeadingScrollObserver(props: { children: JSX.Element }) {
  let containerRef: HTMLDivElement | null = null;
  createEffect(() => {
    if (containerRef) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setHeadingSlug(entry.target.id);
            }
          });
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 1,
        }
      );

      const headings = containerRef.querySelectorAll("h2, h3");
      headings.forEach((heading) => {
        observer.observe(heading);
      });
    }
  });

  return <div ref={(ref) => (containerRef = ref)}>{props.children}</div>;
}

function ToggleButton(props: { setIsExpanded: Setter<boolean> }) {
  function toggle() {
    props.setIsExpanded((isExpanded) => !isExpanded);
  }

  return (
    <button
      onClick={toggle}
      class="toggle-dropdown"
      aria-haspopup="true"
      aria-controls="nav-dropdown"
      aria-expanded="false"
      aria-label="Nav toggle"
    >
      <svg viewBox="0 0 448 512" width="20">
        <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" />
      </svg>
    </button>
  );
}
