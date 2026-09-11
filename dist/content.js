(function (root) {
'use strict';
const OVERVIEW = [
 ['6 months','Live cohort'], ['150+ hours','Hands-on learning'], ['2 goal tracks','Career or entrepreneurship'],
 ['Code / Low-code','Two execution paths'], ['3 cohorts','Your live + next 2 recorded'], ['200 hours','Cloud GPU access'],
 ['Lifetime','Community access'], ['Build & showcase','Capstones, hackathon, Demo Day'], ['Certificate','Professional recognition'], ['Bi-weekly','Updates on new models']
];
const TRACKS = {
 entrepreneurship:{label:'Entrepreneurship',short:'Venture road',audience:'For founders & business owners',intro:'Find a market gap, prototype an MVP and work towards launching a venture.',benefits:['100x Incubation Program','Demo Day','Validate with 1,000+ power users','Go-to-market campaigns','Access to GenAI talent'],colour:'#edaa51'},
 career:{label:'Career Accelerator',short:'Career road',audience:'For job seekers & professionals',intro:'Develop technical depth, build a portfolio and prepare for high-impact AI roles.',benefits:['5+ production-grade AI projects','Interview preparation','Résumé optimisation','Access to founding roles','Alumni network'],colour:'#8cbdcc'}
};
const HOUSES = [
 {name:'Welcome lodge',stage:'01 / AFTER YOU JOIN',title:'Welcome to your next chapter.',intro:'Meet Sridev Ramesh, Co-founder & CEO. The reception desk has your complete cohort overview.',kind:'welcome',pages:[1,2,3,4,5],features:[
 ['The programme in one sentence','Take an idea to an AI product over 24 weeks, with real work to show for what you learn. GPUs, mentors and a network support your building.'],
 ['For product, tech and business people','The cohort brings together engineers, product managers, designers, marketers, business leaders, founders and people starting their AI journey.'],
 ['From curiosity to capability','Move from exploring individual AI tools to using AI in workflows, then designing systems around it. The aim is to become AI-native in how you work.']
 ],note:'Your road begins at 0x. The destination is 100x.'},
 {name:'LaunchPad house',stage:'02 / BEFORE KICKOFF',title:'Get ready. Meet your people.',intro:'Your first steps after payment connect your goals, your learning space and the work you’ll start building.',kind:'launchpad',pages:[15,18,25,27],features:[
 ['01 · The 72-hour Build Challenge','Complete the assigned build brief and submit it using the instructions shared by the cohort team. Your approach gives the team a practical starting signal.'],
 ['02 · Your LaunchPad form','Share your background, skills, domain expertise, goals and available time. Your intake and Build Challenge activity together help inform pathway placement in weeks 5–6.'],
 ['03 · Join the Discord community','Use your member invite to meet peers, find your cohort channels and join the conversation. Introduce yourself and share what you want to build.'],
 ['04 · Open your learning management system','Follow the access instructions from the team to reach your learning dashboard and cohort materials. Check your sign-in before kickoff and contact the team if access is missing.'],
 ['Your starting milestones','Self-discovery assessment → personalised AI roadmap → meet your cohort. Bring your questions, choose a realistic pace and get to know your buddy.'],
 ['Make room for the work','Plan for 24 weeks and 8–12 hours each week. The programme is for people ready to make and ship projects; consistent participation matters.'],
 ['Kickoff on your calendar','The official website currently lists Cohort 9 as starting 4 December 2026. Confirm the joining instructions, exact class timings and any changes with admissions.'],
 ['Payment and support','The brochure lists Razorpay and Stripe, with flexible payment options including no-cost EMI and Bajaj Finserv loans. Confirm availability and terms directly with the team.']
 ],links:true,note:'Friday & Saturday classes · Two weekly office-hour sessions · Specialist labs'},
 {name:'Creative studio',stage:'03 / WEEKS 01–06',title:'Turn imagination into a workflow.',intro:'Your shared foundation: generative media, diffusion models and the creator economy. Both career and venture journeys begin here.',kind:'standard',weeks:[1,6],pages:[9,10,11],features:[
 ['Images you can direct','Explore generative AI, Tensor Art, diffusion models, prompts and sampling. Build ComfyUI workflows and use ControlNets for composition and pose.'],
 ['Consistency and production quality','Train and implement LoRAs. Use Magnific for images, video and reusable Spaces, including marketing images, upscaling, relighting and style transfer.'],
 ['Audio, avatars and motion','Create avatar-led UGC, video, audio and 3D environments. Explore tools such as ElevenLabs, HeyGen and Suno alongside closed-source models.'],
 ['Automate a content pipeline','Connect your creative work with n8n and repeatable production steps. Develop a system you can reuse.'],
 ['Week 6: your first capstone','Bring the module together in a dedicated project week. Your 200 hours of cloud GPU access supports practical experimentation; the team shares provisioning and usage details.'],
 ['Three modules, one connected skillset','Generative Media → Full-stack Engineering and LLMs → AI Agents. The next houses build on these first six weeks.']
 ],note:'Module 1 · Generative media & diffusion'},
 {name:'Pathway house',stage:'04 / CHOOSE YOUR DIRECTION',title:'Two doors. Your direction.',intro:'Siddhant Goswami, Co-founder & CTO, is here to help you choose what you’re building towards.',kind:'pathway',pages:[16,17],features:[
 ['Your goal track','Entrepreneurship supports building and launching a venture. Career Accelerator supports technical mastery, a portfolio and career preparation.'],
 ['Your execution path is a separate choice','You can take either road using Code or Low-code. Compare both approaches inside the Build lab, Intelligence library and Agent observatory.'],
 ['You can explore the other road','This choice personalises the village. Return here to switch roads and compare the other perspective; your actual cohort placement is guided by the team.']
 ],note:'Choose a door to continue beyond the crossroads.'},
 {name:'Build lab',stage:'05 / WEEKS 07–11',title:'Give your idea a working form.',intro:'Move from an interface to APIs, persistent data and a live MVP.',kind:'learning',weeks:[7,11],pages:[12],features:[
 ['From idea to interface','An idea-to-app workshop and AI orientation lead into interface first principles, UI design and a usable application.'],
 ['Connections and data','Learn requests and responses, API fundamentals, CRUD, domain modelling, database schemas, SQL, authentication and Row Level Security.'],
 ['Ship your MVP','Combine your interface, API and database. Use AI-assisted development, MCP tools and reusable workflows to deploy your first connected product.']
 ],goals:{entrepreneurship:'Use this stage to turn a market problem into a testable MVP. Focus on the smallest useful product you can put in front of a potential customer.',career:'Use this stage to build a portfolio project you can explain: the user problem, the architecture, your implementation decisions and the result.'},compare:[
 ['Interfaces','Build with Python, Streamlit, Gradio or JavaScript.','Design with Figma, Framer or Retool; prototype with visual app tools.'],
 ['APIs and workflows','Create typed endpoints with FastAPI and Pydantic.','Connect services and orchestrate API requests with n8n.'],
 ['Data','Model data with Supabase and SQL; implement authentication and RLS.','Work with Supabase, Airtable or Google Sheets; understand the same data and access principles.'],
 ['Build and ship','Use Cursor and Claude Code; deploy a working application.','Use AI-assisted visual builders such as Lovable or Bolt; connect and publish a working MVP.']
 ],note:'Module 2A · Full-stack engineering · Same principles, different tools'},
 {name:'Intelligence library',stage:'06 / WEEKS 12–19',title:'Give your product knowledge.',intro:'Connect language models to tools, retrieval and memory, then learn to evaluate what you’ve made.',kind:'learning',weeks:[12,19],pages:[13],features:[
 ['LLM foundations and architecture','Learn language models from first principles, persistent application architecture, structured outputs, function calling and Model Context Protocol.'],
 ['Retrieval and memory','Build and improve RAG pipelines, explore advanced retrieval, then add context retention and memory.'],
 ['Adapt and evaluate','Understand fine-tuning, PEFT, data preprocessing and model evaluation. Decide how to judge the system against the task it must perform.'],
 ['Week 19: consolidate','Use the planned catch-up week to revisit earlier work and clear blockers before the agent module.']
 ],goals:{entrepreneurship:'Explore how a product can use a business’s own knowledge and workflows. Evaluate whether it gives a useful, reliable result for the intended customer.',career:'Demonstrate that you can ground a model’s answers, connect tools and evaluate quality. Make those decisions visible in your project walkthrough.'},compare:[
 ['Models and inference','Use model APIs, Hugging Face, Ollama or Groq Cloud.','Work through LM Studio, Groq Cloud and connected model interfaces.'],
 ['Retrieval','Build RAG and memory systems with LlamaIndex, vector data and retrieval code.','Connect visual RAG/file-search tools, NotebookLM and workflow-based retrieval.'],
 ['Data and context','Control preprocessing, embeddings, retrieval logic and memory in code.','Connect knowledge sources and configure retrieval and context in visual tools.'],
 ['Fine-tuning and evaluation','Explore PEFT and Unsloth notebooks; prepare data and evaluate task performance.','Use guided fine-tuning interfaces or notebooks; understand data quality and evaluate outputs.']
 ],note:'Module 2 · Full-stack GenAI & LLMs · Week 19 is a breather'},
 {name:'Agent observatory',stage:'07 / WEEKS 20–24',title:'From answering to acting.',intro:'Build agents, coordinate tools and bring the programme’s concepts into a final project.',kind:'learning',weeks:[20,24],pages:[14],features:[
 ['Understand the moving parts','Distinguish a language model, a deterministic workflow and an autonomous agent. Build a first basic agent.'],
 ['Coordinate agents and tools','Explore ReAct, multi-agent systems, MCP, agent-to-agent communication and the major agent SDKs.'],
 ['Prepare for production','Use guardrails, monitoring and evaluation. Explore deployment patterns, end-to-end workflows and cost optimisation.'],
 ['Week 24: begin the final capstone','Start the capstone sprint with planning and mentor matching. The detailed curriculum introduces the sprint here; confirm the submission and review dates with the team.']
 ],goals:{entrepreneurship:'Prototype an agent that performs a useful business workflow. Consider customer value, cost, failure modes and the next validation step.',career:'Build an agent system that demonstrates tool use, coordination and production thinking. Be ready to explain its controls, evaluation and trade-offs.'},compare:[
 ['Build an agent','Implement agents using OpenAI / Claude SDKs or Google ADK.','Assemble agents using n8n AI Agents, Langflow or visual agent builders.'],
 ['Coordinate work','Write orchestration and tool integrations for multi-agent workflows.','Connect tools, triggers and workflow steps using visual orchestration.'],
 ['Deploy and operate','Go deeper into deployment, scaling, monitoring and cost optimisation.','Configure hosted workflows, credentials, checks and monitoring for your solution.'],
 ['Common foundations','Agent architecture, tool use, guardrails and evaluation.','The same architecture, tool-use, guardrail and evaluation principles.']
 ],note:'Next: cross the river and reconnect with the wider cohort.'},
 {name:'Mentor guild',stage:'08 / SUPPORT AROUND YOUR WORK',title:'Different paths. Shared support.',intro:'Back on one road, meet the instructors, mentors and peers who support your building.',kind:'mentors',pages:[6,7,8],features:[
 ['A rhythm you can plan around','Friday and Saturday live classes run 90–120 minutes. Two office-hour sessions run during Monday–Thursday, alongside specialist labs on emerging tech.'],
 ['Mentoring and feedback','Bring real blockers and work in progress. Use mentor feedback, buddy accountability and check-ins to keep moving.'],
 ['A roadmap that fits your capacity','Weekly roadmaps offer two goal levels. Choose a realistic pace while staying accountable to your progress.'],
 ['Learn from builders','The faculty’s projects include AlphaCTR for thumbnails and ad creatives, AutoCodePro for idea-to-code development, and God in a Box for ChatGPT on WhatsApp. The brochure reports a combined 1M+ users and $100,000+ revenue.'],
 ['Industry and institutional programmes','The brochure describes official Meta and OpenAI Academy partnerships, plus training for the IRS on workflow automation, local LLMs and government efficiency.'],
 ['A community that contributes','Share feedback and help improve the cohort. A referral programme is part of the community offering; the team can explain its current terms.']
 ],note:'Support runs throughout the cohort, including while you explore either pathway.'},
 {name:'Launch house',stage:'09 / PROJECTS & YOUR NEXT STEP',title:'Give your work an audience.',intro:'Bring your projects into the world. Show what works, learn from feedback and decide what to build next.',kind:'launch',pages:[19,26],features:[
 ['Capstones, a hackathon and Demo Day','Connect the programme’s skills through substantial projects. The brochure includes 150+ hours of hands-on learning and opportunities to showcase your work.'],
 ['Your proof of work','Document the problem, how your system works and what you learned. Build in public with the community using #0to100xEngineer.'],
 ['Career or venture, keep moving','Career Accelerator includes 5+ production-grade projects and career preparation. Entrepreneurship includes incubation, validation, go-to-market support and Demo Day.'],
 ['Professional certificate','A professional certificate is part of the programme. Confirm completion requirements with the cohort team.'],
 ['Continue the final sprint','Week 24 begins capstone planning and mentor matching. Use the confirmed sprint milestones and feedback schedule to take the project forward.'],
 ['Put the next six months to work','Aim to become the person who can propose and build an AI solution in your team or business. The next chapter starts with the work you have created.']
 ],note:'Your projects create opportunities. Jobs, funding and client wins are not guaranteed.'},
 {name:'Alumni library',stage:'10 / BEYOND SIX MONTHS',title:'Every builder has a story.',intro:'Pick a book to explore a person’s work. Then meet the wider community around the cohort.',kind:'alumni',pages:[20,21,22,23,24],features:[
 ['A lifelong community','Stay connected with peers and alumni. Keep sharing ideas, projects, opportunities and what you learn after the live cohort.'],
 ['Your live cohort, plus the next two recorded','Revisit your learning through recordings and updates from the next two cohorts. This access does not include additional live-cohort seats.'],
 ['Bi-weekly updates on new models','Continue learning as the AI landscape changes, and revisit your work with new tools and techniques.'],
 ['Your next move','Apply AI in your organisation, prepare for a new role, grow your portfolio or develop a venture. Ask the team about the duration of individual career, incubation or mentoring support after the live programme.']
 ],links:true,note:'Stories and affiliations below are reported in the Cohort 9 brochure.'}
];
const MATURITY = [
 ['Relationship with AI','Explores AI','Uses AI regularly','Designs work around AI'],
 ['Primary goal','Understand what’s possible','Improve personal productivity','Transform how work gets done'],
 ['Unit of work','Tasks','Workflows','Systems'],
 ['How AI is used','A tool','A collaborator','Infrastructure'],
 ['Automation','Experiments','Automates tasks','Automates workflows / functions'],
 ['Building','Uses existing tools','Builds basic agents & workflows','Builds custom AI systems'],
 ['Mindset','What can AI do?','How can AI help me?','What should work look like now?'],
 ['End result','AI user','AI power user','AI-native architect']
];
const MENTORS = [
 ['Sridev Ramesh','CEO & Co-founder','GenAI educator; formerly a CS50x Teaching Fellow with Harvard.'],
 ['Pranay','Co-founder, Nexi Labs','Builds AI commercials, music videos and workflow automation; the brochure reports $2,500–$30,000 per project.'],
 ['Siddhant Goswami','CTO & Director of R&D','Built and scaled three products to $10M+ with two successful exits to Unacademy.'],
 ['Abhishek Duragkar','Instructor & mentor','10+ years across edtech and product; mentors LLM-powered no-code automations and AI workflows.'],
 ['Tejas Tholpadi','CTO, Aeos Labs','Former Co-founder and CTO of Scenes by Avalon; scaled to 70,000+ users and 2,000+ live communities before its acquisition by Unacademy.'],
 ['Anji Raju','GenAI Engineer, Aeos Labs','Supports capstone execution, project reviews and interview readiness for GenAI roles.'],
 ['Ashhar Akhlaque','Career & entrepreneurship mentor','Former Amazon SDE for seven years; Lead Engineer at Fix Health. Guided 50+ alumni mentees towards AI products while leading its technology.'],
 ['Rahul Gundala','Co-founder, Nexi Labs','Forbes 30 Under 30 technopreneur; published 11 papers and built a patented tool acquired by Soldron.']
];
const BOOKS = [
 {name:'Pradyumn Khanchandani',shelf:'Outcomes',title:'A workflow engineering role',tag:'HIRED · ShopOS',body:'Landed a role as a Workflow Engineer at ShopOS.',page:20},
 {name:'Malladi Sanjay',shelf:'Outcomes',title:'Production video workflows',tag:'HIRED · ShopOS',body:'Recruited as a ComfyUI Developer at ShopOS to build production video workflows.',page:20},
 {name:'Aliakbar Chimthanawala',shelf:'Outcomes',title:'Automation for sales teams',tag:'CLIENT WORK · n8n',body:'Started working with multiple clients to build n8n automation workflows for sales teams.',page:20},
 {name:'Abhay Babbar',shelf:'Outcomes',title:'A voice AI agency',tag:'AGENCY · QuensultingAI',body:'Launched QuensultingAI, described as a RetellAI Gold Partner, providing voicebot solutions to US clients.',page:20},
 {name:'Vatsal Bhatt',shelf:'Outcomes',title:'A product used by 250+ people',tag:'TRACTION · Student productivity',body:'Built a student productivity tool adopted by 250+ users, addressing a real-world retention problem.',page:20},
 {name:'Umang Thakkar',shelf:'Projects',title:'AI Portfolio Assistant',tag:'BUILD IN PUBLIC',body:'Shared an AI Portfolio Assistant with the community, showing a working product interface and an assistant for portfolio-related questions.',page:19},
 {name:'Jagrat Kesharwani',shelf:'Projects',title:'Dual Character Portrait',tag:'MID-CAPSTONE',body:'Shared a mid-capstone project exploring a dual-character portrait and consistent generative-media output.',page:19},
 {name:'Manish Saini & Mayank Singh',shelf:'Projects',title:'CreatorPulse',tag:'APPLICATION DESIGN',body:'Used generative AI while working on CreatorPulse, including system architecture and application flow diagrams.',page:19},
 {name:'Chaitanya Vashisth',shelf:'Projects',title:'Enterprise AI Cost Optimizer',tag:'72-HOUR BUILDATHON',body:'Shared an Enterprise AI Cost Optimizer from a 72-hour AI buildathon, designed to help enterprises reduce LLM/API costs while maintaining performance.',page:19},
 {name:'Viraj Zaveri',shelf:'Projects',title:'A working Reddit scraper',tag:'FIRST BUILDS',body:'Shared a Reddit scraper made with AI-assisted coding, Gradio and FastAPI, describing the step from no Python experience to a working tool.',page:19},
 {name:'Tapan Vaghela',shelf:'Projects',title:'An AI-wizard visual',tag:'GENERATIVE MEDIA',body:'Shared a personalised cinematic AI-wizard visual as part of the community’s build-in-public activity.',page:19},
 {name:'V. Chaitanya Chowdari',shelf:'Projects',title:'Learning together',tag:'COHORT COLLABORATION',body:'Shared a positive experience from joining a peer working session. The brochure shows collaborative calls as part of the build-in-public community.',page:19},
 {name:'Vikram Donkeshwara',shelf:'Projects',title:'A weekly building ritual',tag:'COHORT COLLABORATION',body:'Shared a recurring group session for connecting, sharing and learning while cohort members worked through their projects.',page:19},
 {name:'Saumitra Bhanage',shelf:'Community',title:'Enterprise AI agents',tag:'TECH LEAD · Meta',body:'The brochure describes a Tech Lead in Meta’s AI Agents team building enterprise-ready platforms with LLMs, RAG and full-stack systems.',page:21},
 {name:'Rahul Gundala',shelf:'Community',title:'AI across industries',tag:'TECHNOPRENEUR',body:'A Forbes 30 Under 30 technopreneur and AI practitioner building tools across artificial intelligence, sustainability and digital innovation.',page:21},
 {name:'Dr. Ratul Maji',shelf:'Community',title:'AI for healthcare',tag:'DERMATOLOGIST · GenAI practitioner',body:'Explores AI-driven solutions to improve healthcare delivery. The brochure features his work alongside the wider practitioner community.',page:21},
 {name:'Akash Dey',shelf:'Community',title:'Tailored GenAI solutions',tag:'CO-FOUNDER · What an AIdea',body:'Creates tailored generative-AI solutions, from LLM applications to voice-driven workflows.',page:21},
 {name:'Anji Raju',shelf:'Community',title:'Creative voice and video',tag:'AI ENGINEER · Aeos Labs',body:'Experiments with generative AI for dubbing, video and voice-based creative workflows.',page:21},
 {name:'Pranay',shelf:'Community',title:'Visual generation & agents',tag:'CO-FOUNDER · Nexi Labs',body:'Develops solutions across visual generation and intelligent agents to support business efficiency and user engagement.',page:21},
 {name:'Aniket Patel',shelf:'Community',title:'AI sales engineers',tag:'CO-FOUNDER & CEO · Tenali AI',body:'Builds AI-powered sales engineers that deliver real-time answers in meetings to accelerate sales cycles.',page:21},
 {name:'Akhilesh Gupta A',shelf:'Community',title:'Applied GenAI prototypes',tag:'GENAI PRACTITIONER',body:'Explores applied generative AI by building prototypes and tools for real-world workflows. The brochure features Invest4Edu with his profile.',page:21}
];
const PEOPLE = [
 ['ShopOS','Pradyumn Khanchandani','Workflow Engineer'],['ShopOS','Malladi Sanjay','ComfyUI Developer'],
 ['AirAsia','Ravi Shankar','CMO'],['Disney+','Gautham Krishnan','VP, Product'],['Morgan Stanley','Maddula Ravi Prakash','Former VP'],
 ['Scaler','Bhavik Rasyara','Former VP'],['Cognizant','Gautam Pai','Director, Enterprise Salesforce'],['Shipscope','Akash Pise','Founder'],
 ['RMINT','Balaji Kannaiyan','Founder'],['Money Wellth','Ramesh Nittali','CTO'],['Ford, USA','Manoj Kolluri','AI Agents Team Lead'],
 ['DCCPL','Aman Bhardwaj','Managing Director'],['HSBC','Rohan Lakhani','Security Lead'],['AIG','Anmol Saraf','VP, Digital Frameworks']
];
const COMPANIES = ['Zipy','HSBC','Holistic AI','Airbnb','Ford','Oracle','SAP','Amazon','Adobe','Google','Meta','Spotify','IBM','Cisco','SymphonyAI','Palo Alto Networks','Accenture','Microsoft','J.P. Morgan','Cloudera','Splunk','Intuit','Salesforce'];
const UNIVERSITIES = ['IIM Bangalore','Stanford University','Harvard Business School','Harvard University','IIM Calcutta','University of Texas at Austin'];
const PAGE_TITLES = ['Applied AI Mastery','Cohort overview','Who the cohort is for','Core outcome','AI Curious → AI Native','Faculty-built products','Industry & institutional partnerships','Faculty & mentors','The modern AI stack','Three modules, 24 weeks','Generative media curriculum','Full-stack curriculum','LLMs & RAG curriculum','Agents curriculum','Cohort schedule','Tailored learning pathways','Tracks and execution paths','Your learning milestones','Build-in-public projects','Community outcomes','Practitioner stories','Community leaders','Companies & alma mater','Lifetime community','Who the programme suits','Your next six months','Contact & payment options'];
const api={OVERVIEW,TRACKS,HOUSES,MATURITY,MENTORS,BOOKS,PEOPLE,COMPANIES,UNIVERSITIES,PAGE_TITLES};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CohortContent=api;
})(typeof window!=='undefined'?window:this);
