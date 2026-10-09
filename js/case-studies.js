/* ==========================================================================
   4Dev Studio — Case study data + renderers
   Drives the Work hub (work.html) and the case-study detail page.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Data ---------- */
  const caseStudies = [
    {
      slug: "northline-logistics",
      client: "Northline Logistics",
      industry: "Logistics · SaaS",
      title: "Cutting dispatch coordination from hours to minutes.",
      tagline: "A custom dispatch system that replaced spreadsheets, phone calls, and a whiteboard.",
      year: "2025",
      duration: "9 weeks",
      metric: "−87%",
      metricLabel: "time spent coordinating dispatches",
      problem:
        "Northline's dispatchers coordinated 40+ daily routes through a mix of spreadsheets, phone calls, and a physical whiteboard. Every last-minute change meant a cascade of manual updates, and there was no live view of where anything stood.",
      approach:
        "We spent a week shadowing dispatchers, mapped every workflow, and designed a system that matched how they actually worked — not how a textbook said they should. Weekly demos kept the team involved throughout.",
      solution: [
        "Live dispatch board with drag-and-drop route assignment",
        "Automated SMS notifications to drivers on route changes",
        "Customer-facing ETA tracking page",
        "Integration with existing accounting software",
        "Role-based access for dispatchers, supervisors, and admins",
        "Daily automated reports to ownership",
      ],
      result:
        "Dispatch coordination time dropped from roughly 4 hours per day to under 30 minutes. Drivers got real-time updates instead of phone calls. Customer complaints about missed windows fell by more than half within the first month.",
      stack: ["Next.js", "Node.js", "PostgreSQL", "Twilio", "AWS"],
      quote: {
        text: "We went from chaos to calm in six weeks. The team actually uses it — that's the part I didn't expect.",
        author: "Operations Director, Northline Logistics",
      },
    },
    {
      slug: "harbor-and-co",
      client: "Harbor & Co.",
      industry: "Professional Services · Consulting",
      title: "A client portal that made proposals, invoices, and updates disappear into the background.",
      tagline: "How a boutique consultancy replaced 6 tools with one — and cut admin time by 70%.",
      year: "2025",
      duration: "7 weeks",
      metric: "−70%",
      metricLabel: "admin time per client engagement",
      problem:
        "Harbor & Co. was running client work across email, Google Drive, a project tool, a separate invoicing platform, and a shared calendar. Every new client meant another folder structure, another invite, another follow-up. Partners were spending more time on admin than on billable work.",
      approach:
        "We audited their tools, interviewed partners, and designed a single portal where clients log in to see proposals, sign contracts, track project status, download deliverables, and pay invoices — all in one place.",
      solution: [
        "Branded client portal with per-client login",
        "Built-in e-signature for proposals and contracts",
        "Automated invoice generation and payment reminders",
        "Project timeline with milestone notifications",
        "File sharing with version history",
        "Admin dashboard for all engagements at a glance",
      ],
      result:
        "Partners cut admin time by roughly 70%. Clients stopped asking 'where is that file?' Onboarding a new client went from a 2-hour setup to a 5-minute invite.",
      stack: ["Next.js", "Stripe", "PostgreSQL", "Resend", "Vercel"],
      quote: {
        text: "The portal is the first thing I mention in new client calls. It sells itself.",
        author: "Managing Partner, Harbor & Co.",
      },
    },
    {
      slug: "meridian-clinics",
      client: "Meridian Clinics",
      industry: "Healthcare · Multi-location",
      title: "Scheduling, reminders, and no-shows — solved in a single system.",
      tagline: "How a 4-location clinic group reduced no-shows by 41% and freed up their front desk.",
      year: "2024",
      duration: "11 weeks",
      metric: "−41%",
      metricLabel: "no-show rate within 90 days",
      problem:
        "Meridian was juggling four clinics, three phone lines, and a booking system that didn't talk to their patient records. Front-desk staff spent their days on the phone confirming appointments instead of helping patients in the room. No-shows were silently bleeding revenue.",
      approach:
        "We built a unified scheduling system that connected all four locations, automated patient reminders across SMS and email, and gave the front desk a single view of every appointment. We ran it in parallel with their old system for two weeks before switching over.",
      solution: [
        "Multi-location scheduling with real-time availability",
        "Automated SMS + email reminders (24h and 2h before)",
        "Waitlist system for filling last-minute cancellations",
        "Patient record integration",
        "Staff dashboard with day-at-a-glance view",
        "Automated no-show tracking and reporting",
      ],
      result:
        "No-show rate dropped from 18% to just over 10% within 90 days. Front-desk staff reclaimed roughly 15 hours per week across the group. Two locations added evening slots without adding headcount.",
      stack: ["Next.js", "Node.js", "PostgreSQL", "Twilio", "SendGrid"],
      quote: {
        text: "Our front desk used to dread Mondays. Now they're mostly working with patients in the room. That's the whole point.",
        author: "Practice Manager, Meridian Clinics",
      },
    },
  ];

  /* ---------- Work hub: render cards ---------- */
  const workGrid = document.querySelector("[data-work-grid]");
  if (workGrid) {
    workGrid.innerHTML = caseStudies
      .map(function (c, i) {
        return (
          '<a class="card case-card" href="case-study.html?slug=' + c.slug + '">' +
            '<div class="case-card-meta">' +
              '<span class="case-card-industry">' + c.industry + '</span>' +
              '<span class="case-card-year">' + c.year + '</span>' +
            '</div>' +
            "<h3>" + c.title + "</h3>" +
            '<p class="case-card-tagline">' + c.tagline + "</p>" +
            '<div class="case-card-metric">' +
              '<span class="case-card-metric-num">' + c.metric + '</span>' +
              '<span class="case-card-metric-label">' + c.metricLabel + '</span>' +
            '</div>' +
            '<span class="card-link">Read case study</span>' +
          "</a>"
        );
      })
      .join("");
  }

  /* ---------- Home: featured case studies (optional) ---------- */
  const featuredGrid = document.querySelector("[data-featured-work]");
  if (featuredGrid) {
    // Show only the first 2 on Home
    featuredGrid.innerHTML = caseStudies
      .slice(0, 2)
      .map(function (c) {
        return (
          '<a class="card case-card" href="case-study.html?slug=' + c.slug + '">' +
            '<div class="case-card-meta">' +
              '<span class="case-card-industry">' + c.industry + '</span>' +
              '<span class="case-card-year">' + c.year + '</span>' +
            '</div>' +
            "<h3>" + c.title + "</h3>" +
            '<div class="case-card-metric">' +
              '<span class="case-card-metric-num">' + c.metric + '</span>' +
              '<span class="case-card-metric-label">' + c.metricLabel + '</span>' +
            '</div>' +
            '<span class="card-link">Read case study</span>' +
          "</a>"
        );
      })
      .join("");
  }

  /* ---------- Detail page: render from ?slug= ---------- */
  const detail = document.querySelector("[data-case-study-detail]");
  if (detail) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug") || caseStudies[0].slug;
    const c =
      caseStudies.find(function (x) { return x.slug === slug; }) ||
      caseStudies[0];

    document.title = c.client + " — Case Study | 4Dev Studio";

    detail.innerHTML =
      // ---------- HERO ----------
      '<section class="service-hero">' +
        '<div class="container-x">' +
          '<a class="back" href="work.html">All work</a>' +
          '<p class="eyebrow">' + c.industry + " · " + c.year + "</p>" +
          "<h1>" + c.title + "</h1>" +
          '<p class="lead">' + c.tagline + "</p>" +
          '<div class="case-hero-stats">' +
            '<div class="case-hero-stat">' +
              '<span class="case-hero-stat-num">' + c.metric + '</span>' +
              '<span class="case-hero-stat-label">' + c.metricLabel + '</span>' +
            "</div>" +
            '<div class="case-hero-stat">' +
              '<span class="case-hero-stat-num">' + c.duration + '</span>' +
              '<span class="case-hero-stat-label">Time to ship</span>' +
            "</div>" +
            '<div class="case-hero-stat">' +
              '<span class="case-hero-stat-num">' + c.client + '</span>' +
              '<span class="case-hero-stat-label">Client</span>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>" +

      // ---------- BODY ----------
      '<section class="service-body">' +
        '<div class="container-x">' +

          '<div class="service-section">' +
            "<h2>The challenge</h2>" +
            "<p>" + c.problem + "</p>" +
          "</div>" +

          '<div class="service-section">' +
            "<h2>Our approach</h2>" +
            "<p>" + c.approach + "</p>" +
          "</div>" +

          '<div class="service-section">' +
            "<h2>What we built</h2>" +
            '<ul class="check-list">' +
              c.solution.map(function (s) { return "<li>" + s + "</li>"; }).join("") +
            "</ul>" +
          "</div>" +

          '<div class="service-section">' +
            "<h2>The result</h2>" +
            "<p>" + c.result + "</p>" +
          "</div>" +

          '<div class="service-section">' +
            "<h2>Tech we used</h2>" +
            '<div class="pills">' +
              c.stack.map(function (t) { return '<span class="pill">' + t + "</span>"; }).join("") +
            "</div>" +
          "</div>" +

          (c.quote
            ? '<div class="service-section">' +
                '<blockquote class="case-quote">' +
                  "<p>" + c.quote.text + "</p>" +
                  "<cite>" + c.quote.author + "</cite>" +
                "</blockquote>" +
              "</div>"
            : "") +

        "</div>" +
      "</section>" +

      // ---------- CTA ----------
      '<section class="section-sm">' +
        '<div class="container-x">' +
          '<div class="cta-band">' +
            '<p class="eyebrow">Have something similar?</p>' +
            "<h2>Let's talk about your project.</h2>" +
            "<p>We'll tell you how we'd approach it — no sales pitch, no obligation.</p>" +
            '<a class="btn btn-primary btn-arrow" href="contact.html">Book a discovery call</a>' +
          "</div>" +
        "</div>" +
      "</section>";
  }
  window.dispatchEvent(new CustomEvent("case-studies:rendered"));
})();