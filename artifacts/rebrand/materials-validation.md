GATE: OPEN 77 (rounds used up)

# Materials revision validation

The request is an illustrated personal portfolio with sculpted depth, liquid glass and handmade pastel details. The generic skill template also requires exact one-screen sections, a full-screen footer, commercial copy vocabulary and a particular grid. Those requirements conflict with the preserved editorial portfolio content and the requested floating glass surfaces. This is not a clean gate pass. The complete remaining findings are recorded below. No checker or kit files were modified.

## Implementation

- Software portfolio, existing French and English routes, real projects and professional history.
- Client palette from DESIGN.md: cream, peach, lavender, sage and midnight. Georgia and Geist retain their roles, with local Caveat annotations and Maple Mono for code and metadata.
- Original studio art generated with the built-in imagegen tool in day and night lighting. Native pastel vector botanicals, sculpted ceramic objects, molded buttons and frosted reading cards.
- Dealt moment: liquid-hover, unchanged skill module, restrained to the studio artwork. No WebGL on phones or under reduced motion.
- No assumed facts, fake reviews, new brand name, stock-photo stand-ins, client slots or non-working signup forms. The existing real email and social accounts are retained.

## Code and content checks

Formatting, ESLint, Astro type checking and the production build pass. The build generates 39 pages. Local file references and article contents anchors resolve. Existing bundle-size warnings and non-blocking dependency hints remain.

## Waivers

- focus-ring, .focus\:outline-none:focus: The global :focus-visible rule in src/styles/materials.css supplies a visible 2px outline with !important. This generated utility is not the computed keyboard focus style.
- focus-ring, .focus-visible\:outline-none:focus-visible: The global :focus-visible rule in src/styles/materials.css supplies a visible 2px outline with !important. This generated utility is not the computed keyboard focus style.
- copy-fact, h1#hello: The first screen explicitly states the real location Nantes, France. The English location matcher does not recognize this French portfolio location line.
- copy-headings, h2#projects-heading: These are existing French portfolio section titles and factual job or education titles. The English commercial category vocabulary does not identify parcours, projets and the French education names.
- tilt, span.handwritten.hero-note: The user explicitly requests a hand-drawn aesthetic. Only this decorative handwritten annotation has a slight static angle; cards, text columns and interactive controls stay straight.

## Copy warnings retained

The French greeting keeps its exclamation mark. Strava figures are real activity data. Dates and field labels account for most eyebrow metadata. These are intentional uses of the existing personal content.

## Remaining gate findings

1. **nav-covers** at header.site-header "✧ marek. Projets Blog Présentations↗︎ Co"

   sits on top of the text "En prépa, j'ai continué à coder : un jeu" while the page scrolls: part of the line shows beside it

   Checker suggestion: make the fixed nav one opaque band across the whole screen, or let it scroll away with the page

2. **no-visual** at section#timeline "Mon parcours."

   pictures, effects and mocks cover 4% of this section; a feature section needs a visual (about 25% or more)

   Checker suggestion: give the section a visual: a UI fragment on a ground, real icons, or a photograph that fits

3. **no-visual** at section#running "Mes courses"

   pictures, effects and mocks cover 7% of this section; a feature section needs a visual (about 25% or more)

   Checker suggestion: give the section a visual: a UI fragment on a ground, real icons, or a photograph that fits

4. **off-grid** at section.hero.world-hero > div.hero-inner.wrap > div.hero-copy > p.eyebrow "✧ MAREK ELMAYAN / INGÉNIEUR LOGICIEL"

   left edge at 183.5px, 23.5px off the page margin at 160px (36 elements, like span.tiny-star)

   Checker suggestion: move it onto the page margin, or the column edge its section uses

5. **section-height** at footer#footer "✧marek.ProjetsBlogContactCVDesign System"

   the section is 218px tall (0.2 screens), 682px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)

   Checker suggestion: set the section to one screen or two (height: calc(var(--h,1) * 100vh), --h 1 or 2) and cut or split its content to fit

6. **section-height** at section#timeline "03 / Au fil du cheminMon parcours.Les ex"

   the section is 1395px tall (1.5 screens), 405px short of two screens (1800px): every section after the hero is one screen or two, 2px either way (SR-2)

   Checker suggestion: set the section to one screen or two (height: calc(var(--h,1) * 100vh), --h 1 or 2) and cut or split its content to fit

