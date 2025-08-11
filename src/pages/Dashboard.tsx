const Dashboard = () => {
  const lastResume = typeof window !== 'undefined' ? localStorage.getItem('cb:resume:last') : null;
  const resume = lastResume ? JSON.parse(lastResume) : null;
  const jobAlerts = typeof window !== 'undefined' ? localStorage.getItem('cb:jobs:alerts') : null;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-medium mb-2">Saved Resume</h2>
          {resume ? (
            <pre className="p-4 bg-muted rounded-md text-sm overflow-auto">{JSON.stringify(resume, null, 2)}</pre>
          ) : (
            <p className="text-muted-foreground">No resume saved yet. Build one in the Resume page.</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-medium mb-2">Job Alert Subscription</h2>
          {jobAlerts ? (
            <pre className="p-4 bg-muted rounded-md text-sm overflow-auto">{jobAlerts}</pre>
          ) : (
            <p className="text-muted-foreground">No alerts yet. Subscribe from the Jobs page.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
