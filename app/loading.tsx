export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary">Loading SkillShake...</p>
      </div>
    </div>
  );
}
