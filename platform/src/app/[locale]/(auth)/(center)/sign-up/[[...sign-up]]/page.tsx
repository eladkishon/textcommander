import { SignUp } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';

import { getI18nPath } from '@/utils/Helpers';
import { DefaultParams } from '@/types/Params';

export async function generateMetadata(props: { params: DefaultParams }) {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'SignUp',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const SignUpPage = async (props: { params: DefaultParams }) => {
  const params = await props.params;
  return <SignUp path={getI18nPath('/sign-up', params.locale)} />;
};

export default SignUpPage;
