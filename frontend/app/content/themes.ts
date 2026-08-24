export type Theme = {
  slug: string; emoji: string; label: string;
  h1: string; title: string; description: string;
  intro: string[]; beats: { h: string; p: string }[];
  lines: string[]; faqs: { q: string; a: string }[];
  gradient: string;
};

export const THEME_PAGES: Theme[] = [
  {
    slug: 'dinosaur', emoji: '🦕', label: 'Dinosaur Adventure',
    h1: 'A personalised dinosaur book where your child is the hero',
    title: 'Personalised Dinosaur Book for Kids — Your Child as the Hero | Storykin',
    description: 'A dinosaur storybook written and illustrated for one child. They find the egg, they raise the hatchling, they get their name on the cover. Preview the whole book before you pay.',
    gradient: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
    intro: [
      'Nearly every small child goes through a dinosaur phase, and nearly every dinosaur book treats them as a spectator — facts about the Cretaceous, or a story about somebody else. This one puts them in it.',
      'In a Storykin dinosaur story your child finds the egg. They are the one who decides what to do about the enormous, hopeful creature that climbs out of it, and they are the one who works out how to get it home.',
    ],
    beats: [
      { h: 'They find something they were not meant to find', p: 'The story opens in a place a child actually recognises — a garden, a hedge, the long grass at the end of the lawn — and something is hidden there that should not be.' },
      { h: 'They have to decide what to do', p: 'A hatchling is not a toy. Your child is the one who feeds it, hides it, and gradually works out that it belongs somewhere else.' },
      { h: 'They do the brave thing', p: 'Every dinosaur story ends with a walk your child did not have to take, and a goodbye they chose. That is the bit that gets read again at bedtime.' },
    ],
    lines: [
      'The egg gave a wobble. Then it gave a crack. Then it gave a sneeze.',
      'It was warm as a loaf of bread and twice as heavy as the cat.',
      'A great shadow moved between the trees, and it was not frightening at all.',
    ],
    faqs: [
      { q: 'Is a dinosaur story too frightening for a toddler?', a: 'No. Storykin dinosaur books are about a small creature that needs looking after, not a predator. The tone is warm the whole way through, and you read the finished book before you decide to buy it — so you can check for yourself.' },
      { q: 'Which dinosaurs appear?', a: 'The story is written around your child rather than a species list, so the dinosaur is described as a character rather than labelled. If your child has a favourite, put it in the name of their companion and it will run through the whole book.' },
      { q: 'What age is a dinosaur book right for?', a: 'It works best between two and eight. Younger children get a bedtime story with a friendly creature in it; older ones follow the adventure and the decision at the end.' },
    ],
  },
  {
    slug: 'space', emoji: '🚀', label: 'Space Explorer',
    h1: 'A personalised space book starring your own child',
    title: 'Personalised Space Book for Children — Their Own Adventure | Storykin',
    description: 'A space storybook written for one child, with their name, their face and their companion among the stars. Read the whole book before you buy it.',
    gradient: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
    intro: [
      'A child who asks what is past the stars is asking a question nobody can properly answer. A space story is a good place to let them go and look.',
      'Storykin space books send your child somewhere far away and bring them safely home again, which is the only shape of adventure story that works at bedtime.',
    ],
    beats: [
      { h: 'Something in the sky calls them', p: 'The story starts on the ground, at night, with a child who cannot sleep and a light that behaves oddly.' },
      { h: 'They meet somebody strange and kind', p: 'Space in these books is populated by creatures who are odd-looking and entirely friendly. Nothing chases anybody.' },
      { h: 'They come home', p: 'Every journey ends back in the same garden it started from, which is what makes it safe to read to a small child at night.' },
    ],
    lines: [
      'Noor loved the night sky. She often wondered what lay beyond the stars.',
      'One night, a bright star twinkled extra brightly. It seemed to call her name.',
      'The ground was soft and silver, and it hummed very quietly under her feet.',
    ],
    faqs: [
      { q: 'Does the story get scary in space?', a: 'No. There is no danger, no monster and nothing chases your child. The tension comes from wonder and from being far from home, and the story always brings them back.' },
      { q: 'Can the book include a real interest, like planets or rockets?', a: 'The story is built from the details you give us. Name the companion after a favourite planet or a toy rocket and it threads through the whole book.' },
      { q: 'Is space a good theme for a child who is not yet reading?', a: 'It is one of the best, because the pictures carry the story. A child who cannot read yet can follow a night sky, a strange landscape and a journey home entirely from the illustrations.' },
    ],
  },
  {
    slug: 'mermaid', emoji: '🧜', label: 'Ocean Magic',
    h1: 'A personalised mermaid and ocean book made for one child',
    title: 'Personalised Mermaid Book — An Ocean Story For Your Child | Storykin',
    description: 'An underwater storybook written and illustrated for one child, with their name, their colouring and their chosen companion. Preview it in full before paying.',
    gradient: 'linear-gradient(135deg, #ECFEFF, #CFFAFE)',
    intro: [
      'Underwater stories give a child somewhere to go that is quiet, slow and full of colour — which makes them unusually good for winding down rather than winding up.',
      'A Storykin ocean story puts your child under the water as somebody who belongs there, with a companion beside them and something worth finding at the bottom.',
    ],
    beats: [
      { h: 'The water lets them in', p: 'The opening is the moment a child stops being a visitor to the sea and becomes part of it.' },
      { h: 'They find something hidden', p: 'A door, a chest, a light in the deep — there is always something that needs discovering, and your child is the one who spots it.' },
      { h: 'They put something right', p: 'Ocean stories end with a small kindness rather than a battle: a creature helped home, a lost thing returned.' },
    ],
    lines: [
      'The water was warm and full of small silver fish that were not at all afraid.',
      'Something was glowing down where the light usually stopped.',
      'She held on, and the whole sea seemed to lean in to listen.',
    ],
    faqs: [
      { q: 'Does my child have to be a mermaid in the story?', a: 'Not necessarily — the story is built around the child you describe. Ocean books work equally well as a swimming adventure or an underwater kingdom, and the illustrations follow the words.' },
      { q: 'Is this only for girls?', a: 'No. You choose the pronouns on the form — she, he or they — and the story is written accordingly. Ocean stories suit any child who likes water, colour and quiet.' },
      { q: 'Is an ocean story calm enough for bedtime?', a: 'It is the calmest of the six themes. The pace is slow, nothing chases anyone, and the palette is deliberately soft.' },
    ],
  },
  {
    slug: 'forest', emoji: '🌲', label: 'Enchanted Forest',
    h1: 'A personalised forest story with your child and the animals',
    title: 'Personalised Animal & Forest Storybook For Kids | Storykin',
    description: 'A woodland storybook written for one child, full of talking animals and a small adventure of their own. Read every page before you decide to buy.',
    gradient: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
    intro: [
      'Forest stories are the oldest kind there is, and they work because a wood is somewhere a child can imagine walking into from their own back door.',
      'A Storykin forest book fills that wood with animals who talk, a path that goes further than expected, and a child who turns out to be exactly the right person to help.',
    ],
    beats: [
      { h: 'The path goes further than usual', p: 'It begins somewhere ordinary and keeps going, which is how every good woodland story starts.' },
      { h: 'The animals need something', p: 'Somebody small is lost, or stuck, or worried, and your child is the one who notices.' },
      { h: 'They are trusted with something', p: 'Forest stories end with the animals treating your child as one of their own, which is a quietly enormous thing to be told at four years old.' },
    ],
    lines: [
      'The ferns whispered, though there was no wind at all.',
      'A fox sat down in the middle of the path as if it had been waiting all morning.',
      'They walked her all the way to the edge of the trees, and then a little further.',
    ],
    faqs: [
      { q: 'Are the animals frightening?', a: 'No. Every animal in a Storykin forest story is friendly, and there is no predator or chase. The problem to be solved is always a small, kind one.' },
      { q: 'Can we include a real pet?', a: 'Yes, and it is the detail children react to most. Add your dog, cat or rabbit as the companion and it appears throughout the story and the illustrations.' },
      { q: 'What makes this different from other animal books?', a: 'The animals are meeting your child specifically — their name, their hair, their eyes — rather than a generic character the book was printed with.' },
    ],
  },
  {
    slug: 'superhero', emoji: '⚡', label: 'Superhero',
    h1: 'A personalised superhero book where your child saves the day',
    title: 'Personalised Superhero Book For Kids — Their Own Powers | Storykin',
    description: 'A superhero storybook written for one child, where they discover what they can do and use it to help somebody. Preview the finished book before paying.',
    gradient: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
    intro: [
      'Superhero stories are usually about somebody impossibly far away. The useful version, for a small child, is about somebody exactly their size discovering they can do something.',
      'A Storykin superhero book is about the discovery and what your child chooses to do with it — which is almost always helping somebody rather than defeating somebody.',
    ],
    beats: [
      { h: 'Something happens that should not', p: 'The power arrives by accident, in the middle of an ordinary day, and takes some getting used to.' },
      { h: 'They practise, badly', p: 'The funniest pages in these books are the ones where it goes wrong, which is also the bit that teaches persistence without saying so.' },
      { h: 'They use it for somebody else', p: 'The day is saved for a friend, a neighbour or an animal — never against a villain. There is nobody to be frightened of.' },
    ],
    lines: [
      'It happened on a Tuesday, which is not a day anyone expects to be special.',
      'The first three tries did not work at all, and the fourth one worked far too well.',
      'Nobody saw. That was somehow the best part.',
    ],
    faqs: [
      { q: 'Is there a villain?', a: 'No. Storykin superhero stories are about discovering an ability and helping somebody with it. There is no fighting and nothing to be scared of at bedtime.' },
      { q: 'What power does my child get?', a: 'It is written to suit the child you describe and the lesson you choose — courage, kindness, trying new things. The power serves the story rather than the other way round.' },
      { q: 'Will it suit an older child?', a: 'Superhero is the theme that stretches furthest up the age range. Seven and eight year olds follow the practising and the choice at the end.' },
    ],
  },
  {
    slug: 'princess', emoji: '👑', label: 'Magical Kingdom',
    h1: 'A personalised princess and kingdom book for your child',
    title: 'Personalised Princess Book For Kids — A Kingdom Of Their Own | Storykin',
    description: 'A magical kingdom storybook written and illustrated for one child, with their name, their colouring and their companion. See the whole book before you buy.',
    gradient: 'linear-gradient(135deg, #FDF2F8, #FCE7F3)',
    intro: [
      'A kingdom story gives a child somewhere with rules, a castle and a job to do, which is why the genre has lasted several hundred years.',
      'The Storykin version gives them the job rather than the tiara. Your child is the one the kingdom needs, and the story is about what they actually do about it.',
    ],
    beats: [
      { h: 'The kingdom has a problem', p: 'Something small has gone wrong in a large and beautiful place, and nobody has noticed but your child.' },
      { h: 'They are the one who goes', p: 'Not the knight, not the adult, not the dragon. Your child sets off, usually with the companion you chose.' },
      { h: 'They fix it by being kind', p: 'Kingdom stories end with a problem solved by noticing something, not by defeating anybody.' },
    ],
    lines: [
      'The whole castle had gone quiet, which had never happened before breakfast.',
      'The dragon, it turned out, was simply extremely lonely.',
      'They gave her a title she could not pronounce, and she liked it enormously.',
    ],
    faqs: [
      { q: 'Is this only for girls?', a: 'No. You choose the pronouns and the story follows. Kingdom stories work for any child who likes castles, dragons and being the one who sorts things out.' },
      { q: 'Is there a rescue by a prince?', a: 'No. Your child is the one who goes and the one who solves it. Nobody is waiting to be rescued.' },
      { q: 'Are dragons frightening in these books?', a: 'They tend to turn out to be friendly, and often to be the thing that needed helping. Nothing chases your child.' },
    ],
  },
];

export const themeBySlug = (s: string) => THEME_PAGES.find((t) => t.slug === s);
