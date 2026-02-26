import { UserProfile } from '@clerk/nextjs';

export default function MyAccountPage() {
  return (
    <div className="flex justify-center p-6">
      <UserProfile
        path="/dashboard/my-account"
        routing="path"
      />
    </div>
  );
}
