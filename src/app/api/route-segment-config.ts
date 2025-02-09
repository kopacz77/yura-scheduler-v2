export const config = {
  runtime: 'edge',  // Use edge runtime for better performance
  dynamic: 'force-dynamic',  // Always generate dynamically
  revalidate: 0,  // Disable caching
  headers: {
    'Cache-Control': 'no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
};
