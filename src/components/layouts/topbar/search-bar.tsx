import { SearchIcon } from '@/components/icons/search-icon';
import { TermsIcon } from '@/components/icons/sidebar';
import { searchModalInitialValues } from '@/utils/constants';
import Link from '@/components/ui/link';
import Scrollbar from '@/components/ui/scrollbar';
import { useMeQuery } from '@/data/user';
import { siteSettings } from '@/settings/site.settings';
import {
  adminOnly,
  getAuthCredentials,
  hasAccess,
  ownerOnly,
} from '@/utils/auth-utils';
import { STAFF } from '@/utils/constants';
import {
  ChildMenu,
  extractHrefObjects,
  formatOwnerLinks,
  getUrlLinks,
} from '@/utils/searched-url';
import cn from 'classnames';
import { useAtom } from 'jotai';
import { isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

type IProps = {};

const SearchBar: React.FC<IProps> = ({}: IProps) => {
  const { t } = useTranslation();
  const initialItem: ChildMenu[] = [];
  const [searchText, setSearchText] = useState('');
  const [searchItem, setSearchItem] = useState(initialItem);
  const [searchModal] = useAtom(searchModalInitialValues);
  let {
    query: { shop },
    locale,
  } = useRouter();
  const { permissions: currentUserPermissions } = getAuthCredentials();
  const { data: me } = useMeQuery();

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (!text || text.length < 1) {
      setSearchItem([]);
      return;
    }
  };

  useEffect(() => {
    if (searchText === '') {
      setSearchItem(initialItem);
    } else {
      handleSearch(searchText);
    }
  }, [searchText]);

  return (
    <Fragment>
      <div
        className={cn('fixed inset-0', searchText === '' && 'hidden')}
        onClick={() => setSearchText('')}
      />
      <div className="relative w-full max-w-lg rounded-3xl">
      </div>

      {!isEmpty(searchItem) ? (
        <div className="sidebar-scrollbar absolute top-12 z-30 h-[418px] max-h-[418px] w-full max-w-lg rounded-xl border border-solid border-gray-200 bg-white py-4 shadow-box lg:top-[74px]">
        </div>
      ) : null}
    </Fragment>
  );
};

export default SearchBar;