7. **section-height** at section#about "Marek, enchanté !Nantes, FranceUXCybersé"

   the section is 1241px tall (1.4 screens), 341px over one screen (900px): every section after the hero is one screen or two, 2px either way (and 4 more like it: "05 / Hors écranMes cours", "La suite s’écrit ensembl", "01 / De l’idée au produi") (SR-2)

   Checker suggestion: set the section to one screen or two (height: calc(var(--h,1) * 100vh), --h 1 or 2) and cut or split its content to fit

8. **section-height** at main#main-content > section.chapter.journal-chapter "04 / Notes de terrainLe journal d’un cur"

   the section starts at 5202px, 198px above the screen grid (6 x 900px): sections start on whole screens (SR-2)

   Checker suggestion: make every section above it exactly one or two screens tall, so this one starts on a whole screen

9. **section-height** at section#running "05 / Hors écranMes coursesJe trace ma ro"

   the section starts at 6134px, 166px above the screen grid (7 x 900px): sections start on whole screens (and 3 more like it: "✧marek.ProjetsBlogContac", "Marek, enchanté !Nantes,", "La suite s’écrit ensembl") (SR-2)

   Checker suggestion: make every section above it exactly one or two screens tall, so this one starts on a whole screen

10. **one-section** at section#about "Marek, enchanté !Nantes, FranceUXCybersé"

the screen at scroll 3600px (stride 4) shows 207px of section 3 and the content of 2 sections, over 24px each beside section 4: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)

Checker suggestion: make each section exactly one screen or two, so a screen shows one section and no neighbour peeks

11. **one-section** at div.section-shell > div.footer-top > a.wordmark > span.brand-spark "✧"

the screen at scroll 7254px (the top of section 7) shows 206px of section 8 and the heading of section 8 whole and the content of 2 sections, over 24px each beside section 7: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)

Checker suggestion: make each section exactly one screen or two, so a screen shows one section and no neighbour peeks

12. **one-section** at main#main-content > section.chapter.journal-chapter "04 / Notes de terrainLe journal d’un cur"

the screen at scroll 4500px (stride 5) shows 198px of section 5 and the content of 2 sections, over 24px each beside section 4: a screen shows one section (another may peek 8px, 24px WARN) (and 3 more like it: scroll 5400px, scroll 7200px, scroll 1800px) (SR-4)

Checker suggestion: make each section exactly one screen or two, so a screen shows one section and no neighbour peeks

13. **container-edges** at header.site-header "✧marek.ProjetsBlogPrésentations↗︎Contact"

the nav's content runs 180px from the left and 174px from the right (read from its outermost blocks: no .wrap): the page's container starts at 160px; 180 and 174px are not one margin; the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (SR-6)

Checker suggestion: use one container on every section and the nav (.wrap): one margin left and right, 64-120px on a desktop, 16-24px on a phone

14. **container-edges** at main#main-content > section.hero.world-hero "✧ Marek Elmayan /Ingénieur logicielCurie"

the content of section 1 runs 160px from the left and 160px from the right: the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (and 7 more like it: "01 / De l’idée au produi", "Marek, enchanté !Nantes,", "03 / Au fil du cheminMon") (SR-6)

Checker suggestion: use one container on every section and the nav (.wrap): one margin left and right, 64-120px on a desktop, 16-24px on a phone

15. **container-edges** at a.skip-link "Aller au contenu"

a <a> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)

Checker suggestion: build the page as header.nav, a main of sections (each one in-flow .wrap plus background layers) and footer.closing

16. **container-edges** at section.hero.world-hero > div.hero-inner.wrap > div.hero-workshop > div.hero-guardian.liquid-glass "La sécurité, dès la première ligne."

a box runs 1122-1312px, outside the container lines of section 1 at 160-1280px: full width is for background layers and grounds only (SR-6)

Checker suggestion: keep it inside the container lines (.wrap): full width is for background layers and grounds only

17. **container-edges** at div.hero-inner.wrap > div.hero-workshop > div.hero-guardian.liquid-glass > span:nth-of-type(2) "La sécurité, dès la première ligne."

"La sécurité, dès la première lig" runs 1188-1290px, outside the container lines of section 1 at 160-1280px: full width is for background layers and grounds only (SR-6)

