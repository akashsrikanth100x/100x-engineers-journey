# 100xEngineers journey

Static, dependency-free website. Authored source and public assets are in `dist/`; Site identity is in `.openai/hosting.json`.

## Current experience

An original pixel / voxel forest village retaining orange #EB5A2E and charcoal #141416. The opening character powers from grayscale to colour at 100%; the exploration meter then starts at 0x. The opening destination headline is “The road to becoming 100x” and the subtitle is “Everyone starts somewhere.”

Houses 1–4 are shared. A larger central Pathway house asks the visitor to choose an Entrepreneurship or Career Accelerator door. Houses 5–7 appear on each road. The selected road determines the goal context, while Code / Low-code is an independent selection inside each learning house. A boat carries the character across a river and joins both routes into one road before houses 8–10. Native dialogs preserve road position and keyboard focus. The map and pathway control allow revisiting and changing paths.

The reception uses a game character based on the brochure photograph of Sridev Ramesh; the pathway guide is based on Siddhant Goswami. Their comic dialogue is authored game narration, not a verbatim quote. Images are original generated game art, not Minecraft assets. The six-object sprite sheet was extracted into individual transparent WebP assets; the supplied neutral checker matte was decoded when extracting sprites. The generated hall, library and river are standalone raster backgrounds.

The exploration update gives all ten huts their own exterior identity: reception lodge, rocket LaunchPad, stained-glass studio, central pathway hall, workbench lab, knowledge library, telescope observatory, open mentor guild, launch pavilion and alumni library. Nine new hut sprites plus noticeboard, computer, desk and three gear sprites were generated with built-in imagegen after Higgsfield returned a plan requirement; the new sprites retain their supplied alpha transparency.

A persistent timeline separates programme time from exploration progress. Every interior begins with **When / Your focus / You leave with**, followed by three physical objects that open contextual information. The full reference text, original brochure pages and alumni books remain available through **Read everything in this house**. The pathway hall compares both goals side by side before the doors, with Code / Low-code as an independent choice.

Scrolling earns no exploration points. A first hut entry earns 4x and each of its three first discoveries earns 2x, for 10x per logical hut and 100x overall. Reading the complete hut reference also records its three discoveries; choosing a pathway records the comparison and build-method information presented before its doors. Revisits and route changes never duplicate or remove points. The toolkit unlocks at 20x, backpack at 50x and explorer badge at 100x; unlocked gear appears on the character and in the map. This measures exploration of the website, not mastery or programme completion.

## River and soundscape

The river uses detailed generated turquoise water and shoreline art, with two independently scrolling raster-current layers. Both boat routes use one transparent boat-and-seated-engineer sprite, so the visible passenger, bent knees and hull always move together. The generated sprite’s neutral checker matte was decoded for delivery. Gentle boat bobbing and water motion respect the existing motion toggle and reduced-motion preference.

Only jazz inside the huts is enabled. Press **Jazz off** to enable the music using the control on the intro, HUD, map or inside a hut. `audio.js` synthesizes the original quiet 78 BPM loop with electric-piano voicings, bass and brushed percussion. It fades in only after a hut opens, disconnects its audio output immediately on exit, and pauses when the tab is hidden or the full guide is open. All forest, bird, river, footstep and door sound generation and triggers have been removed. No audio downloads, third-party music or microphone access are used.

## Content coverage

All 27 original brochure pages are present at full reading size in contextual in-house folios. Key information is also written into the room content. The alumni library has 21 clickable books, including the five outcomes on page 20, eight build-in-public examples from page 19 and eight community-practitioner profiles from page 21. Directory roles remain attributed to the brochure and are not represented as placement outcomes.

| House | Content | Brochure pages |
| --- | --- | --- |
| 1 · Welcome lodge | Sridev reception, all 10 overview benefits, audience and AI maturity | 1–5 |
| 2 · LaunchPad house | 72-hour challenge, intake, Discord, LMS, schedule, fit, contact and payment | 15, 18, 25, 27 |
| 3 · Creative studio | Generative media, modern stack, module overview and weeks 1–6 | 9–11 |
| 4 · Pathway house | Two doors, Siddhant guide, goal tracks and independent execution paths | 16–17 |
| 5 · Build lab | Full-stack engineering, goal context, Code / Low-code, weeks 7–11 | 12 |
| 6 · Intelligence library | LLMs, RAG, memory, fine-tuning, evaluation and weeks 12–19 | 13 |
| 7 · Agent observatory | Agents, SDKs, workflows, production, capstone and weeks 20–24 | 14 |
| 8 · Mentor guild | Schedule, support, all eight faculty/mentors, faculty products and partnerships | 6–8 |
| 9 · Launch house | Capstones, hackathon, Demo Day, certificate and public project work | 19, 26 |
| 10 · Alumni library | Individual books, company/member directory, alma mater, lifetime access | 20–24, with page 19 also available |

## Source decisions

- **Applied AI Mastery Cohort 9.pdf** supplies the overview, benefits, people, reported stories, company affiliations and the original in-house page images.
- **In-Depth Curriculum C9.pdf** supplies the week sequence: generative media 1–6, full stack and LLMs 7–18, catch-up 19, agents 20–24. Week 24 starts capstone planning and mentor matching; it is not represented as a guaranteed completion date.
- **C8 Product Session.pptx.pdf** supplies the post-payment challenge → LaunchPad → kickoff sequence and weeks 5–6 placement signals, buddy support, check-ins and weekly dual-goal roadmaps.
- **User revision request** explicitly supplies Discord/LMS onboarding, the two-door branch, river crossing and the ten-house structure.
- **https://www.100xengineers.com/**, checked 10 September 2026, confirms the founder roles, supplements Code / Low-code tool examples and lists the next cohort start as **4 December 2026**. Some public-site module week labels differ from the detailed C9 curriculum; the uploaded detailed curriculum controls the displayed weeks. Tool stacks are illustrative mappings to that published execution path, not promises that every tool appears in a specific class.
- The eligibility page suggests 8–10 hours; the schedule suggests 8–12. Planning guidance uses 8–12 and explains both values.
- Continuing access is lifetime community plus recordings and updates from the next two cohorts, not extra live-cohort seats. Individual post-cohort support duration and final sprint dates are referred to the team.

## Files and verification

`index.html`, `style.css`, `village.css` and `exploration.css` define the world and responsive presentation. `app.js` manages scrolling, transitions, navigation and audio scene changes. `audio.js` owns sound synthesis, scheduling, fades and mute state. `journey-engine.js` contains route geometry, gating, visit state, earned exploration and gear thresholds. `exploration.js` maps programme timing, hut sprites, object prompts and the pathway comparison. `content.js` contains the ten-house content and sourced profiles; `rooms.js` renders contextual interiors. `curriculum.js` contains 24 weeks of detail. `guide.html`, `guide.css` and `guide.js` preserve the conventional reading experience.

`node --test tests/*.test.cjs` checks pathway gating, both complete journeys, separate branch visits, independent execution choice, continuity across fork/boat/merge transitions at mobile and desktop widths, room state guards, all 27 brochure pages and all 24 weeks. Exploration tests cover zero points from scrolling, unique discovery rewards, 100x completion on either route, gear thresholds, route-switch deduplication and all timeline/object asset mappings. The sound checks cover complete audio-output disconnection outside huts, the jazz-only audio graph, music scheduling and re-entry, tab suspension, mute and recoverable autoplay rejection. Browser UI testing was not performed in this editing task.

No payment processing, enrolment form or personal-progress persistence is implemented. Contact actions open the visitor’s email or phone application.
