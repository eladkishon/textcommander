import { SignIn } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';

import { getI18nPath } from '@/utils/Helpers';
import { DefaultParams } from '@/types/Params';



export async function generateMetadata(props: { params: DefaultParams }) {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'SignIn',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const SignInPage = async (props: { params: DefaultParams }) => {
  const params = await props.params;
  return <SignIn path={getI18nPath('/sign-in', params.locale)} />;
};

export default SignInPage;
