import { MemberAPI } from '@/api';
import { AddMemberModel, Button } from '@/components';
import type { User } from '@/types/api/auth.types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

export default function MembersPage() {
  const [members, setMembers] = useState<User[]>([]);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  useEffect(() => {
    const toastId = toast.loading('Loading family members...');
    MemberAPI.getAll()
      .then((response) => {
        setMembers(response.data);
        toast.success('Family members loaded successfully!', { id: toastId });
      })
      .catch((error) => {
        console.error('Failed to fetch members:', error);
        toast.error('Failed to load family members.', { id: toastId });
      });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Family Members</h1>
          <p className="text-muted-foreground">Manage your family members.</p>
        </div>
        <Button onClick={() => setIsAddMemberModalOpen(true)}>
          Invite Member
        </Button>
      </div>

      {/* Members List */}
      <div className="grid gap-6">
        {members.map((member) => (
          <Link
            to={`/members/${member._id}`}
            className="bg-card border-border rounded-xl border p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="from-primary to-primary/80 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br shadow-sm">
                  <span className="text-primary-foreground text-lg font-bold">
                    {member.firstname.charAt(0).toUpperCase()}
                    {member.lastname.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg leading-none font-semibold">
                    {member.firstname} {member.lastname}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {member.email}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      member.role === 'admin'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-primary/5"
                >
                  View
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <AddMemberModel
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
      />
    </div>
  );
}
