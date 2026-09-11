'use strict';
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const steps = [
 {time:'AFTER SUCCESSFUL PAYMENT',title:'Make room for what’s next.',description:'Your enrolment is the starting point. The 72-hour Build Challenge comes next, followed by your LaunchPad intake.',action:'Keep your payment confirmation and follow the challenge instructions shared by the team. Confirm the upcoming cohort start date with admissions.'},
 {time:'YOUR FIRST 72-HOUR CHALLENGE',title:'Start by making something.',description:'A short, hands-on build shows how you approach real work. It gives the team a better signal than a form alone and introduces the build-first rhythm of the cohort.',action:'Read your assigned brief, set aside time to work on it, and submit through the instructions you receive. Bring your questions and blockers into the process.'},
 {time:'AFTER THE BUILD CHALLENGE',title:'Tell us where you want to go.',description:'LaunchPad captures your goals, current skills and available time. Combined with your build, it helps the team understand which direction will fit you.',action:'Be specific about what you want to build or change in your career. Be honest about your starting point and the time you can commit.'},
 {time:'AT YOUR COHORT’S START',title:'Meet the people. Find your rhythm.',description:'Your cohort begins with live learning, a peer group and support around your work. Buddy pairing, office hours and weekly roadmaps help you keep moving.',action:'Protect your learning and building time. Use your buddy and check-ins early. Your Build Challenge and LaunchPad feed into placement in weeks 5–6.'}
];
const weeks = [
 ['Foundations of generative AI','Understand how generative AI evolved and experiment with diffusion models, samplers and prompts.',['Diffusion','Tensor Art','Prompt experimentation'],'Your first controlled experiments with image generation.'],
 ['ComfyUI & ControlNets','Build node-based image workflows and learn to control composition, structure and pose.',['ComfyUI','ControlNet','Node graphs'],'An image workflow you can direct, rather than generate by chance.'],
 ['LoRA & Magnific foundations','Prepare a dataset and train a LoRA for a consistent character, product or style. Set up a reusable Magnific Space.',['LoRA','Dataset preparation','Magnific'],'A reusable starting point for more consistent visual output.'],
 ['Image & video production','Explore upscaling, relighting, style transfer and video generation while maintaining consistency across shots.',['Magnific','Image-to-video','Relighting'],'A repeatable workflow that takes a visual idea into motion.'],
 ['AI content & automation','Combine avatars, UGC ads, audio and 3D environments into a content production pipeline.',['ElevenLabs','HeyGen','Suno','n8n'],'A connected content workflow, including automated social production.'],
 ['Your first capstone','Bring the generative-media stack together in a dedicated project week before moving into full-stack engineering.',['Diffusion','ComfyUI','LoRA','Automation'],'One shipped project that brings your first six weeks together.'],
 ['An idea becomes an app','Begin the full-stack journey with an idea-to-app workshop and orient your learning around your career or venture goals.',['App concepts','AI landscape','Goal setting'],'A clear app concept and a direction for the next stage.'],
 ['Your first interface','Learn interface first principles. Build a working UI through the code or low-code execution path.',['UI design','Interface principles','Code + low-code'],'The first usable interface for what you’re building.'],
 ['The API layer','Understand how requests and responses work, connect interfaces to models, and turn API specifications into working endpoints.',['FastAPI','GroqCloud','n8n','APIs'],'A connected interface that can send a request and return an AI result.'],
 ['Databases & domain modelling','Model entities and relationships, build a database, and introduce authentication and Row Level Security.',['Supabase','SQL','Authentication','RLS'],'Persistent data and access rules behind your application.'],
 ['AI-native workflows & MVP','Connect what you’ve learned into a live product. Use AI-assisted development and reusable workflows to support your build.',['Claude Code','Cursor','MCP','Deployment'],'A deployed MVP with authentication and the foundations you have built.'],
 ['GenAI architecture & LLMs','Understand language models from first principles and connect models, workflows, APIs and persistent data into an application.',['LLM fundamentals','System architecture','Persistent data'],'A clearer architecture for your GenAI application.'],
 ['Tool calling & MCP','Learn how models select tools, extract inputs and generate structured outputs. Implement your first tool call.',['Tool calling','Structured outputs','MCP'],'An AI system that can use a tool to take a defined action.'],
 ['MCP practice & RAG foundations','Connect models to external tools and learn how retrieval and generation work together to ground an answer.',['MCP','RAG','Retrieval'],'The bridge between a language model and relevant tools or knowledge.'],
 ['Build & improve RAG','Build a retrieval-augmented generation pipeline and explore smarter retrieval for real project needs.',['RAG pipelines','Advanced retrieval','Context'],'A working pipeline that answers with relevant retrieved information.'],
 ['Memory & module synthesis','Explore memory and context retention, then connect the module’s concepts into a coherent system.',['LLM memory','Context retention','System synthesis'],'A joined-up understanding of how your AI application behaves.'],
 ['Fine-tuning & data preparation','Learn how models adapt to specific tasks and prepare high-quality datasets for that work.',['Fine-tuning','Task adaptation','Datasets'],'An understanding of when to fine-tune and how to prepare the data.'],
 ['Evaluate what you’ve built','Learn to assess model performance for your use case and consolidate the full-stack and LLM module.',['LLM evaluation','Model assessment','Doubt-solving'],'A way to judge whether your system is working well for its intended task.'],
 ['Catch your breath','A dedicated catch-up and breather week before the agent module. Revisit earlier work and clear outstanding blockers.',['Catch-up','Consolidation','Breather'],'Time to strengthen your foundations before the next stage.'],
 ['Agent foundations','Distinguish an LLM from an agent and a deterministic workflow. Explore agent levels and build a first basic agent.',['Agent levels','Workflows','Agent foundations'],'Your first basic agent and a clearer sense of when to use one.'],
 ['Multi-agent systems','Develop ReAct agents and learn how multiple agents can coordinate, collaborate and reason.',['ReAct','MCP','Multi-agent coordination'],'A foundation for systems where agents work together.'],
 ['Agent SDKs & guardrails','Work with major agent SDKs, agent-to-agent communication and guardrails for monitoring behaviour.',['OpenAI / Claude SDKs','Google ADK','A2A','Guardrails'],'An agent implementation with controls around how it operates.'],
 ['Production workflows','Build and deploy end-to-end agentic systems, with attention to production patterns and cost optimisation.',['Agentic workflows','Deployment','Cost optimisation'],'A more production-minded approach to agent systems.'],
 ['Begin your final capstone','Bring full-stack, LLM and agent concepts together. Kick off the final sprint with project planning and mentor matching.',['Capstone planning','Mentor matching','Final sprint'],'A scoped capstone and a plan for the next build. Confirm sprint deadlines with your team.']
];
const modules = [
 {label:'MODULE 01 / GENERATIVE MEDIA',start:1,end:6},
 {label:'MODULE 02 / FULL-STACK AI & LLMS',start:7,end:18},
 {label:'CATCH-UP & BREATHER WEEK',start:19,end:19},
 {label:'MODULE 03 / AI AGENTS',start:20,end:24}
];
let stepIndex=0;
function selectStep(i){
 stepIndex=i;const s=steps[i];
 $$('.step').forEach((el,j)=>{el.classList.toggle('active',j===i);el.setAttribute('aria-selected',String(j===i));el.tabIndex=j===i?0:-1});
 $('#step-panel').setAttribute('aria-labelledby',`step-tab-${i}`);
 $('#step-time').textContent=s.time;$('#step-big').textContent=String(i+1).padStart(2,'0');$('#step-title').textContent=s.title;$('#step-description').textContent=s.description;$('#step-action').textContent=s.action;
 $('#next-step').textContent=i<3?`Next: ${['','72-hour build','LaunchPad','cohort kickoff'][i+1]} →`:'Explore your 24 weeks →';
}
$$('.step').forEach(el=>el.addEventListener('click',()=>selectStep(Number(el.dataset.step))));
$('#next-step').addEventListener('click',()=>{if(stepIndex<3)selectStep(stepIndex+1);else location.hash='build'});
let week=1;
function selectWeek(value){
 week=Math.max(1,Math.min(24,Number(value)));const d=weeks[week-1],m=modules.findIndex(o=>week>=o.start&&week<=o.end);
 $('#week-number').textContent=String(week).padStart(2,'0');$('#module-kicker').textContent=modules[m].label;$('#week-title').textContent=d[0];$('#week-description').textContent=d[1];$('#week-tools').replaceChildren(...d[2].map(t=>{const span=document.createElement('span');span.textContent=t;return span}));$('#week-output').textContent=d[3];$('#week-slider').value=week;$('#week-slider').style.setProperty('--slider-progress',`${(week-1)/23*100}%`);$('#week-output-label').textContent=`Week ${week} of 24`;$('#prev-week').disabled=week===1;$('#next-week').disabled=week===24;
 $$('.module-tabs button').forEach((el,j)=>{el.classList.toggle('active',m===j);el.setAttribute('aria-selected',String(m===j));el.tabIndex=m===j?0:-1});
 $('#module-panel').setAttribute('aria-labelledby',`module-tab-${m}`);
}
$('#week-slider').addEventListener('input',e=>selectWeek(e.target.value));$('#prev-week').addEventListener('click',()=>selectWeek(week-1));$('#next-week').addEventListener('click',()=>selectWeek(week+1));
$$('.module-tabs button').forEach(el=>el.addEventListener('click',()=>selectWeek(modules[Number(el.dataset.module)].start)));
weeks.forEach((d,i)=>{const b=document.createElement('button'),n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0');b.append(n,document.createTextNode(d[0]));b.addEventListener('click',()=>{selectWeek(i+1);$('.curriculum').scrollIntoView({behavior:motionPaused?'instant':'smooth',block:'start'});$('#week-slider').focus({preventScroll:true})});$('#week-directory').append(b)});
const tracks={
 career:{kicker:'CAREER ACCELERATOR',title:'Become the person\nwho can build it.',description:'Develop technical depth and a portfolio that makes your ability visible. Bring AI into your current role or prepare for a new one.',benefits:['Production-grade AI projects for your portfolio','Interview preparation and résumé support','Access to founding-role opportunities and the alumni network']},
 founder:{kicker:'ENTREPRENEURSHIP',title:'Take your idea\ninto the world.',description:'Identify a real market gap, prototype your solution and work towards a launch. Bring your domain expertise and a problem worth solving.',benefits:['Incubation support and a path towards Demo Day','Go-to-market campaigns and product validation','Connections to GenAI talent and fellow builders']}
};
function selectTrack(key){const t=tracks[key];$('#track-kicker').textContent=t.kicker;$('#track-title').textContent=t.title;$('#track-description').textContent=t.description;$('#track-benefits').replaceChildren(...t.benefits.map((v,i)=>{const row=document.createElement('div'),n=document.createElement('span'),p=document.createElement('p');n.textContent=String(i+1).padStart(2,'0');p.textContent=v;row.append(n,p);return row}));$$('.track-tabs button').forEach(el=>{const active=el.dataset.track===key;el.classList.toggle('active',active);el.setAttribute('aria-selected',String(active));el.tabIndex=active?0:-1});$('#track-panel').setAttribute('aria-labelledby',`track-tab-${key}`)}
$$('.track-tabs button').forEach(el=>el.addEventListener('click',()=>selectTrack(el.dataset.track)));
$$('[role=tablist]').forEach(list=>{list.addEventListener('keydown',e=>{const vertical=list.getAttribute('aria-orientation')==='vertical';const forward=vertical?'ArrowDown':'ArrowRight',back=vertical?'ArrowUp':'ArrowLeft';if(![forward,back,'Home','End'].includes(e.key))return;const tabs=[...list.querySelectorAll('[role=tab]')],current=tabs.indexOf(document.activeElement);if(current<0)return;e.preventDefault();let next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(current+(e.key===forward?1:-1)+tabs.length)%tabs.length;tabs[next].focus();tabs[next].click()})});
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');let motionPaused=motionPreference.matches;
const pauseButton=$('.motion-toggle');
function setMotion(paused){motionPaused=paused;document.documentElement.classList.toggle('motion-paused',paused);pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.setAttribute('aria-label',paused?'Enable decorative motion':'Pause decorative motion');pauseButton.title=paused?'Enable motion':'Pause motion';pauseButton.firstElementChild.textContent=paused?'▷':'Ⅱ';if(paused){$('.hero-art').style.removeProperty('--art-x');$('.hero-art').style.removeProperty('--art-y')}}
pauseButton.addEventListener('click',()=>setMotion(!motionPaused));motionPreference.addEventListener('change',e=>setMotion(e.matches));setMotion(motionPaused);
if('IntersectionObserver' in window){document.documentElement.classList.add('js-motion');const reveals=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveals.unobserve(e.target)}})},{threshold:.08});$$('.reveal').forEach(el=>reveals.observe(el));}
const chapters=$$('.chapter'),navLinks=$$('.chapter-nav a');let ticking=false;
function onScroll(){const point=window.scrollY+Math.min(window.innerHeight*.35,280);let index=0;chapters.forEach((el,i)=>{if(el.offsetTop<=point)index=i});navLinks.forEach((el,i)=>{el.classList.toggle('active',i===index);if(i===index)el.setAttribute('aria-current','location');else el.removeAttribute('aria-current')});const progress=Math.min(100,Math.max(0,window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100));$('.chapter-nav').style.setProperty('--read-progress',`${progress}%`);ticking=false;}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScroll);ticking=true}},{passive:true});window.addEventListener('resize',onScroll);onScroll();
let artFrame=false,mouseX=0,mouseY=0;$('.hero').addEventListener('pointermove',e=>{if(motionPaused||e.pointerType==='touch'||window.innerWidth<900)return;const r=e.currentTarget.getBoundingClientRect();mouseX=(e.clientX/r.width-.5)*12;mouseY=((e.clientY-r.top)/r.height-.5)*8;if(!artFrame){artFrame=true;requestAnimationFrame(()=>{$('.hero-art').style.setProperty('--art-x',`${mouseX}px`);$('.hero-art').style.setProperty('--art-y',`${mouseY}px`);artFrame=false})}});
