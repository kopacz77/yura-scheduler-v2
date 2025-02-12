export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          Built by{' '}
          <a
            href="https://kopacz77.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            kopacz77
          </a>
          . The source code is available on{' '}
          <a
            href="https://github.com/kopacz77/yura-scheduler-v2"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}