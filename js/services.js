/* ==========================================================================
   4Dev Studio — Service data + renderer
   Drives both the services hub cards and the single service page template.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Data ---------- */
  const services = [
    {
      slug: "automate-operations",
      icon: "01",
      title: "Automate Operations",
      tagline: "Systemize internal workflows and gain real-time visibility.",
      summary:
        "We map how your business actually runs, then replace the spreadsheets, group chats, and manual handoffs with a system your team will actually use.",
      problem:
        "Your team spends hours on repetitive internal work — approvals, data entry, status updates — and no one has a clear, live view of what's happening.",
      deliverables: [
        "Workflow audit & process mapping",
        "Custom internal dashboard",
        "Role-based access & permissions",
        "Automated notifications and approvals",
        "Reporting & analytics layer",
        "Integrations with your existing tools",
      ],
      process: [
        { title: "Discover", description: "We shadow your team and document every step of the current workflow." },
        { title: "Design", description: "We design the target system and confirm it matches how you actually work." },
        { title: "Build", description: "We build, test, and iterate with your team in weekly demos." },
        { title: "Launch", description: "We roll out, train your team, and monitor adoption." },
        { title: "Scale", description: "We keep improving based on real usage data." },
      ],
      stack: ["Next.js", "Node.js", "PostgreSQL", "Redis", "AWS", "Supabase"],
      faqs: [
        { q: "How long does a typical build take?", a: "Most operations systems ship in 6–10 weeks, with a working prototype in week 3." },
        { q: "Can you integrate with our existing tools?", a: "Yes — we regularly integrate with CRMs, ERPs, accounting, and messaging platforms." },
        { q: "What if we don't know our exact requirements?", a: "That's normal. The Discover phase is designed to surface them." },
      ],
    },
    {
      slug: "automate-sales",
      icon: "02",
      title: "Automate Sales",
      tagline: "Turn leads into revenue — automatically.",
      summary:
        "We build the pipeline that captures, qualifies, nurtures, and converts leads without your sales team chasing every touch manually.",
      problem:
        "Leads slip through the cracks, follow-ups are inconsistent, and your team spends more time on admin than on selling.",
      deliverables: [
        "Lead capture & enrichment",
        "Automated qualification & scoring",
        "Multi-channel follow-up sequences",
        "CRM integration & pipeline visibility",
        "Sales dashboard & forecasting",
        "Conversion analytics",
      ],
      process: [
        { title: "Audit", description: "We review your current funnel and find where revenue leaks." },
        { title: "Design", description: "We design the automated pipeline end-to-end." },
        { title: "Build", description: "We implement integrations, sequences, and dashboards." },
        { title: "Launch", description: "We go live and validate performance against baseline." },
        { title: "Optimize", description: "We A/B test and refine continuously." },
      ],
      stack: ["Next.js", "HubSpot", "Node.js", "PostgreSQL", "Twilio", "SendGrid"],
      faqs: [
        { q: "Will this replace our sales team?", a: "No — it removes the busywork so they can focus on closing." },
        { q: "Which CRMs do you support?", a: "HubSpot, Salesforce, Pipedrive, and custom in-house systems." },
        { q: "How fast can we see results?", a: "Most clients see measurable lift within 4–6 weeks of launch." },
      ],
    },
    {
      slug: "automate-business",
      icon: "03",
      title: "Automate Business",
      tagline: "Run your entire business on autopilot.",
      summary:
        "For companies ready to go further — we connect sales, operations, finance, and support into one system that runs itself.",
      problem:
        "Your departments work in silos, data is duplicated everywhere, and every decision requires manually pulling numbers from five places.",
      deliverables: [
        "Company-wide systems architecture",
        "Cross-department integrations",
        "Unified data warehouse",
        "Executive dashboards",
        "Automated reporting",
        "Ongoing optimization retainer",
      ],
      process: [
        { title: "Map", description: "We document every department and how they interact." },
        { title: "Architect", description: "We design the unified system and migration path." },
        { title: "Build", description: "We build in phases, keeping the business running throughout." },
        { title: "Migrate", description: "We move data and workflows with zero downtime." },
        { title: "Operate", description: "We stay on as your long-term technical partner." },
      ],
      stack: ["Next.js", "Node.js", "PostgreSQL", "Airbyte", "Metabase", "AWS"],
      faqs: [
        { q: "Is this only for large companies?", a: "No — we work with growing SMEs too. Scope scales to fit." },
        { q: "How disruptive is the migration?", a: "We phase it and run parallel systems so daily operations never stop." },
        { q: "Do you offer ongoing support?", a: "Yes — most clients move to a monthly retainer after launch." },
      ],
    },
    {
      slug: "build-your-idea",
      icon: "04",
      title: "Build Your Idea",
      tagline: "Turn your idea into a working product.",
      summary:
        "From napkin sketch to launch — we design, build, and ship MVPs for founders and product teams who need to move fast.",
      problem:
        "You have a validated idea but no technical team, no clear roadmap, and no idea how to get from concept to a real product users can touch.",
      deliverables: [
        "Product discovery & scoping",
        "UX/UI design",
        "MVP build (web and/or mobile)",
        "Analytics & instrumentation",
        "Launch support",
        "Post-launch iteration plan",
      ],
      process: [
        { title: "Scope", description: "We define the smallest version worth building." },
        { title: "Design", description: "We design the full user journey and validate with prototypes." },
        { title: "Build", description: "We ship in weekly sprints with working demos every Friday." },
        { title: "Launch", description: "We handle deployment, monitoring, and go-live." },
        { title: "Iterate", description: "We help you learn from real users and improve." },
      ],
      stack: ["Next.js", "React Native", "Node.js", "PostgreSQL", "Vercel", "Stripe"],
      faqs: [
        { q: "How much does an MVP cost?", a: "Typical MVPs range from a few weeks to a few months depending on scope. We'll give you a fixed quote after scoping." },
        { q: "Do you build mobile apps?", a: "Yes — native iOS/Android via React Native, or web-first PWAs." },
        { q: "Do you sign NDAs?", a: "Absolutely, before any detailed conversation." },
      ],
    },
  ];

  /* ---------- Hub page: render service cards ---------- */
  const hubGrid = document.querySelector("[data-services-grid]");
  if (hubGrid) {
    hubGrid.innerHTML = services
      .map(function (s) {
        return (
          '<a class="card" href="service.html?slug=' + s.slug + '">' +
            '<div class="card-icon">' + s.icon + "</div>" +
            "<h3>" + s.title + "</h3>" +
            "<p>" + s.tagline + "</p>" +
            '<span class="card-link">Learn more</span>' +
          "</a>"
        );
      })
      .join("");
  }

  /* ---------- Home page: render value pillars (short version) ---------- */
  const pillarsGrid = document.querySelector("[data-pillars-grid]");
  if (pillarsGrid) {
    pillarsGrid.innerHTML = services
      .map(function (s) {
        return (
          '<a class="card" href="service.html?slug=' + s.slug + '">' +
            '<div class="card-icon">' + s.icon + "</div>" +
            "<h3>" + s.title + "</h3>" +
            "<p>" + s.tagline + "</p>" +
          "</a>"
        );
      })
      .join("");
  }

  /* ---------- Service detail page: render from ?slug= ---------- */
  const detail = document.querySelector("[data-service-detail]");
  if (detail) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug") || services[0].slug;
    const s = services.find(function (x) { return x.slug === slug; }) || services[0];

    document.title = s.title + " | 4Dev Studio";

    detail.innerHTML =
      '<section class="service-hero">' +
        '<div class="container-x">' +
          '<a class="back" href="services.html">All services</a>' +
          '<p class="eyebrow">Service</p>' +
          "<h1>" + s.title + "</h1>" +
          '<p class="lead">' + s.summary + "</p>" +
          '<div class="hero-actions">' +
            '<a class="btn btn-primary btn-arrow" href="contact.html">Book a discovery call</a>' +
          "</div>" +
        "</div>" +
      "</section>" +

      '<section class="service-body">' +
        '<div class="container-x">' +

          '<div class="service-section">' +
            "<h2>The problem</h2>" +
            "<p>" + s.problem + "</p>" +
          "</div>" +

          '<div class="service-section">' +
            "<h2>What we build</h2>" +
            '<ul class="check-list">' +
              s.deliverables.map(function (d) { return "<li>" + d + "</li>"; }).join("") +
            "</ul>" +
          "</div>" +

          '<div class="service-section">' +
            "<h2>How it works</h2>" +
            '<div class="steps">' +
              s.process.map(function (p, i) {
                return (
                  '<div class="step">' +
                    '<div class="step-num">STEP ' + String(i + 1).padStart(2, "0") + "</div>" +
                    "<h4>" + p.title + "</h4>" +
                    "<p>" + p.description + "</p>" +
                  "</div>"
                );
              }).join("") +
            "</div>" +
          "</div>" +

          '<div class="service-section">' +
            "<h2>Tech we use</h2>" +
            '<div class="pills">' +
              s.stack.map(function (t) { return '<span class="pill">' + t + "</span>"; }).join("") +
            "</div>" +
          "</div>" +

          '<div class="service-section">' +
            "<h2>Frequently asked</h2>" +
            '<div class="faq">' +
              s.faqs.map(function (f) {
                return (
                  '<div class="faq-item">' +
                    '<button class="faq-q" type="button">' + f.q + "</button>" +
                    '<div class="faq-a"><div class="faq-a-inner">' + f.a + "</div></div>" +
                  "</div>"
                );
              }).join("") +
            "</div>" +
          "</div>" +

        "</div>" +
      "</section>";


  }

  /* Re-run reveal auto-tagger now that service cards exist */
  window.dispatchEvent(new CustomEvent("services:rendered"));
})();