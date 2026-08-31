export type Occasion = {
  slug: string; emoji: string; label: string;
  h1: string; title: string; description: string;
  intro: string[];
  why: { h: string; p: string }[];
  timing: string;
  tips: string[];
  faqs: { q: string; a: string }[];
  gradient: string;
  /** Optional extra prose, used where a page needs real depth (Christmas). */
  sections?: { h: string; p: string[] }[];
  /** Optional ordering deadlines table. */
  deadlines?: { label: string; by: string; note: string }[];
};

export const OCCASION_PAGES: Occasion[] = [
  {
    slug: 'birthday', emoji: '🎂', label: 'Birthday',
    h1: 'A personalised birthday book for a child who has everything',
    title: 'Personalised Birthday Gift For a Child — Their Own Storybook | Storykin',
    description: 'A birthday present that is not another plastic toy: a storybook written and illustrated for that one child, with their name on the cover. Preview before you pay.',
    gradient: 'linear-gradient(135deg, #FDF2F8, #FAE8FF)',
    intro: [
      'The problem with buying for a four year old is that the parents have already bought everything, and half of it is still in the box.',
      'A book with the child in it solves that, because there is no version of it already in the house. It gets read at bedtime rather than played with twice and forgotten by the weekend.',
    ],
    why: [
      { h: 'It is not a duplicate', p: 'Nobody else at the party has bought this, and nobody can. There is exactly one copy in existence.' },
      { h: 'The parents keep it', p: 'Toys get thinned out. Books with a child’s name in them go on the shelf and stay there — often long enough to be read to the next child.' },
      { h: 'It survives being opened in front of everyone', p: 'A book you can read aloud at the table works better as a party present than something that needs batteries and assembly.' },
    ],
    timing: 'Order about two weeks before the birthday for a printed book. If you have left it late, the digital edition arrives by email within minutes and can be printed at home or read on a tablet on the day.',
    tips: [
      'Use the name the child is actually called, not the one on their birth certificate. Seeing “Bea” rather than “Beatrice” is the thing that makes them sit up.',
      'Add their real pet as the companion. It is the detail children point at.',
      'Pick the lesson to suit the year they are having — “trying new things” for a child about to start school, “being brave” for one who has just moved house.',
    ],
    faqs: [
      { q: 'How long before the birthday should I order?', a: 'Two weeks is comfortable for a printed book: printing and dispatch take 2-4 business days and delivery depends on where you are. If it is closer than that, the digital edition arrives by email in minutes.' },
      { q: 'What age does this suit?', a: 'Two to eight. Younger children are read to; older ones read it themselves and notice their own name on every page.' },
      { q: 'Can I see it before I commit?', a: 'Yes — you read the entire finished book, every page and every illustration, before you are asked to pay anything.' },
    ],
  },
  {
    slug: 'christmas', emoji: '🎄', label: 'Christmas',
    h1: 'Personalised children\u2019s Christmas books, written for one child',
    title: 'Personalised Children\u2019s Christmas Books — A Storybook Made For Your Child | Storykin',
    description: 'Personalised Christmas books for kids: a storybook written and illustrated for one child, with their name and appearance throughout. Read the whole book before you pay. Order printed copies by early December.',
    gradient: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)',
    intro: [
      'Most Christmas gifts for kids are bought in a hurry and forgotten by February. Christmas morning produces a great deal of wrapping paper and a surprisingly small number of things anybody remembers.',
      'A book with the child in it is one of the few presents that gets better after the day, because it goes into the bedtime rotation and stays there.',
    ],
    why: [
      { h: 'It is the one nobody can duplicate', p: 'Every other present at Christmas exists in a warehouse somewhere. This one does not.' },
      { h: 'It reads well aloud on the day', p: 'A story you can read to a child while the room is still full of paper is worth more than a toy that needs setting up.' },
      { h: 'It becomes the thing they keep', p: 'Personalised books tend to survive every subsequent clear-out, which is not true of much else opened that morning.' },
    ],
    timing: 'Deadlines vary a lot by country, and the United States is the slowest — standard US post runs 10-14 business days on top of printing, so a US order placed in December will not arrive in time. Christmas is also the busiest period of the year for every print network. The digital edition has no such deadline: it arrives by email within minutes.',
    tips: [
      'Buying for several grandchildren? Make each book separately rather than reusing one. Two children with two books get two different stories, which is the entire point.',
      'A story about family or belonging reads particularly well at Christmas — it is one of the lesson options on the form.',
      'If you are shipping to a different household, order early enough that it does not arrive on the 27th.',
    ],
    deadlines: [
      { label: 'Printed book, United States', by: 'Friday 20 November', note: 'Standard US post runs 10-14 business days on top of 2-4 days printing, so a US order needs roughly a month. This is the earliest deadline of the four and the one people underestimate.' },
      { label: 'Printed book, Australia and Canada', by: 'Friday 27 November', note: 'Six to nine business days in transit, plus printing.' },
      { label: 'Printed book, UK and Europe', by: 'Friday 4 December', note: 'European delivery is considerably quicker than the US — usually 2-4 business days once printed.' },
      { label: 'Digital PDF, anywhere', by: 'Christmas Eve', note: 'Arrives by email within minutes. Print it at home or read it on a tablet on the day.' },
    ],
    sections: [
      {
        h: 'Why a book outlasts most Christmas gifts for kids',
        p: [
          'Christmas morning produces a great deal of wrapping paper and a surprisingly small number of things anyone remembers by February. The toys that seemed essential in the shop get played with twice and then live in a box.',
          'A book with the child in it goes into the bedtime rotation instead, which means it gets read forty times rather than once. That is the whole difference: it is not competing for attention on the day, it is competing for a place on the shelf afterwards.',
        ],
      },
      {
        h: 'Buying for several children',
        p: [
          'Make each book separately rather than reusing one. Every Storykin story is written from scratch, so two siblings get two genuinely different stories — different adventures, different illustrations — rather than the same book with the names swapped.',
          'This matters more than it sounds on Christmas morning. Children compare presents immediately, and two children opening obviously identical books notice at once. Two children opening two different stories, each about themselves, do not.',
        ],
      },
      {
        h: 'What age this suits',
        p: [
          'Two to eight is the range. Younger children are read to and recognise themselves in the pictures long before they can read the words. Around five or six they start reading their own name aloud, which is the age most parents say the book lands hardest.',
          'For a child at the older end, choose a theme with a bit more plot — superhero or magical kingdom — and pick a lesson that suits the year they have had.',
        ],
      },
      {
        h: 'Buying from a distance',
        p: [
          'Printed books are posted to whatever address you give at checkout, so a grandparent in another country can send one directly to their grandchild without it passing through their own hands.',
          'If you want to give it in person, order it to yourself with enough time to wrap it — see the deadlines above.',
        ],
      },
    ],
    faqs: [
      { q: 'What is the last date to order personalised Christmas books?', a: 'For the United States, order by 20 November — standard US post takes 10-14 business days on top of 2-4 days printing, so a US order needs about a month. UK and Europe are much quicker, so early December is fine there. Australia and Canada sit in between. The digital edition can be ordered as late as Christmas Eve and arrives by email in minutes.' },
      { q: 'Can I order books for several children at once?', a: 'Yes, and you should make each one separately. Each book is written from scratch, so two siblings get two genuinely different stories rather than the same book with different names in it.' },
      { q: 'Are personalised books a good Christmas present for kids who have everything?', a: 'That is most of what they are for. A personalised storybook cannot be a duplicate — there is one copy in existence and it has that child in it — so it works precisely when the obvious presents have all been bought already.' },
      { q: 'Can it be sent straight to the child?', a: 'Yes. You give the delivery address at checkout, so it can go directly to their house.' },
    ],
  },
  {
    slug: 'baby-shower', emoji: '🍼', label: 'Baby shower',
    h1: 'A personalised baby shower gift that is not another babygrow',
    title: 'Personalised Baby Shower Gift — A Book For The New Arrival | Storykin',
    description: 'A keepsake storybook made for one child, ready for the shelf before they can read. A baby shower present that lasts longer than the clothes.',
    gradient: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)',
    intro: [
      'Baby showers produce a lot of clothes in the 0-3 month size and a lot of things that will be outgrown before the thank-you cards go out.',
      'A book with the baby’s name in it is the present that is still in the house in six years, which is a strange and rather nice thing to be able to give.',
    ],
    why: [
      { h: 'It cannot be outgrown', p: 'Clothes last weeks. A named book gets read from the first months and keeps being read until the child is reading it themselves.' },
      { h: 'It stands out on the table', p: 'Among twelve soft toys and a stack of muslins, a printed book with the baby’s name on the cover is the one people pick up.' },
      { h: 'It is a keepsake by default', p: 'Parents keep first books. This one has their child’s name printed inside it, so it tends to end up in the memory box rather than the charity bag.' },
    ],
    timing: 'You need the baby’s name, so this works best for a shower where the name has been decided and shared, or as a gift shortly after the birth. If the name is still a secret, wait — the name is the whole gift.',
    tips: [
      'Choose a gentle theme. Ocean and forest stories read best to a very small child; superhero stories land better a few years later.',
      'Pick “family love and belonging” as the lesson. It is the one that suits a new arrival.',
      'If the name has not been announced, give it after the birth instead. A book with the wrong name is worse than a late present.',
    ],
    faqs: [
      { q: 'What if the parents have not chosen a name yet?', a: 'Then wait. The name is what makes the book, and it cannot be changed once printed. Giving it a few weeks after the birth works just as well and is often more memorable.' },
      { q: 'Is a storybook any use to a newborn?', a: 'Not for a while, and that is rather the point. It goes on the shelf and comes into use at around eighteen months, by which time most shower presents have gone.' },
      { q: 'Can I give it as a gift without knowing their address?', a: 'You can order the digital edition and forward the email, or order the printed book to yourself and give it in person.' },
    ],
  },
  {
    slug: 'grandparent', emoji: '💛', label: 'From grandparents',
    h1: 'A gift from grandparents that a grandchild actually keeps',
    title: 'Gift From Grandparents To Grandchild — A Personalised Storybook | Storykin',
    description: 'A storybook written for one grandchild, with their name, their colouring and their companion. Made in a few minutes, kept for years.',
    gradient: 'linear-gradient(135deg, #FFFBEB, #FEF9C3)',
    intro: [
      'Buying for a grandchild is harder than it should be. You are often at a distance, the parents have opinions about plastic, and anything popular has usually already been bought.',
      'A book with the child in it avoids all three problems. It is not a duplicate, it is not clutter, and it is the sort of present a child associates with a particular person for a very long time.',
    ],
    why: [
      { h: 'It comes from you, unmistakably', p: 'A named book is remembered as “the one Grandma gave me” in a way that a toy from a shop never quite is.' },
      { h: 'It works at a distance', p: 'It goes straight to their house, and it is something you can read together over a video call because you know exactly what is on each page.' },
      { h: 'It does not need approval from the parents', p: 'Nobody has ever objected to a book. It is the safest present in the house.' },
    ],
    timing: 'Printed books are dispatched within 2-4 business days and posted to the child’s address. If you want it for a particular day, order about two weeks ahead.',
    tips: [
      'Use the name they are called at home. Grandchildren notice nicknames more than formal names.',
      'You do not need to be good with computers. It is a few questions on one page, then you read the book we have written and decide.',
      'Add their pet or favourite toy as the companion — it is the detail that makes a child certain the book is about them.',
    ],
    faqs: [
      { q: 'I am not very confident with computers. Is this difficult?', a: 'No. There is one page of simple questions — the child’s name, their age, hair and eye colour, and a theme. Then you read the finished book on screen and decide whether to buy it. If anything goes wrong, email hello@storykinbooks.com and a person will help.' },
      { q: 'Can it be delivered straight to my grandchild?', a: 'Yes. You enter their address at checkout and it goes directly to them.' },
      { q: 'What if I get a detail wrong?', a: 'You see the whole book before paying, so you can check it first. If a printed book arrives with something wrong, we reprint it — see our refund policy.' },
    ],
  },
];

export const occasionBySlug = (s: string) => OCCASION_PAGES.find((o) => o.slug === s);