Checker suggestion: keep it inside the container lines (.wrap): full width is for background layers and grounds only

18. **container-edges** at section.hero.world-hero > div.hero-inner.wrap > div.hero-workshop > span.handwritten.hero-note "Les bonnes idées commencent ici."

1 text block starts on a left line at x 1114, 954px from the container's left: text starts on the container's left, or on one split line (x 637, 732, 827) (and 8 more like it: x 716, x 705, x 622) (SR-6)

Checker suggestion: start the text on the container's left, or on the one split line every split shares

19. **container-edges** at section#timeline > ol.journey-list "janv. 2023 → Aujourd'huiIngénieur Logici"

a box over half the container wide runs 664-1280px, not on the container's lines at 160-1280px (SR-6)

Checker suggestion: run the picture or box from the container's left line to its right line, or put it in a row or a split

20. **row-lines** at astro-island:nth-of-type(1) > a.block.h-full > div.bg-card.border-border > div.my-auto.grid "9.9km5:16min/km109m152bpm"

a row of 4 items: its first item starts at 177px, the container's left line at 160px; its last item ends at 506px, the container's right line at 1280px (2px either way) (SR-7)

Checker suggestion: start the row's first item on the container's left line and end its last on the right line, every item one height

21. **row-lines** at astro-island:nth-of-type(4) > a.block.h-full > div.bg-card.border-border > div.my-auto.grid "9.1km6:08min/km85m133bpm"

a row of 4 items: its first item starts at 177px, the container's left line at 160px; its last item ends at 506px, the container's right line at 1280px (2px either way) (SR-7)

Checker suggestion: start the row's first item on the container's left line and end its last on the right line, every item one height

22. **row-lines** at astro-island:nth-of-type(3) > a.block.h-full > div.bg-card.border-border > div.my-auto.grid "4.1km5:25min/km38m149bpm"

a row of 4 items: its first item starts at 934px, the container's left line at 160px; its last item ends at 1263px, the container's right line at 1280px (2px either way) (and 6 more like it: "10.1km4:25min/km137m170b", "4:06min/km21.2km62m184bp", "4:56min/km89m83min157bpm") (SR-7)

Checker suggestion: start the row's first item on the container's left line and end its last on the right line, every item one height

23. **row-lines** at div.hero-inner.wrap > div.hero-workshop > div.hero-guardian.liquid-glass > span:nth-of-type(2) "La sécurité, dès la première ligne."

"La sécurité, dès la première lig" ends at 1290px, past the container's right line at 1280px (SR-7)

Checker suggestion: end it at the container's right line

24. **split-pair** at main#main-content > section.hero.world-hero > div.hero-inner.wrap "✧ Marek Elmayan /Ingénieur logicielCurie"

the two columns of the split start 54px apart at the top: a split's columns are top-aligned, 8px either way (SR-8)

Checker suggestion: top-align both columns of the split (align-items: start)

25. **split-pair** at section#contact > div.section-shell.contact-layout "La suite s’écrit ensembleEt si on constr"

the two columns of the split start 52px apart at the top (centred on each other): a split's columns are top-aligned, 8px either way (SR-8)

Checker suggestion: top-align both columns of the split (align-items: start)

26. **split-pair** at section#about > div.section-shell.about-layout "Marek, enchanté !Nantes, FranceUXCybersé"

the two columns of the split start 29px apart at the top: a split's columns are top-aligned, 8px either way (SR-8)

Checker suggestion: top-align both columns of the split (align-items: start)

27. **nav-covers** at header.site-header "✧ marek. EN Toggle theme"

sits on top of the text "Tout a commencé en classe de maths au ly" while the page scrolls: part of the line shows beside it

Checker suggestion: make the fixed nav one opaque band across the whole screen, or let it scroll away with the page

28. **spill** at div.hero-inner.wrap > div.hero-workshop > div.studio-scene > svg.sketch.sketch-botanical

runs 19px past the bottom edge of the panel it sits on (div.hero-workshop > div.studio-scene > div.studio-art.mo-lq > img)

Checker suggestion: keep the box inside the panel it starts on: shrink it, or grow the panel to hold it

29. **spill** at section.hero.world-hero > div.hero-inner.wrap > div.hero-workshop > div.hero-fieldnote.liquid-glass "MON TERRAIN DE JEU UX ↔︎ Code ↔︎Produit"

