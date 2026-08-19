import BondsCalculator from './page-client';

// Server components should be used for logic such as data fetching from a database,
// preloading data, providing SEO metadata, authentication, and any operations that need
// to run securely or with access to sensitive environment variables.
// Place only UI rendering and safe-to-run-on-server logic here; delegate interactive or browser-specific logic to client components.
export default function Home() {
  return <BondsCalculator />;
}
