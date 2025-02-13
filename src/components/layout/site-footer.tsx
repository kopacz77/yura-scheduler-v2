export function SiteFooter() {
  return (
    <footer className="h-14 border-t bg-white text-sm text-muted-foreground flex items-center justify-center">
      Built by{' '}
      <a
        href="https://kopacz77.com"
        target="_blank"
        rel="noreferrer"
        className="ml-1 font-medium underline underline-offset-4"
      >
        kopacz77
      </a>
      . The source code is available on{' '}
      <a
        href="https://github.com/kopacz77/yura-scheduler-v2"
        target="_blank"
        rel="noreferrer"
        className="ml-1 font-medium underline underline-offset-4"
      >
        GitHub
      </a>
      .
    </footer>
  );
}