runs 27px past the bottom edge of the panel it sits on (div.hero-workshop > div.studio-scene > div.studio-art.mo-lq > img)

Checker suggestion: keep the box inside the panel it starts on: shrink it, or grow the panel to hold it

30. **heading-scale** at h2#projects-heading "Des idées qui prennent vie."

an h2 at 41.6px, as large as the h1 (39px) or larger (and 2 more like it: "Tout commence par « et s", "Mon parcours.")

Checker suggestion: size headings by level: the h1 largest, one size per level, each level below the one above

31. **off-grid** at section#projects > div.section-heading > svg.sketch.sketch-orbit

left edge at 8px, 12px off the page margin at 20px (55 elements, like p.eyebrow)

Checker suggestion: move it onto the page margin, or the column edge its section uses

32. **edge-left** at section.hero.world-hero div.hero-workshop "Mon terrain de jeuUX ↔︎ Code ↔︎P"

starts at x 706.3; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

33. **edge-left** at section.hero.world-hero p "UX ↔︎ Code ↔︎Produit"

starts at x 786.9; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

34. **edge-left** at #projects h3 "Blink"

starts at x 189.8; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

35. **edge-left** at #projects p "Un sélecteur de navigateur natif"

starts at x 189.8; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

36. **edge-left** at #projects h3 "Portfolio Personnel"

starts at x 765.8; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

37. **edge-left** at #projects p "Un portfolio développeur ultra-r"

starts at x 765.8; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

38. **edge-left** at #projects h3 "Minesweeper LLM Arena"

starts at x 189.8; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

39. **edge-left** at #projects p "Projet de hackathon AI Gateway —"

starts at x 189.8; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

40. **edge-left** at #projects h3 "Next Armored"

starts at x 765.8; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

41. **edge-left** at #projects p "Toolkit de middleware NextJs pou"

starts at x 765.8; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

42. **edge-left** at #about p.eyebrow "02 / À propos"

starts at x 597.3; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

43. **edge-left** at #about h2 "Tout commence par« et si… »"

starts at x 597.3; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

44. **edge-left** at #about p "Tout a commencé en classe de mat"

starts at x 597.3; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

45. **edge-left** at #about p "En prépa, j'ai continué à coder "

starts at x 597.3; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

46. **edge-left** at #about p "Aujourd'hui, je me concentre sur"

starts at x 597.3; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

47. **edge-left** at #about p "Je suis aussi fasciné par la cyb"

starts at x 597.3; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

48. **edge-left** at #about p "J'apporte une grande attention a"

starts at x 597.3; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

49. **edge-left** at #about p "Construire des choses qui compte"

starts at x 654.2; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

50. **edge-left** at #timeline ol.journey-list "janv. 2023 → Aujourd'huiIngénieu"

starts at x 664; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

51. **edge-left** at section.chapter.journal-chapter h3 "Le prompt caching dans Claude Co"

starts at x 343.6; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

52. **edge-left** at section.chapter.journal-chapter p "Lecture de cache, écriture de ca"

starts at x 343.6; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

53. **edge-left** at section.chapter.journal-chapter h3 "Comment rester intellectuellemen"

starts at x 343.6; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

54. **edge-left** at section.chapter.journal-chapter p "L'IA est capable d'écrire pratiq"

starts at x 343.6; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

55. **edge-left** at section.chapter.journal-chapter h3 "Clickjacking : comment cinq lign"

starts at x 343.6; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

56. **edge-left** at section.chapter.journal-chapter p "Une attaque par iframe invisible"

starts at x 343.6; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

57. **edge-left** at #running p.flex.items-center "25 oct."

starts at x 555.7; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

58. **edge-left** at #running div.text-center "4:56min/km"

starts at x 555.7; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

59. **edge-left** at #running p.text-sm.font-bold "4:56"

starts at x 555.7; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

60. **edge-left** at #running p.text-xs.text-emerald-700/70 "min/km"

starts at x 555.7; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

61. **edge-left** at #running div.text-center "89m"

starts at x 639.8; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

62. **edge-left** at #running p.text-sm.font-bold "89"

starts at x 639.8; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

63. **edge-left** at #running p.text-xs.text-emerald-700/70 "m"

