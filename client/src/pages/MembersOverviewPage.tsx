import { AccountAPI, MemberAPI } from '@/api';
import EditMemberModel from '@/components/EditMemberModel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Account } from '@/types/api/account.types';
import type { User } from '@/types/api/auth.types';
import { ArrowLeft, Edit3, Trash2, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

const MembersOverviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEditMemberModelOpen, setIsEditMemberModelOpen] = useState(false);
  const [member, setMember] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error('Member ID is required');
      return;
    }
    MemberAPI.getMemberById(id || '')
      .then((response) => {
        if (response.success) {
          setMember(response.data);
        } else {
          console.error('Failed to fetch member data:', response.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching member data:', error);
      });

    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const response = await AccountAPI.getAll(id);

        if (response.success) {
          setAccounts(response.data);
        } else {
          toast.error(response.message || 'Failed to fetch accounts');
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        toast.error('An error occurred while fetching accounts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [id]);
  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {member && (
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={member.avatar}
                  alt={`${member.firstname} ${member.lastname}`}
                />
                <AvatarFallback>
                  {member.firstname
                    ? member.firstname.charAt(0).toUpperCase() +
                      member.lastname.charAt(0).toUpperCase()
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  {member.firstname} {member.lastname}
                </h1>
                <p className="text-muted-foreground">
                  {member.email} • {member.role}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditMemberModelOpen(true)}
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button variant="outline" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Accounts</h2>
            <p className="text-muted-foreground">
              {member?.firstname}'s account overview
            </p>
          </div>
        </div>

        {accounts.length === 0 && !isLoading ? (
          <div className="py-12 text-center">
            <div className="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Wallet className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No accounts found</h3>
            <p className="text-muted-foreground text-sm">
              Once they add an account, it will show here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <div
                key={account._id}
                className="bg-card border-border hover:border-primary/20 rounded-xl border p-6 transition-all duration-200 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm`}
                      style={{
                        backgroundColor: `${account.color.hex}20`,
                        border: `2px solid ${account.color.hex}`,
                      }}
                    >
                      <img
                        src={account.icon.url}
                        alt={account.name}
                        className="h-6 w-6"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{account.name}</h3>
                      <p className="text-muted-foreground text-sm">Account</p>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground text-2xl font-bold">
                    ₹ {account.currentBalance.toFixed(2)}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Available Balance
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {member && (
        <EditMemberModel
          onClose={() => setIsEditMemberModelOpen(false)}
          isOpen={isEditMemberModelOpen}
          member={member}
          onUpdate={(data) => setMember(data)}
        />
      )}
    </div>
  );
};

export default MembersOverviewPage;
