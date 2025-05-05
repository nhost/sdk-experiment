interface SearchParams {
    message?: string;
  }
  
  export default function VerificationError({
    searchParams,
  }: {
    searchParams: SearchParams;
  }) {
    const errorMessage = searchParams.message || 'Verification failed';
    
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="glass-card w-full p-8 mb-6">
          <h2 className="text-2xl mb-6">Verification Failed</h2>
          <p className="text-red-500">{errorMessage}</p>
        </div>
      </div>
    );
  }