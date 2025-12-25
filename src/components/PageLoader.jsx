export default function PageLoader({ loading }) {
  if (!loading) return null;

  return (
    <div id="pageLoader" className="page-loader">
      <div className="loader-spinner"></div>
    </div>
  );
}

