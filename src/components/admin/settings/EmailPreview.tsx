'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface EmailPreviewProps {
  template: string;
  variables: Record<string, string>;
}

// Export both named and default export for compatibility
export function EmailPreview({ template, variables }: EmailPreviewProps) {
  const processTemplate = (template: string) => {
    let processed = template;
    Object.entries(variables).forEach(([key, value]) => {
      processed = processed.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });
    return processed;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Template Variables</Label>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="flex justify-between p-2 bg-muted rounded">
                <span className="font-mono">{`{${key}}`}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="p-4 bg-muted rounded whitespace-pre-wrap">
            {processTemplate(template)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Also export as default for pages that use default import
export default EmailPreview;