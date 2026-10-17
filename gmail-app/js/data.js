/* ========================================================================
   CloudMail - Demo Data
   Comprehensive sample data for all email, contacts, labels, settings
   ======================================================================== */

window.CloudMailData = (function() {
  'use strict';

  const currentUser = {
    id: 'user-1',
    name: 'Sandeep Kumar',
    email: 'sandeep.kumar@cloudmail.com',
    avatar: null,
    initials: 'SK',
    avatarColor: '#1a73e8',
    phone: '+1 (555) 123-4567',
    recoveryEmail: 's.kumar.backup@email.com',
    language: 'English',
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-15'
  };

  const otherAccounts = [
    { name: 'Sandeep K (Work)', email: 'sandeep@techcorp.io', initials: 'SK', avatarColor: '#e37400' },
    { name: 'Sandeep Personal', email: 'sandy.k@cloudmail.com', initials: 'SP', avatarColor: '#188038' }
  ];

  // Helper to generate dates relative to now
  function daysAgo(n) {
    const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString();
  }
  function hoursAgo(n) {
    const d = new Date(); d.setHours(d.getHours() - n); return d.toISOString();
  }
  function minutesAgo(n) {
    const d = new Date(); d.setMinutes(d.getMinutes() - n); return d.toISOString();
  }

  const sampleEmails = [
    // ===== PRIMARY INBOX =====
    {
      id: 'e001', threadId: 't001',
      from: { name: 'Alex Thompson', email: 'alex.thompson@techcorp.io' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Q4 Product Roadmap Review - Action Required',
      body: `<p>Hi Sandeep,</p>
<p>I've finalized the Q4 product roadmap and need your review before we present it to the board next Tuesday. The key highlights include:</p>
<ul>
<li><strong>AI Integration Module</strong> - Expected launch in November</li>
<li><strong>Performance Dashboard v2</strong> - Complete redesign with real-time analytics</li>
<li><strong>Mobile App Refresh</strong> - New UI/UX aligned with our design system</li>
</ul>
<p>Could you please review the attached document and provide your feedback by end of day Friday?</p>
<p>Best regards,<br>Alex Thompson<br>VP of Product, TechCorp</p>`,
      snippet: 'I\'ve finalized the Q4 product roadmap and need your review before we present it to the board...',
      date: minutesAgo(23),
      read: false, starred: true, important: true, snoozed: false, archived: false,
      labels: ['work'], folder: 'inbox', category: 'primary',
      attachments: [{ name: 'Q4_Roadmap_2026.pdf', size: '2.4 MB', type: 'pdf' }],
      replies: []
    },
    {
      id: 'e002', threadId: 't002',
      from: { name: 'Sarah Chen', email: 'sarah.chen@designstudio.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [{ name: 'Mike Johnson', email: 'mike.j@designstudio.com' }], bcc: [],
      subject: 'Re: Website Redesign Mockups - Final Iteration',
      body: `<p>Hey Sandeep!</p>
<p>Great news - the design team has completed the final iteration of the website mockups. I've incorporated all the feedback from our last review session:</p>
<ol>
<li>Updated the color palette to match the new brand guidelines</li>
<li>Improved the mobile navigation flow</li>
<li>Added micro-interactions for the dashboard components</li>
<li>Revised the typography scale</li>
</ol>
<p>Take a look at the attached Figma export and let me know if we're good to move to development!</p>
<p>Cheers,<br>Sarah</p>`,
      snippet: 'Great news - the design team has completed the final iteration of the website mockups...',
      date: hoursAgo(1),
      read: false, starred: false, important: true, snoozed: false, archived: false,
      labels: ['design'], folder: 'inbox', category: 'primary',
      attachments: [
        { name: 'Website_Mockups_v3.fig', size: '18.7 MB', type: 'file' },
        { name: 'Design_Specs.pdf', size: '4.1 MB', type: 'pdf' }
      ],
      replies: [
        {
          id: 'e002-r1', from: { name: currentUser.name, email: currentUser.email },
          to: [{ name: 'Sarah Chen', email: 'sarah.chen@designstudio.com' }],
          body: '<p>Hi Sarah, the mockups look fantastic! I have a few minor notes on the dashboard layout. Can we schedule a quick 15-min call tomorrow?</p>',
          date: hoursAgo(3), read: true
        }
      ]
    },
    {
      id: 'e003', threadId: 't003',
      from: { name: 'James Rodriguez', email: 'j.rodriguez@cloudmail.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Team Lunch This Friday 🍕',
      body: `<p>Hi everyone,</p>
<p>Just a reminder that we're doing our monthly team lunch this Friday at 12:30 PM. I've booked a table at <strong>The Garden Bistro</strong> downtown.</p>
<p>Please let me know if you have any dietary restrictions I should be aware of. Otherwise, I'll go with the prix fixe menu.</p>
<p>See you there! 🎉</p>
<p>James</p>`,
      snippet: 'Just a reminder that we\'re doing our monthly team lunch this Friday at 12:30 PM...',
      date: hoursAgo(2),
      read: false, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'primary',
      attachments: [],
      replies: []
    },
    {
      id: 'e004', threadId: 't004',
      from: { name: 'Priya Patel', email: 'priya.patel@startup.io' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Exciting Partnership Opportunity',
      body: `<p>Dear Sandeep,</p>
<p>I hope this email finds you well! I'm reaching out because I've been following your work at TechCorp, and I believe there's a fantastic opportunity for collaboration between our companies.</p>
<p>We've recently developed an AI-powered analytics platform that could complement your product suite perfectly. I'd love to schedule a 30-minute call to discuss how we might work together.</p>
<p>Would next week work for you? I'm flexible on timing.</p>
<p>Best,<br>Priya Patel<br>Co-founder & CEO, StartupIO</p>`,
      snippet: 'I\'m reaching out because I\'ve been following your work at TechCorp, and I believe there\'s a fantastic...',
      date: hoursAgo(4),
      read: true, starred: true, important: true, snoozed: false, archived: false,
      labels: ['work'], folder: 'inbox', category: 'primary',
      attachments: [{ name: 'Partnership_Proposal.pdf', size: '1.8 MB', type: 'pdf' }],
      replies: []
    },
    {
      id: 'e005', threadId: 't005',
      from: { name: 'DevOps Alert', email: 'alerts@monitoring.techcorp.io' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: '⚠️ High CPU Usage Detected - Production Server',
      body: `<p><strong>Alert: High CPU Usage Detected</strong></p>
<p>Server: <code>prod-web-03.techcorp.io</code><br>
Metric: CPU Usage<br>
Current Value: <span style="color: red;"><strong>94.7%</strong></span><br>
Threshold: 85%<br>
Duration: 15 minutes</p>
<p>Please investigate immediately. Auto-scaling has been triggered.</p>
<p>—<br>TechCorp Monitoring System</p>`,
      snippet: '⚠️ Alert: High CPU Usage at 94.7% on prod-web-03. Auto-scaling triggered...',
      date: hoursAgo(5),
      read: true, starred: false, important: true, snoozed: false, archived: false,
      labels: ['devops'], folder: 'inbox', category: 'updates',
      attachments: [],
      replies: []
    },
    {
      id: 'e006', threadId: 't006',
      from: { name: 'Emma Wilson', email: 'emma.w@university.edu' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Guest Lecture Invitation - Advanced Web Technologies',
      body: `<p>Dear Mr. Kumar,</p>
<p>I'm a professor in the Computer Science department at State University, and I would be honored to invite you as a guest lecturer for our Advanced Web Technologies course.</p>
<p>The lecture would be a 90-minute session covering modern web architecture and your experiences building scalable applications. We have around 120 students who would benefit greatly from your expertise.</p>
<p>The proposed dates are:<br>
- November 12, 2026 (Tuesday) 2:00 - 3:30 PM<br>
- November 19, 2026 (Tuesday) 2:00 - 3:30 PM</p>
<p>We can offer a modest honorarium and would be happy to arrange logistics.</p>
<p>Warm regards,<br>Prof. Emma Wilson</p>`,
      snippet: 'I would be honored to invite you as a guest lecturer for our Advanced Web Technologies course...',
      date: hoursAgo(8),
      read: true, starred: true, important: false, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'primary',
      attachments: [],
      replies: []
    },
    {
      id: 'e007', threadId: 't007',
      from: { name: 'Netflix', email: 'info@mailer.netflix.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'New arrivals just for you!',
      body: `<p>Hi Sandeep,</p>
<p>Based on your watching history, we think you'll love these new additions:</p>
<ul>
<li>🎬 <strong>The Code Breakers</strong> - A thrilling tech drama</li>
<li>📺 <strong>Silicon Dreams</strong> Season 3 - Now streaming</li>
<li>🎭 <strong>Quantum</strong> - Award-winning sci-fi series</li>
</ul>
<p>Start watching today!</p>`,
      snippet: 'Based on your watching history, we think you\'ll love these new additions...',
      date: hoursAgo(10),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'promotions',
      attachments: [],
      replies: []
    },
    {
      id: 'e008', threadId: 't008',
      from: { name: 'LinkedIn', email: 'notifications@linkedin.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: '15 people viewed your profile this week',
      body: `<p>Hi Sandeep,</p>
<p>Your profile is getting noticed! Here's a summary of who's been checking you out this week:</p>
<p>👤 3 Engineering Managers<br>👤 5 Recruiters<br>👤 4 CTOs<br>👤 3 Product Managers</p>
<p>Your profile views are up 23% from last week. Keep sharing great content!</p>`,
      snippet: 'Your profile is getting noticed! 15 people viewed your profile this week...',
      date: hoursAgo(12),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'social',
      attachments: [],
      replies: []
    },
    {
      id: 'e009', threadId: 't009',
      from: { name: 'GitHub', email: 'notifications@github.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: '[cloudmail/frontend] Pull request #247: Implement dark mode toggle',
      body: `<p><strong>@mike-dev</strong> opened a pull request in <strong>cloudmail/frontend</strong></p>
<p><strong>Implement dark mode toggle</strong> #247</p>
<p>Changes:<br>
+ 142 additions, - 23 deletions across 8 files</p>
<p>This PR adds a dark mode toggle to the settings panel and implements the theme switching logic using CSS custom properties.</p>
<p>Ready for review.</p>`,
      snippet: '@mike-dev opened a pull request: Implement dark mode toggle #247...',
      date: hoursAgo(14),
      read: false, starred: false, important: false, snoozed: false, archived: false,
      labels: ['dev'], folder: 'inbox', category: 'updates',
      attachments: [],
      replies: []
    },
    {
      id: 'e010', threadId: 't010',
      from: { name: 'Amazon', email: 'ship-confirm@amazon.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Your order has shipped! 📦',
      body: `<p>Hi Sandeep,</p>
<p>Great news! Your order has shipped and is on its way.</p>
<p><strong>Order #112-4567890-1234567</strong></p>
<p>📦 Mechanical Keyboard - Keychron Q1 Pro<br>
Estimated delivery: October 20, 2026</p>
<p>Track your package with the link below.</p>`,
      snippet: 'Your order has shipped! Mechanical Keyboard - Keychron Q1 Pro. Estimated delivery: Oct 20...',
      date: daysAgo(1),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: ['shopping'], folder: 'inbox', category: 'updates',
      attachments: [],
      replies: []
    },
    {
      id: 'e011', threadId: 't011',
      from: { name: 'David Park', email: 'david.park@techcorp.io' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [
        { name: 'Lisa Wang', email: 'lisa.w@techcorp.io' },
        { name: 'Tom Baker', email: 'tom.b@techcorp.io' }
      ], bcc: [],
      subject: 'Sprint Retrospective Notes - Sprint 42',
      body: `<p>Hi team,</p>
<p>Here are the notes from today's sprint retrospective:</p>
<p><strong>What went well:</strong></p>
<ul>
<li>Successfully deployed the new authentication system</li>
<li>Reduced page load time by 40%</li>
<li>Zero critical bugs in production</li>
</ul>
<p><strong>What could be improved:</strong></p>
<ul>
<li>Better estimation for complex tickets</li>
<li>More pair programming sessions</li>
<li>Documentation needs updating</li>
</ul>
<p><strong>Action items:</strong></p>
<ul>
<li>Sandeep: Update the API documentation</li>
<li>Lisa: Schedule knowledge sharing session</li>
<li>Tom: Set up automated testing pipeline</li>
</ul>
<p>Great work this sprint! 🎉</p>
<p>David</p>`,
      snippet: 'Here are the notes from today\'s sprint retrospective. What went well: Successfully deployed...',
      date: daysAgo(1),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: ['work'], folder: 'inbox', category: 'primary',
      attachments: [{ name: 'Sprint42_Retro.md', size: '24 KB', type: 'file' }],
      replies: []
    },
    {
      id: 'e012', threadId: 't012',
      from: { name: 'Medium Daily Digest', email: 'noreply@medium.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Today\'s top stories in Technology',
      body: `<p>Your daily digest from Medium:</p>
<p>📰 <strong>"The Future of WebAssembly in 2027"</strong> by John Smith — 8 min read</p>
<p>📰 <strong>"Why Every Developer Should Learn Rust"</strong> by Jane Doe — 12 min read</p>
<p>📰 <strong>"Building Scalable Microservices with Go"</strong> by Mike Chen — 6 min read</p>`,
      snippet: 'Your daily digest: "The Future of WebAssembly in 2027", "Why Every Developer Should Learn Rust"...',
      date: daysAgo(1),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'promotions',
      attachments: [],
      replies: []
    },
    {
      id: 'e013', threadId: 't013',
      from: { name: 'Twitter', email: 'notify@twitter.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'You have new followers and mentions!',
      body: `<p>Hi @sandeepk,</p>
<p>Here's what you missed:</p>
<p>👤 12 new followers this week<br>💬 5 new mentions<br>❤️ 87 likes on your recent post</p>
<p>Your tweet about "The importance of code reviews" is trending!</p>`,
      snippet: '12 new followers this week, 5 new mentions, 87 likes on your recent post...',
      date: daysAgo(2),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'social',
      attachments: [],
      replies: []
    },
    {
      id: 'e014', threadId: 't014',
      from: { name: 'Maria Garcia', email: 'maria.garcia@freelance.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Invoice #2026-089 for October Services',
      body: `<p>Hi Sandeep,</p>
<p>Please find attached the invoice for consulting services rendered in October 2026.</p>
<p><strong>Invoice #2026-089</strong><br>
Amount: $4,500.00<br>
Due Date: November 15, 2026</p>
<p>Payment can be made via bank transfer to the account details on the invoice.</p>
<p>Thank you for your continued business!</p>
<p>Best,<br>Maria Garcia<br>Freelance Design Consultant</p>`,
      snippet: 'Please find attached the invoice for consulting services rendered in October. Amount: $4,500.00...',
      date: daysAgo(2),
      read: true, starred: true, important: true, snoozed: false, archived: false,
      labels: ['finance'], folder: 'inbox', category: 'primary',
      attachments: [{ name: 'Invoice_2026-089.pdf', size: '156 KB', type: 'pdf' }],
      replies: []
    },
    {
      id: 'e015', threadId: 't015',
      from: { name: 'Slack', email: 'feedback@slack.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'New messages in #engineering-team',
      body: `<p>You have unread messages in the following channels:</p>
<p><strong>#engineering-team</strong> - 8 new messages<br>
<strong>#random</strong> - 3 new messages<br>
<strong>#announcements</strong> - 1 new message</p>`,
      snippet: 'You have unread messages in #engineering-team (8), #random (3), #announcements (1)...',
      date: daysAgo(2),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'updates',
      attachments: [],
      replies: []
    },
    {
      id: 'e016', threadId: 't016',
      from: { name: 'Rachel Kim', email: 'rachel.kim@techcorp.io' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Code Review Request: Authentication Refactor',
      body: `<p>Hi Sandeep,</p>
<p>I've completed the authentication refactor and would appreciate your review. The changes include:</p>
<ul>
<li>Migrated from JWT to session-based auth</li>
<li>Added refresh token rotation</li>
<li>Implemented CSRF protection</li>
<li>Added rate limiting on login endpoints</li>
</ul>
<p>PR link: <a href="#">#298</a></p>
<p>Thanks!</p>`,
      snippet: 'I\'ve completed the authentication refactor. Migrated from JWT to session-based auth...',
      date: daysAgo(3),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: ['dev', 'work'], folder: 'inbox', category: 'primary',
      attachments: [],
      replies: []
    },
    {
      id: 'e017', threadId: 't017',
      from: { name: 'Google Cloud', email: 'cloud-noreply@google.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Your monthly billing summary - October 2026',
      body: `<p>Hi Sandeep,</p>
<p>Here's your Google Cloud billing summary for October 2026:</p>
<p>Total charges: <strong>$342.18</strong></p>
<p>Compute Engine: $198.50<br>Cloud Storage: $45.30<br>Cloud Functions: $67.88<br>Networking: $30.50</p>`,
      snippet: 'Your Google Cloud billing summary for October 2026. Total charges: $342.18...',
      date: daysAgo(3),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: ['finance'], folder: 'inbox', category: 'updates',
      attachments: [{ name: 'GCP_Invoice_Oct2026.pdf', size: '89 KB', type: 'pdf' }],
      replies: []
    },
    {
      id: 'e018', threadId: 't018',
      from: { name: 'Shopify', email: 'deals@shopify.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: '🎉 Black Friday Early Access - Save 25% on all plans!',
      body: `<p>Hi Sandeep,</p>
<p>Get a head start on Black Friday! Enjoy 25% off all Shopify plans for 3 months.</p>
<p>Use code: <strong>EARLY25</strong></p>
<p>Offer expires November 15, 2026.</p>`,
      snippet: 'Get a head start on Black Friday! Enjoy 25% off all Shopify plans for 3 months...',
      date: daysAgo(4),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'promotions',
      attachments: [],
      replies: []
    },
    {
      id: 'e019', threadId: 't019',
      from: { name: 'Security Team', email: 'security@cloudmail.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'New sign-in from Chrome on Windows',
      body: `<p>Hi Sandeep,</p>
<p>We noticed a new sign-in to your CloudMail account.</p>
<p><strong>Device:</strong> Chrome on Windows<br><strong>Location:</strong> Mumbai, India<br><strong>Time:</strong> October 15, 2026 at 9:42 AM IST</p>
<p>If this was you, you can ignore this message. If you don't recognize this activity, please secure your account immediately.</p>`,
      snippet: 'New sign-in detected from Chrome on Windows in Mumbai, India...',
      date: daysAgo(2),
      read: true, starred: false, important: true, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'updates',
      attachments: [],
      replies: []
    },
    {
      id: 'e020', threadId: 't020',
      from: { name: 'Mom', email: 'sunita.kumar@cloudmail.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Diwali plans? 🪔',
      body: `<p>Hi beta,</p>
<p>Are you coming home for Diwali this year? Papa and I are planning a big gathering with the whole family. Your cousin Rahul is also coming from Bangalore.</p>
<p>Let me know your dates so I can plan accordingly. Also, what sweets should I make? Your favorite kaju katli?</p>
<p>Love,<br>Mom ❤️</p>`,
      snippet: 'Are you coming home for Diwali this year? Papa and I are planning a big gathering...',
      date: daysAgo(3),
      read: true, starred: true, important: false, snoozed: false, archived: false,
      labels: ['personal'], folder: 'inbox', category: 'primary',
      attachments: [],
      replies: []
    },

    // ===== SENT EMAILS =====
    {
      id: 'e021', threadId: 't021',
      from: { name: currentUser.name, email: currentUser.email },
      to: [{ name: 'Alex Thompson', email: 'alex.thompson@techcorp.io' }],
      cc: [{ name: 'Lisa Wang', email: 'lisa.w@techcorp.io' }], bcc: [],
      subject: 'Re: Q3 Performance Report - Comments Attached',
      body: `<p>Hi Alex,</p>
<p>I've reviewed the Q3 performance report and added my comments in the attached document. Overall, the results look strong, particularly in the enterprise segment.</p>
<p>A few key points I'd like to discuss:</p>
<ol>
<li>The 15% growth in ARR exceeds our target</li>
<li>Customer churn rate needs attention in the SMB segment</li>
<li>The NPS improvement is encouraging</li>
</ol>
<p>Let's discuss in our 1:1 tomorrow.</p>
<p>Best,<br>Sandeep</p>`,
      snippet: 'I\'ve reviewed the Q3 performance report and added my comments...',
      date: daysAgo(1),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: ['work'], folder: 'sent', category: 'primary',
      attachments: [{ name: 'Q3_Review_Comments.docx', size: '340 KB', type: 'doc' }],
      replies: []
    },
    {
      id: 'e022', threadId: 't022',
      from: { name: currentUser.name, email: currentUser.email },
      to: [{ name: 'HR Department', email: 'hr@techcorp.io' }],
      cc: [], bcc: [],
      subject: 'Leave Request - November 1-5',
      body: `<p>Hi HR Team,</p>
<p>I would like to request leave from November 1-5, 2026 for Diwali festivities. I will ensure all my deliverables are completed before the break.</p>
<p>Please let me know if any approvals are needed.</p>
<p>Thanks,<br>Sandeep Kumar</p>`,
      snippet: 'I would like to request leave from November 1-5 for Diwali festivities...',
      date: daysAgo(2),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'sent', category: 'primary',
      attachments: [],
      replies: []
    },
    {
      id: 'e023', threadId: 't023',
      from: { name: currentUser.name, email: currentUser.email },
      to: [{ name: 'Mom', email: 'sunita.kumar@cloudmail.com' }],
      cc: [], bcc: [],
      subject: 'Re: Diwali plans? 🪔',
      body: `<p>Hi Mom!</p>
<p>Yes, I'm definitely coming for Diwali! I'll take Nov 1-5 off. Can't wait to see everyone.</p>
<p>And yes please make kaju katli! Also gulab jamun if possible? 😄</p>
<p>Love you,<br>Sandeep</p>`,
      snippet: 'Yes, I\'m definitely coming for Diwali! I\'ll take Nov 1-5 off...',
      date: daysAgo(3),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: ['personal'], folder: 'sent', category: 'primary',
      attachments: [],
      replies: []
    },
    {
      id: 'e024', threadId: 't024',
      from: { name: currentUser.name, email: currentUser.email },
      to: [{ name: 'David Park', email: 'david.park@techcorp.io' }],
      cc: [], bcc: [],
      subject: 'API Documentation Updates - Draft',
      body: `<p>Hi David,</p>
<p>As per my action item from the retro, I've started updating the API documentation. Here's the draft for the authentication endpoints.</p>
<p>I'll have the remaining sections done by end of this week.</p>
<p>Thanks,<br>Sandeep</p>`,
      snippet: 'As per my action item from the retro, I\'ve started updating the API documentation...',
      date: daysAgo(1),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: ['work', 'dev'], folder: 'sent', category: 'primary',
      attachments: [{ name: 'API_Docs_Auth_Draft.md', size: '18 KB', type: 'file' }],
      replies: []
    },

    // ===== DRAFTS =====
    {
      id: 'e025', threadId: 't025',
      from: { name: currentUser.name, email: currentUser.email },
      to: [{ name: 'Conference Organizer', email: 'speakers@techconf2026.com' }],
      cc: [], bcc: [],
      subject: 'Speaker Proposal - TechConf 2026',
      body: `<p>Dear Conference Committee,</p>
<p>I would like to submit a speaker proposal for TechConf 2026. My proposed talk is:</p>
<p><strong>Title:</strong> "Building Resilient Web Applications at Scale"</p>
<p><strong>Abstract:</strong> In this talk, I'll share practical lessons learned from...</p>`,
      snippet: 'Speaker proposal for TechConf 2026 - "Building Resilient Web Applications at Scale"...',
      date: daysAgo(1),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'drafts', category: 'primary',
      attachments: [],
      replies: []
    },
    {
      id: 'e026', threadId: 't026',
      from: { name: currentUser.name, email: currentUser.email },
      to: [],
      cc: [], bcc: [],
      subject: 'Blog Post Draft - Microservices Best Practices',
      body: `<p><strong>Microservices Best Practices: Lessons from the Trenches</strong></p>
<p>After five years of building and maintaining microservices architectures, here are the key lessons I've learned...</p>
<p>[TODO: Add section on service discovery]</p>
<p>[TODO: Add diagrams]</p>`,
      snippet: 'Blog post draft about microservices best practices and lessons learned...',
      date: daysAgo(5),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'drafts', category: 'primary',
      attachments: [],
      replies: []
    },

    // ===== SNOOZED =====
    {
      id: 'e027', threadId: 't027',
      from: { name: 'Annual Conference', email: 'register@devcon.io' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'DevCon 2026 - Early Bird Registration Now Open!',
      body: `<p>Hi Sandeep,</p>
<p>DevCon 2026 early bird registration is now open! Save 40% when you register before December 1.</p>
<p>Date: March 15-17, 2027<br>Location: San Francisco, CA</p>`,
      snippet: 'DevCon 2026 early bird registration is now open! Save 40% when you register before Dec 1...',
      date: daysAgo(5),
      read: true, starred: false, important: false, snoozed: true, snoozedUntil: '2026-11-01T09:00:00', archived: false,
      labels: [], folder: 'snoozed', category: 'primary',
      attachments: [],
      replies: []
    },

    // ===== SPAM =====
    {
      id: 'e028', threadId: 't028',
      from: { name: 'Winner Notification', email: 'prize@totallylegit-winner.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'YOU HAVE WON $1,000,000!!!',
      body: `<p>CONGRATULATIONS! You have been selected as the winner of our international lottery!</p>
<p>Click below to claim your prize of ONE MILLION DOLLARS!</p>
<p>Send your bank details immediately to claim your prize.</p>`,
      snippet: 'CONGRATULATIONS! You have been selected as the winner of our international lottery!...',
      date: daysAgo(1),
      read: false, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'spam', category: 'primary',
      attachments: [],
      replies: []
    },
    {
      id: 'e029', threadId: 't029',
      from: { name: 'Cheap Meds Online', email: 'deals@pills-cheap-now.xyz' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Amazing deals on supplements!! Act now!!!',
      body: `<p>Buy our amazing supplements at 90% off! Limited time only!</p>`,
      snippet: 'Buy our amazing supplements at 90% off! Limited time only!...',
      date: daysAgo(3),
      read: false, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'spam', category: 'primary',
      attachments: [],
      replies: []
    },

    // ===== TRASH =====
    {
      id: 'e030', threadId: 't030',
      from: { name: 'Old Newsletter', email: 'weekly@oldnews.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Weekly Tech Roundup - Issue #156',
      body: `<p>This week in tech: AI advancements, new framework releases, and more.</p>`,
      snippet: 'This week in tech: AI advancements, new framework releases, and more...',
      date: daysAgo(7),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'trash', category: 'primary',
      attachments: [],
      replies: []
    },
    {
      id: 'e031', threadId: 't031',
      from: { name: 'Survey Team', email: 'survey@feedback.io' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Your feedback matters! Take our 2-minute survey',
      body: `<p>Please take a moment to share your experience with us.</p>`,
      snippet: 'Please take a moment to share your experience with us...',
      date: daysAgo(10),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'trash', category: 'primary',
      attachments: [],
      replies: []
    },

    // ===== MORE INBOX EMAILS =====
    {
      id: 'e032', threadId: 't032',
      from: { name: 'Ben Torres', email: 'ben.torres@techcorp.io' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Architecture Decision Record - Event Sourcing',
      body: `<p>Hi Sandeep,</p>
<p>I've drafted an ADR for adopting event sourcing in our order management system. Please review and add your thoughts.</p>
<p>Key considerations:</p>
<ul><li>Scalability improvements</li><li>Audit trail requirements</li><li>Complexity trade-offs</li></ul>
<p>Thanks,<br>Ben</p>`,
      snippet: 'ADR for adopting event sourcing in our order management system. Key considerations: scalability...',
      date: daysAgo(4),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: ['dev', 'work'], folder: 'inbox', category: 'primary',
      attachments: [{ name: 'ADR-023-Event-Sourcing.md', size: '12 KB', type: 'file' }],
      replies: []
    },
    {
      id: 'e033', threadId: 't033',
      from: { name: 'Figma', email: 'updates@figma.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: '✨ What\'s new in Figma - October Update',
      body: `<p>Hi Sandeep,</p><p>Check out the latest features in Figma including AI-powered design suggestions, improved prototyping tools, and more!</p>`,
      snippet: 'Check out the latest features in Figma including AI-powered design suggestions...',
      date: daysAgo(4),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'updates',
      attachments: [],
      replies: []
    },
    {
      id: 'e034', threadId: 't034',
      from: { name: 'Lisa Wang', email: 'lisa.w@techcorp.io' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: '1:1 Agenda Items for Next Week',
      body: `<p>Hi Sandeep,</p>
<p>Here are my agenda items for our 1:1 next Tuesday:</p>
<ul>
<li>Career growth discussion</li>
<li>Project allocation for Q1 2027</li>
<li>Team hiring plan feedback</li>
<li>Technical mentorship program</li>
</ul>
<p>Anything you'd like to add?</p>
<p>Lisa</p>`,
      snippet: 'Agenda items for our 1:1: career growth, project allocation, team hiring, mentorship...',
      date: daysAgo(5),
      read: true, starred: false, important: true, snoozed: false, archived: false,
      labels: ['work'], folder: 'inbox', category: 'primary',
      attachments: [],
      replies: []
    },
    {
      id: 'e035', threadId: 't035',
      from: { name: 'Stripe', email: 'receipts@stripe.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Payment receipt for CloudMail Pro',
      body: `<p>Your payment of <strong>$12.99</strong> for CloudMail Pro (Monthly) has been processed successfully.</p>
<p>Date: October 15, 2026<br>Payment method: Visa ending in 4242</p>`,
      snippet: 'Payment of $12.99 for CloudMail Pro (Monthly) processed successfully...',
      date: daysAgo(2),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: ['finance'], folder: 'inbox', category: 'updates',
      attachments: [{ name: 'Receipt_Oct2026.pdf', size: '45 KB', type: 'pdf' }],
      replies: []
    },

    // ===== ARCHIVED =====
    {
      id: 'e036', threadId: 't036',
      from: { name: 'Coursera', email: 'offers@coursera.org' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Complete your Machine Learning specialization',
      body: `<p>Hi Sandeep, you're 67% through the Machine Learning specialization. Keep going!</p>`,
      snippet: 'You\'re 67% through the Machine Learning specialization. Keep going!...',
      date: daysAgo(8),
      read: true, starred: false, important: false, snoozed: false, archived: true,
      labels: [], folder: 'archive', category: 'promotions',
      attachments: [],
      replies: []
    },
    {
      id: 'e037', threadId: 't037',
      from: { name: 'Tom Baker', email: 'tom.b@techcorp.io' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Testing Pipeline Setup - Done!',
      body: `<p>Hey Sandeep, just wanted to let you know the automated testing pipeline is up and running. All green! 🟢</p>`,
      snippet: 'The automated testing pipeline is up and running. All green! 🟢',
      date: daysAgo(6),
      read: true, starred: false, important: false, snoozed: false, archived: true,
      labels: ['dev'], folder: 'archive', category: 'primary',
      attachments: [],
      replies: []
    },

    // ===== MORE SENT =====
    {
      id: 'e038', threadId: 't038',
      from: { name: currentUser.name, email: currentUser.email },
      to: [{ name: 'Rachel Kim', email: 'rachel.kim@techcorp.io' }],
      cc: [], bcc: [],
      subject: 'Re: Code Review Request: Authentication Refactor',
      body: `<p>Hi Rachel,</p><p>I've reviewed the PR and left comments. Overall looks great! Just a few suggestions on the rate limiting implementation.</p><p>Sandeep</p>`,
      snippet: 'I\'ve reviewed the PR and left comments. Overall looks great! Just a few suggestions...',
      date: daysAgo(2),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: ['dev'], folder: 'sent', category: 'primary',
      attachments: [],
      replies: []
    },
    {
      id: 'e039', threadId: 't039',
      from: { name: currentUser.name, email: currentUser.email },
      to: [{ name: 'Emma Wilson', email: 'emma.w@university.edu' }],
      cc: [], bcc: [],
      subject: 'Re: Guest Lecture Invitation - Advanced Web Technologies',
      body: `<p>Dear Prof. Wilson,</p><p>Thank you for the kind invitation! I'd be delighted to give a guest lecture. November 12 works best for me. Let's coordinate the details.</p><p>Best,<br>Sandeep Kumar</p>`,
      snippet: 'Thank you for the kind invitation! I\'d be delighted. November 12 works best for me...',
      date: hoursAgo(6),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'sent', category: 'primary',
      attachments: [],
      replies: []
    },

    // More inbox for scroll
    {
      id: 'e040', threadId: 't040',
      from: { name: 'AWS', email: 'noreply@aws.amazon.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'AWS re:Invent 2026 - Register Now',
      body: `<p>Join us for AWS re:Invent 2026! Early registration is now open.</p>`,
      snippet: 'Join us for AWS re:Invent 2026! Early registration is now open...',
      date: daysAgo(6),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'promotions',
      attachments: [],
      replies: []
    },
    {
      id: 'e041', threadId: 't041',
      from: { name: 'Notion', email: 'team@makenotion.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Notion AI just got smarter 🧠',
      body: `<p>Discover the latest AI features in Notion that will supercharge your productivity.</p>`,
      snippet: 'Discover the latest AI features in Notion that will supercharge your productivity...',
      date: daysAgo(7),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'promotions',
      attachments: [],
      replies: []
    },
    {
      id: 'e042', threadId: 't042',
      from: { name: 'Rahul Kumar', email: 'rahul.k@cloudmail.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Bhai, check out this startup idea!',
      body: `<p>Hey bhai!</p><p>I have a crazy startup idea I want to bounce off you. It's about AI-powered local language learning. Can we chat this weekend?</p><p>Rahul</p>`,
      snippet: 'I have a crazy startup idea about AI-powered local language learning...',
      date: daysAgo(4),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: ['personal'], folder: 'inbox', category: 'primary',
      attachments: [],
      replies: []
    },
    {
      id: 'e043', threadId: 't043',
      from: { name: 'Instagram', email: 'notify@instagram.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'sandeep_codes, you have new activity',
      body: `<p>You have 24 new likes, 5 new comments, and 3 new followers since you last visited.</p>`,
      snippet: 'You have 24 new likes, 5 new comments, and 3 new followers...',
      date: daysAgo(3),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'social',
      attachments: [],
      replies: []
    },
    {
      id: 'e044', threadId: 't044',
      from: { name: 'Vercel', email: 'ship@vercel.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Your deployment is live: cloudmail-frontend',
      body: `<p>Your project <strong>cloudmail-frontend</strong> has been deployed successfully.</p>
<p>Production URL: cloudmail-frontend.vercel.app<br>Commit: feat: add dark mode support<br>Deploy time: 32s</p>`,
      snippet: 'Your project cloudmail-frontend has been deployed successfully. Deploy time: 32s...',
      date: daysAgo(2),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: ['dev'], folder: 'inbox', category: 'updates',
      attachments: [],
      replies: []
    },
    {
      id: 'e045', threadId: 't045',
      from: { name: 'Calendar Reminder', email: 'calendar@cloudmail.com' },
      to: [{ name: currentUser.name, email: currentUser.email }],
      cc: [], bcc: [],
      subject: 'Reminder: Team Standup in 15 minutes',
      body: `<p>Reminder: <strong>Team Standup</strong> starts in 15 minutes.</p>
<p>Time: 10:00 AM IST<br>Duration: 15 minutes<br>Meeting link: meet.cloudmail.com/abc-defg-hij</p>`,
      snippet: 'Reminder: Team Standup starts in 15 minutes at 10:00 AM IST...',
      date: hoursAgo(3),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'inbox', category: 'updates',
      attachments: [],
      replies: []
    }
  ];

  const sampleContacts = [
    { id: 'c001', name: 'Alex Thompson', email: 'alex.thompson@techcorp.io', phone: '+1 (555) 234-5678', company: 'TechCorp', title: 'VP of Product', groups: ['work', 'frequent'], notes: 'Direct report. Manages product team.', avatarColor: '#1a73e8' },
    { id: 'c002', name: 'Sarah Chen', email: 'sarah.chen@designstudio.com', phone: '+1 (555) 345-6789', company: 'Design Studio', title: 'Lead Designer', groups: ['work', 'frequent'], notes: 'UI/UX partner for web redesign project.', avatarColor: '#e91e63' },
    { id: 'c003', name: 'David Park', email: 'david.park@techcorp.io', phone: '+1 (555) 456-7890', company: 'TechCorp', title: 'Engineering Manager', groups: ['work'], notes: 'Sprint retrospective coordinator.', avatarColor: '#009688' },
    { id: 'c004', name: 'Lisa Wang', email: 'lisa.w@techcorp.io', phone: '+1 (555) 567-8901', company: 'TechCorp', title: 'Director of Engineering', groups: ['work', 'frequent'], notes: 'Manager. Weekly 1:1 meetings.', avatarColor: '#7c4dff' },
    { id: 'c005', name: 'Rachel Kim', email: 'rachel.kim@techcorp.io', phone: '+1 (555) 678-9012', company: 'TechCorp', title: 'Senior Engineer', groups: ['work'], notes: 'Auth refactor project lead.', avatarColor: '#f09300' },
    { id: 'c006', name: 'James Rodriguez', email: 'j.rodriguez@cloudmail.com', phone: '+1 (555) 789-0123', company: 'CloudMail', title: 'Team Lead', groups: ['work', 'frequent'], notes: 'Organizes team events.', avatarColor: '#188038' },
    { id: 'c007', name: 'Priya Patel', email: 'priya.patel@startup.io', phone: '+91 98765 43210', company: 'StartupIO', title: 'CEO & Co-founder', groups: ['business'], notes: 'Partnership opportunity. AI analytics.', avatarColor: '#d50000' },
    { id: 'c008', name: 'Emma Wilson', email: 'emma.w@university.edu', phone: '+1 (555) 890-1234', company: 'State University', title: 'Professor', groups: ['education'], notes: 'Guest lecture invitation for Nov 2026.', avatarColor: '#8e24aa' },
    { id: 'c009', name: 'Maria Garcia', email: 'maria.garcia@freelance.com', phone: '+1 (555) 901-2345', company: 'Freelance', title: 'Design Consultant', groups: ['business'], notes: 'Monthly invoicing. Reliable designer.', avatarColor: '#e37400' },
    { id: 'c010', name: 'Ben Torres', email: 'ben.torres@techcorp.io', phone: '+1 (555) 012-3456', company: 'TechCorp', title: 'Principal Architect', groups: ['work'], notes: 'Architecture decisions and ADRs.', avatarColor: '#0b8043' },
    { id: 'c011', name: 'Tom Baker', email: 'tom.b@techcorp.io', phone: '+1 (555) 111-2222', company: 'TechCorp', title: 'DevOps Engineer', groups: ['work'], notes: 'CI/CD pipeline management.', avatarColor: '#039be5' },
    { id: 'c012', name: 'Sunita Kumar', email: 'sunita.kumar@cloudmail.com', phone: '+91 98765 12345', company: '', title: '', groups: ['family'], notes: 'Mom ❤️', avatarColor: '#b3005e' },
    { id: 'c013', name: 'Rahul Kumar', email: 'rahul.k@cloudmail.com', phone: '+91 87654 32109', company: 'TechStartups India', title: 'Founder', groups: ['family', 'business'], notes: 'Cousin. Bangalore. Startup ideas.', avatarColor: '#f4b400' },
    { id: 'c014', name: 'Mike Johnson', email: 'mike.j@designstudio.com', phone: '+1 (555) 222-3333', company: 'Design Studio', title: 'UI Developer', groups: ['work'], notes: 'Works with Sarah on design implementations.', avatarColor: '#3f51b5' },
    { id: 'c015', name: 'Jennifer Lee', email: 'jen.lee@consulting.com', phone: '+1 (555) 333-4444', company: 'Lee Consulting', title: 'Senior Consultant', groups: ['business'], notes: 'Cybersecurity consultant.', avatarColor: '#ff5722' },
    { id: 'c016', name: 'Carlos Mendez', email: 'carlos.m@startup.io', phone: '+1 (555) 444-5555', company: 'StartupIO', title: 'CTO', groups: ['business'], notes: 'Technical counterpart to Priya.', avatarColor: '#795548' },
    { id: 'c017', name: 'Anita Sharma', email: 'anita.sharma@cloudmail.com', phone: '+91 76543 21098', company: '', title: '', groups: ['family'], notes: 'Aunt. Mumbai.', avatarColor: '#009688' },
    { id: 'c018', name: 'Kevin Brown', email: 'kevin.brown@techcorp.io', phone: '+1 (555) 555-6666', company: 'TechCorp', title: 'Product Manager', groups: ['work'], notes: 'Manages the dashboard product.', avatarColor: '#607d8b' }
  ];

  const defaultLabels = [
    { id: 'l001', name: 'work', color: '#1a73e8', visible: true },
    { id: 'l002', name: 'personal', color: '#188038', visible: true },
    { id: 'l003', name: 'finance', color: '#f09300', visible: true },
    { id: 'l004', name: 'dev', color: '#8e24aa', visible: true },
    { id: 'l005', name: 'design', color: '#e91e63', visible: true },
    { id: 'l006', name: 'devops', color: '#d50000', visible: true },
    { id: 'l007', name: 'shopping', color: '#039be5', visible: true }
  ];

  const defaultFilters = [
    { id: 'f001', from: 'alerts@monitoring.techcorp.io', action: 'label', label: 'devops', applyTo: 'matching', active: true, description: 'DevOps alerts → apply "devops" label' },
    { id: 'f002', subject: 'Invoice', action: 'label', label: 'finance', applyTo: 'matching', active: true, description: 'Emails with "Invoice" in subject → apply "finance" label' },
    { id: 'f003', from: '@github.com', action: 'label', label: 'dev', applyTo: 'matching', active: true, description: 'GitHub notifications → apply "dev" label' }
  ];

  const defaultSettings = {
    // General
    language: 'English',
    phoneNumber: '',
    maxPageSize: 50,
    undoSendDelay: 5, // seconds
    defaultTextStyle: 'Sans Serif, Normal, Small',
    defaultReplyBehavior: 'reply',
    conversationView: true,
    sendAndArchive: true,
    spellingCheck: true,
    autoCorrect: true,
    richTextByDefault: true,
    // Stars
    starsInUse: ['yellow-star'],
    // Inbox
    inboxType: 'default', // default, important-first, unread-first, starred-first, priority
    readingPane: 'none', // none, right, bottom
    categories: { primary: true, social: true, promotions: true, updates: true, forums: false },
    // Notifications
    desktopNotifications: 'off', // off, new-mail, important
    notificationSound: true,
    // Display
    density: 'default', // comfortable, default, compact
    theme: 'light', // light, dark, auto
    buttonLabels: 'icons', // icons, text, icons-text
    // Advanced
    autoAdvance: 'newer', // newer, older, list
    keyboardShortcuts: true,
    snippets: true,
    personalLevelIndicators: false,
    // Signature
    signature: '<p>Best regards,<br>Sandeep Kumar<br>Senior Software Engineer</p>',
    signatureEnabled: true,
    // Vacation
    vacationResponder: false,
    vacationSubject: '',
    vacationMessage: '',
    vacationStartDate: '',
    vacationEndDate: '',
    vacationContactsOnly: false,
    // Offline
    offlineEnabled: false,
    // Forwarding
    forwardingAddress: '',
    forwardingEnabled: false,
    popEnabled: false,
    imapEnabled: true
  };

  const contactGroups = [
    { id: 'g001', name: 'work', count: 0 },
    { id: 'g002', name: 'family', count: 0 },
    { id: 'g003', name: 'business', count: 0 },
    { id: 'g004', name: 'education', count: 0 },
    { id: 'g005', name: 'frequent', count: 0 }
  ];

  const signatures = [
    {
      id: 'sig001',
      name: 'Default',
      content: '<p>Best regards,<br><strong>Sandeep Kumar</strong><br>Senior Software Engineer<br>TechCorp | sandeep.kumar@cloudmail.com</p>'
    },
    {
      id: 'sig002',
      name: 'Casual',
      content: '<p>Cheers,<br>Sandeep 🚀</p>'
    }
  ];

  return {
    currentUser,
    otherAccounts,
    sampleEmails,
    sampleContacts,
    defaultLabels,
    defaultFilters,
    defaultSettings,
    contactGroups,
    signatures
  };
})();
