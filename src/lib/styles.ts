export const getLessonTypeStyle = (type: string): string => {
  const styles: Record<string, string> = {
    'private': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'choreography': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'competition-prep': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'group': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'seminar': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  };

  return styles[type.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
};