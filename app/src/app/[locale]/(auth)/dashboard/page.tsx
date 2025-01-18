import { useTranslations } from 'next-intl';

import { TitleBar } from '@/features/dashboard/TitleBar';

const DashboardIndexPage = () => {
  const t = useTranslations('DashboardIndex');

  return (
    <>
      <TitleBar
        title={t('title_bar')}
      />

     
    </>
  );
};

export default DashboardIndexPage;