starts at x 639.8; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

64. **edge-left** at #running div.text-center "83min"

starts at x 724; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

65. **edge-left** at #running p.text-sm.font-bold "83"

starts at x 724; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

66. **edge-left** at #running p.text-xs.text-emerald-700/70 "min"

starts at x 724; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

67. **edge-left** at #running div.text-center "157bpm"

starts at x 808.2; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

68. **edge-left** at #running p.text-sm.font-bold "157"

starts at x 808.2; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

69. **edge-left** at #running p.text-xs.text-emerald-700/70 "bpm"

starts at x 808.2; the lines are 160 and the column starts

Checker suggestion: start it on the .wrap left line

70. **screen-height** at #projects section.chapter.section-shell "01 / De l’idée au produitDes idé"

1666px, 1.85 screens; a section is exactly one or two (--h)

Checker suggestion: make the section exactly one or two screens (--h: 1 or 2)

71. **neighbour** at #projects section.chapter.section-shell "01 / De l’idée au produitDes idé"

framed, 20px of #about section.chapter.about-chapter "Marek, enchanté !Nantes, FranceU" shows

Checker suggestion: keep the next section's heading and picture out of this screen

72. **neighbour** at #timeline section.chapter.section-shell "03 / Au fil du cheminMon parcour"

framed, 66px of section.chapter.journal-chapter section.chapter.journal-chapter "04 / Notes de terrainLe journal " shows

Checker suggestion: keep the next section's heading and picture out of this screen

73. **screen-height** at section.chapter.journal-chapter section.chapter.journal-chapter "04 / Notes de terrainLe journal "

932px, 1.04 screens; a section is exactly one or two (--h)

Checker suggestion: make the section exactly one or two screens (--h: 1 or 2)

74. **screen-short** at #contact section.chapter.contact-chapter "La suite s’écrit ensembleEt si o"

694px tall; one screen under the nav is 900px

Checker suggestion: make the section one full screen (--h: 1, layout-v4.md section 2)

75. **neighbour** at #contact section.chapter.contact-chapter "La suite s’écrit ensembleEt si o"

framed, 206px of the footer shows

Checker suggestion: keep the next section's heading and picture out of this screen

76. **edge-left** at #running div.rounded-xl.p-4 "0courses"

starts at x 203; the lines are 20 and the column starts

Checker suggestion: start it on the .wrap left line

77. **neighbour** at section.chapter.journal-chapter section.chapter.journal-chapter "04 / Notes de terrainLe journal "

framed, 47px of #running section.chapter.relative "05 / Hors écranMes coursesJe tra" shows

Checker suggestion: keep the next section's heading and picture out of this screen

## Final screenshots and performance

See the neighboring materials screenshot and performance artifacts for the final rendered evidence. The skill’s layout checker runs on the built page; its layout findings remain listed above. CPU browser timing is a local diagnostic, not field performance.

## Final interaction and performance checks

The mobile-menu close button was tested against the built site: aria-expanded changes from true to false, both the popup and backdrop unmount within 800ms, and the primary action is reachable at its actual screen coordinates. Theme switching selects the daytime small artwork at 390px; the document width is 390px, and keyboard focus computes to a 2px outline. The sheet now uses Base UI starting/ending transition states.

The performance rerun reports 0 FAIL and 9 WARN: 1044.4 KiB total transfer at 1440px and 735.4 KiB at 390px, zero oversized images, zero broken requests, CLS 0.002/0.001, and no WebGL contexts on the phone. Font count/bytes and a busy host remain warnings; synthetic timings are not field measurements. See materials-performance.json.

## Additional light-mode findings

A separate post-gate light-mode scan is saved in materials-light-final/report.json. It reported 16 FAIL and 12 WARN before the final small-text and heading adjustments below. It does not replace or change the three-round gate result.

The main button and body-text contrast now pass. The remaining coloured Strava unit labels were strengthened by removing translucent text and using emerald/violet 700 in light mode and 400 in dark mode. Phone chapter headings were reduced to 2.1rem, below the 39px hero heading. These two small changes postdate the scan.

The scanner opens the modal via its trigger and attempts to close it by clicking the underlying trigger a second time. Base UI uses a dedicated close control, so this leaves the modal open during its subsequent focus walk; three focus-hidden findings therefore describe that deliberately open modal. The actual close-control test above confirms that the panel and backdrop disappear and the primary action is reachable. No scanner code was changed.

