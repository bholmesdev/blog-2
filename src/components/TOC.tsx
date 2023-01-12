import type { MarkdownHeading } from "astro";
import { createSignal, Setter } from "solid-js";
import s from "./TOC.module.css";

type Props = {
  headings: MarkdownHeading[];
};

export default function TOC(props: Props) {
  const [isExpanded, setIsExpanded] = createSignal(true);

  return (
    <>
      <ToggleButton setIsExpanded={setIsExpanded} />
      <ul
        class={s.toc}
        classList={{ [s.expanded]: isExpanded() }}
        aria-expanded={isExpanded()}
        role="list"
      >
        {props.headings.map((heading) => (
          <li>
            <a href={`#${heading.slug}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </>
  );
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
