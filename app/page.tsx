import ClientRoot from '@/components/ClientRoot';

/**
 * Root page — Server Component that renders the interactive client root.
 * Keeping this as a Server Component lets Next.js optimize the initial HTML shell.
 */
export default function Page() {
  return <ClientRoot />;
}
