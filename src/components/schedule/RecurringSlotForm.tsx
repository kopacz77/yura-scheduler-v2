import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const slotSchema = z.object({
  duration: z.number().min(15).max(120),
  maxStudents: z.number().min(1).max(10),
  startTime: z.string(),
  endTime: z.string(),
  daysOfWeek: z.array(z.number().min(0).max(6)),
});

type SlotFormData = z.infer<typeof slotSchema>;

export interface RecurringSlotFormProps {
  onSubmit: (data: SlotFormData) => void;
  onCancel: () => void;
}

const RecurringSlotForm = ({ onSubmit, onCancel }: RecurringSlotFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SlotFormData>({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      duration: 30,
      maxStudents: 1,
      daysOfWeek: [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default RecurringSlotForm;