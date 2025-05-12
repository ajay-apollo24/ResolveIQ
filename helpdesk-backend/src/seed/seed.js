const mongoose = require('mongoose');
const Agent = require('../models/agent.model');
const Classification = require('../models/classification.model');
const Group = require('../models/group.model');
const Ticket = require('../models/ticket.model');
const SLA = require('../models/sla.model');
const Stage = require('../models/stage.model');

mongoose.connect('mongodb://localhost:27017/helpdesk');

(async () => {
  await Group.deleteMany();
  const group = await Group.create({ name: 'Order Support', description: 'Handles order-related tickets' });

  await Agent.deleteMany();
  const agent = await Agent.create({
    name: 'Ajay Bansal',
    email: 'ajay@example.com',
    role: 'admin',
    isActive: true,
    groupId: group._id
  });

  await Classification.deleteMany();
  const classification = await Classification.create({
    type: 'order',
    name: 'Delivery Delay',
    defaultPriority: 'High',
    autoAssignGroup: group.name
  });

  await Ticket.deleteMany();
  await Ticket.create({
    subject: 'Late delivery of order #12345',
    type: 'order',
    status: 'open',
    stage: 'Triage',
    priority: 'High',
    classificationId: classification._id,
    agentId: agent._id,
    externalRefs: {
      customerId: 'CUST_1001',
      orderId: 'ORD_12345'
    },
    customFields: {
      orderId: 'ORD_12345',
      issueType: 'Delayed'
    },
    notes: [
      {
        authorId: agent._id,
        type: 'public',
        message: 'Customer reported a late delivery.',
        createdAt: new Date()
      }
    ]
  });

  await SLA.deleteMany();
  await SLA.create({
    name: 'Standard SLA',
    appliesTo: 'order',
    responseTimeMinutes: 60,
    resolutionTimeMinutes: 1440
  });

  await Stage.deleteMany();
  await Stage.insertMany([
    { name: 'Triage', order: 1, type: 'order' },
    { name: 'Assigned', order: 2, type: 'order' },
    { name: 'Resolved', order: 3, type: 'order' },
    { name: 'Closed', order: 4, type: 'order' }
  ]);

  console.log('✅ Seed data loaded successfully.');
  process.exit();
})();
