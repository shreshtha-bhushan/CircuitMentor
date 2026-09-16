export default function SmallScreenNotice() {
  return (
    <div className="small-screen-notice">
      {/* Wordmark */}
      <div className="notice-logo">
        <svg viewBox="0 0 32 32" fill="currentColor" width="48" height="48">
          <path d="M16 2L4 9v14l12 7 12-7V9L16 2zm0 3l8 4.6v9.8L16 24l-8-4.6V9.6L16 5z"/>
          <circle cx="16" cy="16" r="4"/>
        </svg>
      </div>

      <h1 className="notice-title">Use a larger screen</h1>

      <p className="notice-body">
        CircuitMentor needs a tablet or laptop to place and wire components.
        Open this page on a device with a screen width of at least 768 pixels.
      </p>
    </div>
  );
}
