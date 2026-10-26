// Pages from the two real books in public/samples. The SEO pages were text
// and emoji only, so image search and Pinterest had nothing to pick up and a
// visitor read about a book without seeing one.
//
// Only two books exist (Noor's space story, Ava's dinosaur story), so the
// alt text and caption say exactly which book each image comes from. A
// mermaid page shows these and says so; it never implies a mermaid book.

type Sample = { src: string; alt: string };

const NOOR_COVER: Sample = {
  src: '/samples/cover-noor.jpg',
  alt: "Cover of Noor's Cosmic Adventure, a personalised Storykin storybook",
};
const NOOR_STARS: Sample = {
  src: '/samples/art-1.jpg',
  alt: "Noor and her fox companion under a starry sky, a page from Noor's Cosmic Adventure",
};
const NOOR_FLOWERS: Sample = {
  src: '/samples/art-3.jpg',
  alt: 'A girl and her fox companion among flowers, a page from a personalised Storykin storybook',
};
const AVA_COVER: Sample = {
  src: '/samples/cover-ava.jpg',
  alt: 'Cover of Ava and the Dinosaur Adventure, a personalised Storykin storybook',
};
const AVA_HATCHLING: Sample = {
  src: '/samples/art-2.jpg',
  alt: 'Ava meeting a baby dinosaur as it hatches, a page from Ava and the Dinosaur Adventure',
};
const AVA_FOREST: Sample = {
  src: '/samples/art-4.jpg',
  alt: 'Ava with a triceratops and its baby in a sunlit forest, a page from Ava and the Dinosaur Adventure',
};

const BY_SLUG: Record<string, Sample[]> = {
  dinosaur: [AVA_COVER, AVA_HATCHLING, AVA_FOREST],
  space: [NOOR_COVER, NOOR_STARS, NOOR_FLOWERS],
};
const MIXED: Sample[] = [AVA_COVER, NOOR_STARS, AVA_HATCHLING];

export default function SamplePages({ slug }: { slug: string }) {
  const samples = BY_SLUG[slug] ?? MIXED;
  return (
    <section className="px-6 pt-12">
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-3">
          {samples.map((s) => (
            <img
              key={s.src}
              src={s.src}
              alt={s.alt}
              width={760} height={760}
              loading="lazy"
              className="w-full aspect-square object-cover rounded-xl shadow-sm"
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">
          Pages from two real Storykin books. Yours is written and painted fresh for your child.
        </p>
      </div>
    </section>
  );
}
