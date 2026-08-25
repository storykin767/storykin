# Etsy listing — digital storybook

Start digital-only. No shipping, no production partner to declare, and it
earns the reviews a physical listing would need anyway. Add the printed book
as a second listing once there are reviews.

Images are in `marketing/etsy/`, 2000x2000, upload in filename order.

---

## Listing setup

| Field | Value |
|---|---|
| **Who made it** | **Designed by** — NOT "I made it". Required for AI-assisted work. |
| What is it | A finished product |
| When was it made | Made to order |
| Type | **Digital** — files delivered after purchase |
| Price | $9.99 |
| Processing time | 1-2 business days (real: usually a few hours) |
| Category | Books, Movies & Music > Books > Children's Books |

**Digital delivery caveat:** Etsy's instant-download flow does not work here,
because each book is made after the order. List it as a **made-to-order
digital item** and upload the finished PDF to the order's Files section when
it is ready. Etsy notifies the buyer.

---

## Title

Etsy weights the first 40 characters most heavily.

```
Personalised Children's Book, Custom Story Where Your Child is the Hero, Digital Storybook PDF, Personalized Gift for Kids, Birthday Present
```

## Tags (13, max 20 characters each)

```
personalised book
custom story book
personalized book
childrens book
custom storybook
digital storybook
gift for grandchild
birthday gift kids
kids christmas gift
printable book
story with name
keepsake gift
gift for toddler
```

## Personalisation field

Turn personalisation **on**, mark it required, and use this prompt:

```
Please tell me: 1) Child's first name  2) Age (2-8)  3) She/he/they
4) Hair colour  5) Eye colour  6) Skin tone (light, medium-light, medium,
medium-dark, dark)  7) Theme: dinosaur, space, ocean, forest, superhero or
magical kingdom  8) Optional: a sidekick's name and what it is, e.g.
"Buster the dog"  9) Optional lesson: bravery, kindness, sharing, trying new
things, friendship or family
```

---

## Description

```
A storybook written and illustrated for one child — and no one else.

Not a template with a name dropped into the gaps. Your child's book is
composed for them from scratch: their name, their hair, their eyes, the
companion they choose and the lesson you pick. Order two books for two
children and you get two genuinely different stories.

WHAT YOU RECEIVE
- A 29-page PDF, ready to read on a screen or print at home
- 12 full-page watercolour illustrations, painted for this story
- A dedication page carrying your child's name
- 8x8 inch square format, print-ready

WHAT YOU CHOOSE
Their name - age (2-8) - hair colour - eye colour - skin tone -
she/he/they - an optional sidekick - the lesson in the story
Six themes: dinosaur, space, ocean, forest, superhero, magical kingdom

HOW IT WORKS
1. Add to cart and fill in the personalisation box
2. I write and illustrate the book
3. The finished PDF is uploaded to your order, usually within a few hours

PERFECT FOR
Birthdays, Christmas, new siblings, and grandparents who want to give
something that gets kept rather than outgrown.

HOW THESE ARE MADE
Each book is generated to order using AI tools that I direct, working from a
story structure, illustration style and book design I built myself. Every
prompt, every layout and the whole system behind it is my own work. Nothing
is resold from a bundle and no two books are the same.

QUESTIONS
Message me before ordering if you are unsure about anything — I would rather
get the details right than reprint.
```

**Do not remove the "HOW THESE ARE MADE" section.** Etsy requires an explicit
AI disclosure in the description for AI-assisted listings, and enforcement is
strict enough that a missing one can suspend a shop without warning.

---

## Fulfilling an order

1. Etsy notifies you. Read the personalisation note.
2. Go to storykinbooks.com/create and enter those details.
3. Wait ~3 minutes, read the preview to check the name and details are right.
4. Build the digital PDF for that job:
   `python pdf_builder.py <job_id> digital`
   It prints a public URL. Download that file.
5. Upload the PDF to the Etsy order's Files section and mark it complete.
6. Message the buyer that it is ready.

Cost per order: about $0.50 of generation. Etsy takes roughly 6.5% plus fees,
so on $9.99 expect to keep around $8.50.

---

## After the first few reviews

Add a second listing for the printed 8x8 softcover at $39.99. That one needs
Gelato declared as a **production partner** in shop settings, and shipping
profiles set up. Do not start there — a physical listing with no reviews and
no photograph of a real printed book will not sell.
