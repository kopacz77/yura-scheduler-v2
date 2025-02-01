import { Error } from '@/components/ui/error';

export default function RinkNotFound() {
  return (
    <Error
      title="Rink not found"
      message="The requested rink could not be found."
    />
  );
}
