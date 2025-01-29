'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LessonConfirmation } from '@/lib/email/templates/LessonConfirmation';
import { PaymentReceipt } from '@/lib/email/templates/PaymentReceipt';
import { ScheduleReminder } from '@/lib/email/templates/ScheduleReminder';

// Sample data for preview
const sampleStudent = {
  id: '1',
  name: 'John Smith',
  email: 'john@example.com',
  phone: '123-456-7890',
  level: 'INTERMEDIATE',
  notes: 'Sample student notes',
  preferredPayment: 'VENMO',
  startDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const sampleAppointment = {
  id: '1',
  title: 'Private Lesson',
  start: new Date(),
  end: new Date(Date.now() + 60 * 60 * 1000),
  lessonType: 'PRIVATE',
  notes: 'Sample lesson notes',
  studentId: '1',
  resourceId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const samplePayment = {
  id: '1',
  amount: 75.00,
  method: 'VENMO',
  status: 'CONFIRMED',
  confirmationId: 'VNM123456',
  appointmentId: '1',
  studentId: '1',
  notes: 'Sample payment notes',
  paidAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const templates = [
  {
    id: 'lesson-confirmation',
    name: 'Lesson Confirmation',
    component: LessonConfirmation,
    props: {
      student: sampleStudent,
      appointment: sampleAppointment,
      cancelUrl: 'http://example.com/cancel',
    },
  },
  {
    id: 'payment-receipt',
    name: 'Payment Receipt',
    component: PaymentReceipt,
    props: {
      student: sampleStudent,
      appointment: sampleAppointment,
      payment: samplePayment,
    },
  },
  {
    id: 'schedule-reminder',
    name: 'Schedule Reminder',
    component: ScheduleReminder,
    props: {
      student: sampleStudent,
      appointment: sampleAppointment,
      manageUrl: 'http://example.com/manage',
    },
  },
];

export function EmailPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [testEmailAddress, setTestEmailAddress] = useState('');

  const template = templates.find(t => t.id === selectedTemplate);
  const TemplateComponent = template?.component;

  const handleSendTest = async () => {
    // Implement test email sending functionality
    console.log('Sending test email to:', testEmailAddress);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Email Template Preview</CardTitle>
          <div className="flex items-center gap-4">
            <Select
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSendTest}
              disabled={!testEmailAddress}
            >
              Send Test
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-white p-6">
          {TemplateComponent && <TemplateComponent {...template?.props} />}
        </div>
      </CardContent>
    </Card>
  );
}
