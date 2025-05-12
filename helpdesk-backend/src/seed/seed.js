const mongoose = require('mongoose');
const TicketType = require('../models/ticketType.model');
const Classification = require('../models/classification.model');
const Agent = require('../models/agent.model');
const Group = require('../models/group.model');
const Stage = require('../models/stage.model');
const SLA = require('../models/sla.model');

mongoose.connect('mongodb://localhost:27017/helpdesk');

(async () => {
  await Group.deleteMany();
  const group = await Group.create({ name: 'Order Support', description: 'Handles order-related tickets' });

  await Agent.deleteMany();
  const agent = await Agent.create({ name: 'Ajay Bansal', email: 'ajay@example.com', role: 'admin', groupId: group._id });

  await Classification.deleteMany();
  await Classification.create({ type: 'order', name: 'Delivery Delay', defaultPriority: 'High', autoAssignGroup: group.name });

  await TicketType.deleteMany();
  await TicketType.create({
    name: 'Order Issue',
    description: 'Used for issues related to orders',
    teamId: group._id,
    fields: [
      { name: 'orderId', label: 'Order ID', type: 'string', required: true },
      { name: 'issueType', label: 'Issue Type', type: 'select', options: ['Delayed', 'Damaged', 'Wrong Item'], required: true }
    ],
    createdBy: agent._id
  });

  await Stage.deleteMany();
  await Stage.insertMany([
    { name: 'Triage', order: 1, type: 'order' },
    { name: 'Investigating', order: 2, type: 'order' },
    { name: 'Resolved', order: 3, type: 'order' }
  ]);

  await SLA.deleteMany();
  await SLA.create({ name: 'Default SLA', appliesTo: 'order', responseTimeMinutes: 60, resolutionTimeMinutes: 1440 });

  console.log('✅ Seed data loaded.');
  process.exit();
})();