1. **nav-covers** at header.site-header: sits on top of the text "Tout a commencé en classe de maths au ly" while the page scrolls: part of the line shows beside it

2. **spill** at div.hero-inner.wrap > div.hero-workshop > div.studio-scene > svg.sketch.sketch-botanical: runs 19px past the bottom edge of the panel it sits on (div.hero-workshop > div.studio-scene > div.studio-art.mo-lq > img)

3. **spill** at section.hero.world-hero > div.hero-inner.wrap > div.hero-workshop > div.hero-fieldnote.liquid-glass: runs 27px past the bottom edge of the panel it sits on (div.hero-workshop > div.studio-scene > div.studio-art.mo-lq > img)

4. **no-visual** at section#timeline: no picture, effect or mock in this section; a feature section needs a visual

5. **no-visual** at section#running: pictures, effects and mocks cover 10% of this section; a feature section needs a visual (about 25% or more)

6. **copy-fact** at h1#hello: the first screen holds no number, price, date, place, platform or genre

7. **copy-headings** at h2#projects-heading: "Des idées qui prennent vie." names no product, part, place or section (18 headings like it; at most one brand line per page) (and 17 more like it: "Blink", "Portfolio Personnel", "Minesweeper LLM Arena", "Next Armored", ...)

8. **heading-scale** at h2#projects-heading: an h2 at 41.6px, as large as the h1 (39px) or larger (and 2 more like it: "Tout commence par « et s", "Mon parcours.")

9. **off-grid** at section.hero.world-hero > div.hero-inner.wrap > div.hero-copy > p.eyebrow: left edge at 40px, 20px off the page margin at 20px (55 elements, like span.tiny-star)

10. **off-grid** at section#projects > div.section-heading > svg.sketch.sketch-orbit: left edge at 8px, 12px off the page margin at 20px (55 elements, like p.eyebrow)

11. **contrast** at div.group.relative > div.mt-auto.grid > div.text-center:nth-of-type(1) > p.text-xs: body text over a effect reads at 3.0:1 at its worst tenth (needs 4.5:1) (and 3 more like it: "m", "min", "bpm")

12. **focus-ring** at .focus\:outline-none:focus: ".focus\:outline-none:focus" in Footer.-WARQ90j.css removes the focus outline and sets nothing in its place

13. **focus-ring** at .focus-visible\:outline-none:focus-visible: ".focus-visible\:outline-none:focus-visible" in Footer.-WARQ90j.css removes the focus outline and sets nothing in its place

14. **focus-hidden** at div.hero-inner.wrap:nth-of-type(1) > div.hero-copy:nth-of-type(1) > div.hero-actions > a.rounded-lg.border:nth-of-type(1): Tab stop 6, "Voir mes projets" is wholly under div > div.fixed.z-50:nth-of-type(3): a keyboard user cannot see where they are

15. **focus-hidden** at div.hero-inner.wrap:nth-of-type(1) > div.hero-copy:nth-of-type(1) > div.hero-actions > a.text-link:nth-of-type(2): Tab stop 7, "Voir mon CV" is wholly under div > div.fixed.z-50:nth-of-type(3): a keyboard user cannot see where they are

16. **focus-hidden** at main#main-content > section.hero.world-hero:nth-of-type(1) > div.hero-bottom:nth-of-type(2) > a: Tab stop 8, "Voir ce que je construis" is wholly under div > div.fixed.z-50:nth-of-type(3): a keyboard user cannot see where they are

## Responsive review

The built page was rendered at 1440×900, 1024×768, 820×1180, 768×1024 and 390×844. Full findings and screenshots are in materials-layout-final.json and materials-layout-final/. The framework-specific exact-screen and grid findings remain open. The phone security glass badge was subsequently hidden because it covered Melo’s face at that width; the foreground code glass card remains.

## Preview capture method

The final light desktop and phone previews show the actual built homepage inside a same-origin full-window iframe. A temporary QA harness selects the persisted light-theme preference before loading the real page; it changes no application markup, CSS or content. This avoids the skill capture script’s default OS-dark preference. The phone capture also uses prefers-reduced-motion. The temporary harness is removed from dist after capture.
