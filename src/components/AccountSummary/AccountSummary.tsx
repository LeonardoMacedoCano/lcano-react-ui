import { Button } from '../Button';
import { Stack } from '../Stack';
import { Locale } from '../../types';

export interface AccountSummaryUser {
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface AccountSummaryProps {
  user: AccountSummaryUser;
  onLogout: () => void;
  showEmail?: boolean;
  locale?: Locale;
}

const UI_TEXT: Record<Locale, { logoutLabel: string }> = {
  pt: { logoutLabel: 'Sair' },
  en: { logoutLabel: 'Log out' },
};

const AccountSummary = ({ user, onLogout, showEmail, locale = 'pt' }: AccountSummaryProps) => {
  const text = UI_TEXT[locale];

  return (
    <Stack direction="row" gap="10px" alignCenter justifyBetween style={{ padding: '10px 20px' }}>
      <Stack direction="row" gap="10px" alignCenter width="auto" style={{ minWidth: 0 }}>
        {user.avatarUrl && (
          <img src={user.avatarUrl} alt="" width={40} height={40} style={{ borderRadius: '50%', flexShrink: 0 }} />
        )}
        <Stack direction="column" gap="2px" width="auto" style={{ minWidth: 0 }}>
          <span style={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.name}
          </span>
          {showEmail && user.email && (
            <span style={{ fontSize: '0.85em', opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </span>
          )}
        </Stack>
      </Stack>
      <Button description={text.logoutLabel} variant="secondary" onClick={onLogout} style={{ flexShrink: 0 }} />
    </Stack>
  );
};

export default AccountSummary;
