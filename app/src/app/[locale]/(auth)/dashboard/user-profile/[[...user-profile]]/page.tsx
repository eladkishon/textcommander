import { UserProfile } from '@clerk/nextjs';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { getI18nPath } from '@/utils/Helpers';
import { DefaultParams } from '@/types/Params';
import { getTranslations } from 'next-intl/server';

const UserProfilePage = async (props: { params: DefaultParams }) => {
  const params = await props.params;
  const t = await getTranslations('UserProfile');

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <UserProfile
        routing="path"
        path={getI18nPath('/dashboard/user-profile', params.locale)}
        appearance={{
          elements: {
            rootBox: 'w-full',
            cardBox: 'w-full flex',
          },
        }}
      />
    </>
  );
};

export default UserProfilePage;
