'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Lesson } from '@/types/schedule';
import { useLessons } from '@/hooks/useLessons';
import { AlertCircle, Clock, MapPin } from 'lucide-react';

interface LessonDetailsProps {
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonDetails({ lesson, isOpen, onClose }: LessonDetailsProps) {
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const { cancelLesson } = useLessons();

  const handleCancellation = async () => {
    try {
      setIsCancelling(true);
      await cancelLesson(lesson.id, cancellationReason);
      onClose();
    } catch (error) {
      console.error('Failed to cancel lesson:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const isUpcoming = new Date(lesson.startTime) > new Date();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lesson Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {format(new Date(lesson.startTime), 'MMM d, yyyy h:mm a')} -
                {format(new Date(lesson.endTime), 'h:mm a')}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{lesson.rinkId}</span>
            </div>
          </div>

          {lesson.status === 'cancelled' && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Cancelled</h3>
                  {lesson.cancellationReason && (
                    <p className="mt-2 text-sm text-red-700">
                      Reason: {lesson.cancellationReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {isUpcoming && lesson.status !== 'cancelled' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cancellationReason">Cancellation Reason</Label>
                <Textarea
                  id="cancellationReason"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Please provide a reason for cancellation"
                />
              </div>

              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={handleCancellation}
                  disabled={isCancelling || !cancellationReason.trim()}
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Lesson'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
