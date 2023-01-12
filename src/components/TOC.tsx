import type { MarkdownHeading } from "astro";

type Props = {
  headings: MarkdownHeading[];
};

export default function TOC(props: Props) {
  return (
    <>
      <ul>
        {props.headings.map((heading) => (
          <li>
            <a href={`#${heading.slug}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
